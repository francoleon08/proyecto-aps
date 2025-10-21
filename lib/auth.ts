import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase/admin";
import { Tables } from "@/types/database";
import { DashboardMetrics, RecentSession } from "@/types/custom";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  user_type?: Tables<'users'>['user_type'];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  user_type: Tables<'users'>['user_type'];
  status: Tables<'users'>['status'];
  created_at: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Register new user
export async function registerUser(
  data: RegisterData
): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Email inválido" };
    }

    // Validate password
    if (data.password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Call Supabase function
    const { data: result, error } = await supabaseAdmin.rpc(
      "register_user",
      {
        p_name: data.name,
        p_email: data.email,
        p_password: hashedPassword,
        p_user_type: data.user_type || "client",
      }
    );

    if (error) {
      console.error("Error registering user:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Get the newly created user
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, name, email, user_type, status, created_at")
      .eq("id", result.user_id)
      .single();

    if (userError || !userData) {
      return { success: false, error: "Error al obtener datos del usuario" };
    }

    return {
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        user_type: userData.user_type,
        status: userData.status,
        created_at: userData.created_at,
      },
    };
  } catch (error) {
    console.error("Error in registerUser:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Login user
export async function loginUser(
  credentials: LoginCredentials,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    // Get user by email first
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", credentials.email)
      .single();

    if (userError || !userData) {
      // Log failed login attempt
      await logSessionAction(
        null,
        'login_failed',
        ipAddress,
        userAgent,
        { email: credentials.email, reason: 'user_not_found' }
      );
      return { success: false, error: "Credenciales inválidas" };
    }

    // Check if user is active
    if (userData.status !== 'active') {
      // Log failed login attempt
      await logSessionAction(
        userData.id,
        'login_failed',
        ipAddress,
        userAgent,
        { email: credentials.email, reason: 'account_inactive' }
      );
      return { success: false, error: "Cuenta inactiva. Contacte al administrador." };
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      credentials.password,
      userData.password
    );

    if (!isValidPassword) {
      // Log failed login attempt
      await logSessionAction(
        userData.id,
        'login_failed',
        ipAddress,
        userAgent,
        { email: credentials.email, reason: 'invalid_password' }
      );
      return { success: false, error: "Credenciales inválidas" };
    }

    // Log successful login
    await logSessionAction(
      userData.id,
      'login',
      ipAddress,
      userAgent
    );

    return {
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        user_type: userData.user_type,
        status: userData.status,
        created_at: userData.created_at,
      },
    };
  } catch (error) {
    console.error("Error in loginUser:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Get user by ID
export async function getUserById(
  id: string
): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const { data: result, error } = await supabaseAdmin.rpc(
      "get_user_by_id",
      { p_id: id }
    );

    if (error) {
      console.error("Error getting user by ID:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Check if email already exists
export async function emailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}

// Log session action
export async function logSessionAction(
  userId: string | null,
  action: Tables<'sessions'>['action'],
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from("sessions")
      .insert({
        user_id: userId,
        action,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
        metadata: metadata || null,
      });

    if (error) {
      console.error("Error logging session action:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in logSessionAction:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Admin functions

// Get dashboard metrics
export async function getDashboardMetrics(): Promise<{ success: boolean; error?: string; metrics?: DashboardMetrics }> {
  try {
    const { data: result, error } = await supabaseAdmin.rpc("get_dashboard_metrics");

    if (error) {
      console.error("Error getting dashboard metrics:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      metrics: result.metrics,
    };
  } catch (error) {
    console.error("Error in getDashboardMetrics:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Get recent sessions
export async function getRecentSessions(limit: number = 20): Promise<{ success: boolean; error?: string; sessions?: RecentSession[] }> {
  try {
    const { data: result, error } = await supabaseAdmin.rpc("get_recent_sessions", { p_limit: limit });

    if (error) {
      console.error("Error getting recent sessions:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      sessions: result.sessions,
    };
  } catch (error) {
    console.error("Error in getRecentSessions:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Get users with filtering and pagination
export async function getUsers(
  limit: number = 50,
  offset: number = 0,
  search?: string,
  userType?: Tables<'users'>['user_type'],
  status?: Tables<'users'>['status']
): Promise<{ success: boolean; error?: string; users?: Tables<'users'>[]; totalCount?: number }> {
  try {
    const { data: result, error } = await supabaseAdmin.rpc("get_users", {
      p_limit: limit,
      p_offset: offset,
      p_search: search || null,
      p_user_type: userType || null,
      p_status: status || null,
    });

    if (error) {
      console.error("Error getting users:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      users: result.users,
      totalCount: result.total_count,
    };
  } catch (error) {
    console.error("Error in getUsers:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Update user status
export async function updateUserStatus(
  userId: string,
  status: Tables<'users'>['status'],
  adminId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: result, error } = await supabaseAdmin.rpc("update_user_status", {
      p_user_id: userId,
      p_status: status,
      p_admin_id: adminId || null,
    });

    if (error) {
      console.error("Error updating user status:", error);
      return { success: false, error: "Error interno del servidor" };
    }

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
