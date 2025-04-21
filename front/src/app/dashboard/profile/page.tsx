"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, User, Mail, Home, Calendar, Clock } from "lucide-react";

// Helper para obtener el valor inicial (maneja null/undefined)
const getInitialValue = (value: string | null | undefined) => value || "";

export default function ProfilePage() {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();
  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dateOfBirth: ""
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dateOfBirth: ""
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (user) {
      const data = {
        firstName: getInitialValue(user.firstName),
        lastName: getInitialValue(user.lastName),
        address: getInitialValue(user.address),
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""
      };
      setInitialData(data); // Guardar los datos iniciales
      setFormData(data);   // Establecer los datos del formulario
      setHasChanges(false); // Reiniciar el estado de cambios
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Verificar si hay cambios comparando con los datos iniciales guardados
    setHasChanges(JSON.stringify(newFormData) !== JSON.stringify(initialData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast.info("No hay cambios para guardar");
      return;
    }
    
    try {
      // Enviar solo los campos que han cambiado (opcional pero eficiente)
      // O simplemente enviar formData como se está haciendo
      await updateProfile(formData);
      // Actualizar los datos iniciales después de guardar
      setInitialData(formData);
      setHasChanges(false);
      toast.success("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  };

  if (!user) {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Button 
          variant="ghost" 
          asChild 
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </Link>
        </Button>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg p-8 text-white">
          <h1 className="text-3xl font-bold">Mi perfil</h1>
          <p className="mt-2 text-blue-100">Actualiza tu información personal y detalles de contacto</p>
        </div>

        <Card className="rounded-t-none shadow-lg border-t-0">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2 text-sm mb-6">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Nombres
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Juan"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Apellidos
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Pérez"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center text-gray-700 dark:text-gray-300">
                  <Home className="h-4 w-4 mr-2 text-gray-500" />
                  Dirección
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle Principal #123"
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Fecha de nacimiento
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-2">Correo electrónico:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-2">Último inicio de sesión:</span>
                  <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "No disponible"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading || !hasChanges}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 