"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, getUserProfile, login, logout, register, updateProfile } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
    address?: string;
    dateOfBirth?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: { firstName?: string; lastName?: string; address?: string; dateOfBirth?: string }) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para limpiar errores
  const clearError = () => setError(null);

  // Verificar si hay un token al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await getUserProfile();
          setUser(userData.user);
        }
      } catch (error) {
        // Si hay un error, eliminamos el token
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      setUser(data.user);
      toast.success("¡Inicio de sesión exitoso!");
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Error login:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrar usuario
  const handleRegister = async (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
    address?: string;
    dateOfBirth?: string; 
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await register(userData);
      toast.success("¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta.");
      router.push("/login");
      return true;
    } catch (error) {
      console.error("Error registro:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al registrar usuario. Por favor, intenta nuevamente.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      toast.success("¡Sesión cerrada!");
      router.push("/login");
    } catch (error) {
      console.error("Error logout:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar perfil
  const handleUpdateProfile = async (userData: { firstName?: string; lastName?: string; address?: string; dateOfBirth?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await updateProfile(userData);
      setUser(data.user);
      toast.success("¡Perfil actualizado!");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al actualizar perfil. Por favor, intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
} 