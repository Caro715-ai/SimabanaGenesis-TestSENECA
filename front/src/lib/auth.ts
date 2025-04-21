import { toast } from "sonner";

// Interfaz para el objeto User
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  dateOfBirth: string | null;
  lastLogin: string | null;
  emailVerified: boolean;
}

// URL base para las peticiones API
const API_URL = "http://localhost:4000/api";

// Función para iniciar sesión
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    // Guardamos el token en localStorage
    localStorage.setItem("token", data.accessToken);
    
    // Devolvemos los datos del usuario
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al iniciar sesión");
    }
    throw error;
  }
}

// Función para registrar usuario
export async function register(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  dateOfBirth?: string;
}) {
  try {
    // Formateamos los datos para enviar al backend
    const dataToSend = {
      ...userData,
      // Aseguramos que estos campos estén presentes incluso si son vacíos
      address: userData.address || null,
      dateOfBirth: userData.dateOfBirth || null,
    };

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al registrar usuario");
    }
    throw error;
  }
}

// Función para cerrar sesión
export async function logout() {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      localStorage.removeItem("token");
      return { success: true };
    }
    
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al cerrar sesión");
    }

    // Eliminamos el token del localStorage
    localStorage.removeItem("token");
    
    return data;
  } catch (error) {
    localStorage.removeItem("token");
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al cerrar sesión");
    }
    throw error;
  }
}

// Función para obtener perfil de usuario
export async function getUserProfile() {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No hay sesión activa");
    }
    
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener perfil");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al obtener perfil");
    }
    throw error;
  }
}

// Función para actualizar perfil
export async function updateProfile(userData: {
  firstName?: string;
  lastName?: string;
  address?: string;
  dateOfBirth?: string;
}) {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No hay sesión activa");
    }

    // Aseguramos que los campos opcionales vacíos se envíen como null
    const dataToSend = {
      ...userData,
      address: userData.address === "" ? null : userData.address,
      dateOfBirth: userData.dateOfBirth === "" ? null : userData.dateOfBirth,
    };
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar perfil");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al actualizar perfil");
    }
    throw error;
  }
}

// Función para solicitar recuperación de contraseña
export async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al solicitar recuperación");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al solicitar recuperación");
    }
    throw error;
  }
}

// Función para restablecer contraseña
export async function resetPassword(token: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al restablecer contraseña");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al restablecer contraseña");
    }
    throw error;
  }
}

// Función para activar cuenta
export async function activateAccount(token: string) {
  try {
    const response = await fetch(`${API_URL}/auth/activate?token=${token}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al activar cuenta");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Error al activar cuenta");
    }
    throw error;
  }
} 