"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
// Remove direct import of server functions
import { DashboardMetrics, RecentSession } from "@/types/custom";
import { UserManagement } from "@/components/user-management";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsResponse, sessionsResponse] = await Promise.all([
          fetch('/api/admin/metrics'),
          fetch('/api/admin/sessions?limit=10')
        ]);

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData);
        }

        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setRecentSessions(sessionsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActionLabel = (action: string) => {
    const actionLabels: Record<string, string> = {
      login: "Inició sesión",
      logout: "Cerró sesión",
      login_failed: "Intento de login fallido",
      password_reset: "Restableció contraseña",
      account_created: "Cuenta creada",
      account_deactivated: "Cuenta desactivada",
      account_activated: "Cuenta activada",
    };
    return actionLabels[action] || action;
  };

  const getActionColor = (action: string) => {
    const actionColors: Record<string, string> = {
      login: "bg-green-100 text-green-800",
      logout: "bg-gray-100 text-gray-800",
      login_failed: "bg-red-100 text-red-800",
      password_reset: "bg-blue-100 text-blue-800",
      account_created: "bg-green-100 text-green-800",
      account_deactivated: "bg-red-100 text-red-800",
      account_activated: "bg-green-100 text-green-800",
    };
    return actionColors[action] || "bg-gray-100 text-gray-800";
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Hace un momento";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title="Dashboard Administrador"
        description="Panel de control administrativo"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (showUserManagement) {
    return (
      <DashboardLayout
        title="Gestión de Usuarios"
        description="Administrar usuarios del sistema"
      >
        <UserManagement onBack={() => setShowUserManagement(false)} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard Administrador"
      description="Panel de control administrativo"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Active Users */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-blue-600 truncate">
                    Total de usuarios activos
                  </dt>
                  <dd className="text-lg font-medium text-blue-900">
                    {metrics?.total_active_users || 0} {metrics?.total_active_users === 1 ? "usuario" : "usuarios"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Active Employees */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-green-600 truncate">
                    Total de empleados activos
                  </dt>
                  <dd className="text-lg font-medium text-green-900">
                    {metrics?.total_active_employees || 0} {metrics?.total_active_employees === 1 ? "empleado" : "empleados"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Active Administrators */}
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-red-600 truncate">
                    Total de administradores activos
                  </dt>
                  <dd className="text-lg font-medium text-red-900">
                    {metrics?.total_active_administrators || 0} {metrics?.total_active_administrators === 1 ? "administrador" : "administradores"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Tools */}
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Herramientas Administrativas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowUserManagement(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Gestionar Usuarios
            </button>
            <button
              onClick={() => router.push('/plans')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Gestionar Planes
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Ver Reportes
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Configuración Sistema
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Backup & Restore
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Actividades Recientes
          </h4>
          <div className="space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.user_name || "Usuario desconocido"}
                      </p>
                      <p className="text-xs text-gray-500">{session.user_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(session.action)}`}>
                      {getActionLabel(session.action)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(session.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay actividades recientes
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
