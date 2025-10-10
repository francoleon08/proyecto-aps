export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contracted_policy: {
        Row: {
          id: string
          policy_number: number
          policy_type_id: string
          user_id: string
        }
        Insert: {
          id?: string
          policy_number: number
          policy_type_id: string
          user_id: string
        }
        Update: {
          id?: string
          policy_number?: number
          policy_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracted_policy_policy_type_id_fkey"
            columns: ["policy_type_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracted_policy_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      home_policy: {
        Row: {
          building_age: number
          city: string
          construction_type: Database["public"]["Enums"]["construction_type_enum"]
          id: string
          neighborhood: string
        }
        Insert: {
          building_age: number
          city: string
          construction_type: Database["public"]["Enums"]["construction_type_enum"]
          id: string
          neighborhood: string
        }
        Update: {
          building_age?: number
          city?: string
          construction_type?: Database["public"]["Enums"]["construction_type_enum"]
          id?: string
          neighborhood?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_policy_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "contracted_policy"
            referencedColumns: ["id"]
          },
        ]
      }
      life_policy: {
        Row: {
          cert_data: Json | null
          cert_presented: boolean
          id: string
        }
        Insert: {
          cert_data?: Json | null
          cert_presented: boolean
          id?: string
        }
        Update: {
          cert_data?: Json | null
          cert_presented?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_policy_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "contracted_policy"
            referencedColumns: ["id"]
          },
        ]
      }
      payment: {
        Row: {
          amount_paid: number
          coupon_id: string
          id: string
          method: Database["public"]["Enums"]["payment_method_enum"]
          payment_day: string
        }
        Insert: {
          amount_paid: number
          coupon_id: string
          id?: string
          method: Database["public"]["Enums"]["payment_method_enum"]
          payment_day: string
        }
        Update: {
          amount_paid?: number
          coupon_id?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method_enum"]
          payment_day?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "payment_coupon"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_coupon: {
        Row: {
          amount: number
          coupon_number: number
          due_date: string
          id: string
          issue_date: string
          period: Database["public"]["Enums"]["payment_period_enum"]
          policy_id: string
          status: Database["public"]["Enums"]["coupon_status_enum"]
        }
        Insert: {
          amount: number
          coupon_number: number
          due_date: string
          id?: string
          issue_date?: string
          period: Database["public"]["Enums"]["payment_period_enum"]
          policy_id: string
          status: Database["public"]["Enums"]["coupon_status_enum"]
        }
        Update: {
          amount?: number
          coupon_number?: number
          due_date?: string
          id?: string
          issue_date?: string
          period?: Database["public"]["Enums"]["payment_period_enum"]
          policy_id?: string
          status?: Database["public"]["Enums"]["coupon_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_coupon_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "contracted_policy"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          base_price: number
          benefits: Json
          category: string
          created_at: string
          description: Json
          general_coverage: number
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          base_price: number
          benefits: Json
          category: string
          created_at?: string
          description: Json
          general_coverage: number
          id?: string
          is_active: boolean
          updated_at?: string
        }
        Update: {
          base_price?: number
          benefits?: Json
          category?: string
          created_at?: string
          description?: Json
          general_coverage?: number
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      policy_event: {
        Row: {
          description: string
          event_type: Database["public"]["Enums"]["event_type_enum"]
          id: string
          policy_id: string
          request_date: string
          resolution_date: string | null
          status: Database["public"]["Enums"]["event_status_enum"]
        }
        Insert: {
          description: string
          event_type: Database["public"]["Enums"]["event_type_enum"]
          id?: string
          policy_id: string
          request_date?: string
          resolution_date?: string | null
          status: Database["public"]["Enums"]["event_status_enum"]
        }
        Update: {
          description?: string
          event_type?: Database["public"]["Enums"]["event_type_enum"]
          id?: string
          policy_id?: string
          request_date?: string
          resolution_date?: string | null
          status?: Database["public"]["Enums"]["event_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "policy_event_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "contracted_policy"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          action: Database["public"]["Enums"]["session_action_enum"]
          id: string
          ip_address: unknown | null
          metadata: Json | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["session_action_enum"]
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["session_action_enum"]
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password: string
          status: Database["public"]["Enums"]["user_status_enum"]
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type_enum"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password: string
          status?: Database["public"]["Enums"]["user_status_enum"]
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password?: string
          status?: Database["public"]["Enums"]["user_status_enum"]
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"]
        }
        Relationships: []
      }
      vehicle_policy: {
        Row: {
          driver_violations: Json | null
          id: string
          vehicle_model: string
          vehicle_theft_risk: number
          vehicle_year: number
        }
        Insert: {
          driver_violations?: Json | null
          id: string
          vehicle_model: string
          vehicle_theft_risk: number
          vehicle_year: number
        }
        Update: {
          driver_violations?: Json | null
          id?: string
          vehicle_model?: string
          vehicle_theft_risk?: number
          vehicle_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_policy_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "contracted_policy"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_recent_sessions: {
        Args: { p_limit?: number }
        Returns: Json
      }
      get_user_by_id: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_users: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_status?: Database["public"]["Enums"]["user_status_enum"]
          p_user_type?: Database["public"]["Enums"]["user_type_enum"]
        }
        Returns: Json
      }
      register_user: {
        Args: {
          p_email: string
          p_name: string
          p_password: string
          p_user_type?: Database["public"]["Enums"]["user_type_enum"]
        }
        Returns: Json
      }
      update_user_status: {
        Args: {
          p_admin_id?: string
          p_status: Database["public"]["Enums"]["user_status_enum"]
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      construction_type_enum: "brick" | "concrete" | "wood" | "mixed"
      coupon_status_enum:
        | "pending"
        | "paid"
        | "expired"
        | "cancelled"
        | "processing"
      event_status_enum:
        | "pending"
        | "in_progress"
        | "completed"
        | "failed"
        | "cancelled"
      event_type_enum:
        | "subscribed"
        | "activated"
        | "suspended"
        | "reinstated"
        | "cancelled"
        | "expired"
        | "renewed"
        | "claim_filed"
      payment_method_enum:
        | "debit_card"
        | "credit_card"
        | "qr_code"
        | "external_platform"
        | "cash"
      payment_period_enum: "monthly" | "quarterly" | "annual"
      policy_type_enum: "Premium" | "Elite" | "Basic"
      session_action_enum:
        | "login"
        | "logout"
        | "login_failed"
        | "password_reset"
        | "account_created"
        | "account_deactivated"
        | "account_activated"
      user_status_enum: "active" | "inactive"
      user_type_enum: "client" | "employee" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      construction_type_enum: ["brick", "concrete", "wood", "mixed"],
      coupon_status_enum: [
        "pending",
        "paid",
        "expired",
        "cancelled",
        "processing",
      ],
      event_status_enum: [
        "pending",
        "in_progress",
        "completed",
        "failed",
        "cancelled",
      ],
      event_type_enum: [
        "subscribed",
        "activated",
        "suspended",
        "reinstated",
        "cancelled",
        "expired",
        "renewed",
        "claim_filed",
      ],
      payment_method_enum: [
        "debit_card",
        "credit_card",
        "qr_code",
        "external_platform",
        "cash",
      ],
      payment_period_enum: ["monthly", "quarterly", "annual"],
      policy_type_enum: ["Premium", "Elite", "Basic"],
      session_action_enum: [
        "login",
        "logout",
        "login_failed",
        "password_reset",
        "account_created",
        "account_deactivated",
        "account_activated",
      ],
      user_status_enum: ["active", "inactive"],
      user_type_enum: ["client", "employee", "admin"],
    },
  },
} as const
