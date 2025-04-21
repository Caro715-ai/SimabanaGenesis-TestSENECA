"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPassword } from "@/lib/auth";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Token no válido o faltante");
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordMismatch(e.target.value !== confirmPassword && confirmPassword !== "");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordMismatch(password !== e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Token no válido o faltante");
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      toast.success("Contraseña restablecida con éxito");
    } catch (error) {
      console.error("Error reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Restablecer contraseña</CardTitle>
          <CardDescription className="text-center">
            Crea una nueva contraseña para tu cuenta
          </CardDescription>
        </CardHeader>
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={passwordMismatch ? "border-red-500" : ""}
                />
                {passwordMismatch && (
                  <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || passwordMismatch || !token}
              >
                {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="text-center space-y-2 p-4">
              <p className="text-green-600 dark:text-green-400">
                ¡Contraseña restablecida con éxito!
              </p>
              <p>Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión con tu nueva contraseña.</p>
            </div>
            <div className="flex justify-center pt-2">
              <Button asChild>
                <Link href="/login">Ir a iniciar sesión</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 