"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Rutas públicas (accesibles sin autenticación)
const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/activate"];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar si estamos en una ruta protegida
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/reset-password") || pathname.startsWith("/activate");
    
    // Si aún está cargando, esperar
    if (isLoading) return;
    
    // Si no hay usuario y la ruta es protegida, redirigir a login
    if (!user && !isPublicPath) {
      router.push("/login");
    }
    
    // Si hay usuario y estamos en una ruta pública, redirigir a dashboard
    if (user && isPublicPath) {
      router.push("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  // Mientras carga, no mostrar nada o un indicador de carga
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  // Si es una ruta protegida y no hay usuario, no mostrar el contenido
  if (!user && !publicPaths.includes(pathname) && !pathname.startsWith("/reset-password") && !pathname.startsWith("/activate")) {
    return null;
  }

  // Si es una ruta pública y hay usuario, no mostrar el contenido
  if (user && (publicPaths.includes(pathname) || pathname.startsWith("/reset-password") || pathname.startsWith("/activate"))) {
    return null;
  }

  // En otros casos, mostrar el contenido
  return <>{children}</>;
} 