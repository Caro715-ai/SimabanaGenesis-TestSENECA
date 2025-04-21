"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { User, Clock, LogOut, Settings, FileText, BarChart } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Barra de navegación superior */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">Mi Aplicación</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjeta de bienvenida */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-12 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Bienvenido, {user?.firstName || "Usuario"}
            </h1>
            <p className="opacity-90">
              Último inicio de sesión: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Primera sesión"}
            </p>
            <div className="mt-6">
              <Button asChild variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link href="/dashboard/profile">
                  <User className="h-4 w-4 mr-2" />
                  Editar perfil
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido del dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Información personal</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Nombre:</span> {user?.firstName || "No especificado"}</p>
                  <p><span className="font-medium">Apellido:</span> {user?.lastName || "No especificado"}</p>
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                </div>
                <Button asChild variant="link" className="px-0 mt-3">
                  <Link href="/dashboard/profile">Actualizar información</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Actividad reciente</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Último acceso:</span> {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "No disponible"}</p>
                </div>
                <Button asChild variant="link" className="px-0 mt-3">
                  <Link href="/dashboard/activities">Ver historial completo</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 mr-4">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Configuración</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>Gestiona tus preferencias y ajustes de cuenta</p>
                </div>
                <Button asChild variant="link" className="px-0 mt-3">
                  <Link href="/dashboard/settings">Ir a configuración</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 