"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activateAccount } from "@/lib/auth";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function ActivateAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const activateUser = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setError("Token no válido o faltante");
        setIsLoading(false);
        return;
      }
      
      try {
        await activateAccount(token);
        setIsSuccess(true);
        toast.success("Cuenta activada con éxito");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al activar la cuenta");
        }
      } finally {
        setIsLoading(false);
      }
    };

    activateUser();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Activación de cuenta</CardTitle>
          <CardDescription className="text-center">
            Verificando tu cuenta de usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center p-4">
              <p>Activando tu cuenta, por favor espera...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-4 p-4">
              <p className="text-green-600 dark:text-green-400">
                ¡Tu cuenta ha sido activada con éxito!
              </p>
              <p>Ahora puedes iniciar sesión con tus credenciales.</p>
              <div className="flex justify-center pt-2">
                <Button asChild>
                  <Link href="/login">Ir a iniciar sesión</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 p-4">
              <p className="text-red-600 dark:text-red-400">
                {error || "Ha ocurrido un error al activar tu cuenta"}
              </p>
              <p>Por favor, intenta de nuevo o contacta a soporte.</p>
              <div className="flex justify-center pt-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Volver a iniciar sesión</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 