# Proyecto API de Autenticación y Usuarios

Esta API proporciona endpoints para el registro, inicio de sesión, activación de cuenta, recuperación de contraseña y gestión de perfiles de usuario.

## Tecnologías

*   Node.js
*   Express.js
*   Prisma ORM
*   PostgreSQL
*   JSON Web Tokens (JWT)
*   bcryptjs (Hashing de contraseñas)
*   Zod (Validación)
*   Nodemailer (Envío de correos)
*   Mailtrap (Pruebas de correo en desarrollo)

## Configuración

1.  **Clonar el Repositorio (si aplica)**

    ```bash
    git clone <url-del-repositorio>
    cd proyecto
    ```

2.  **Instalar Dependencias**

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**

    *   Crea un archivo `.env` en la raíz del proyecto.
    *   Copia el contenido de `.env.example` (si existe) o usa la siguiente plantilla:

        ```env
        # PostgreSQL Database URL (replace with your actual URL)
        # Example: postgresql://<user>:<password>@<host>:<port>/<database>?schema=public
        DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

        # Server Port (Puerto donde corre esta API)
        PORT=4000

        # JSON Web Token Secrets (replace with strong, random strings)
        JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"

        # Nodemailer/Mailtrap Configuration (replace with your Mailtrap credentials)
        EMAIL_HOST="sandbox.smtp.mailtrap.io"
        EMAIL_PORT=2525
        EMAIL_USER="tu_usuario_mailtrap"
        EMAIL_PASS="tu_password_mailtrap"
        EMAIL_FROM='"Tu Aplicación" <no-reply@tuapp.com>'

        # Client URL (URL de tu frontend - usado para el enlace de reseteo de contraseña)
        CLIENT_URL="http://localhost:5173" # Ejemplo: puerto común para Vite/React/Vue dev

        # Default User Seed Credentials (Optional - used by prisma/seed.js)
        DEFAULT_USER_EMAIL="admin@example.com"
        DEFAULT_USER_PASSWORD="password123" # Usa una contraseña fuerte!
        ```
    *   **Importante:** Reemplaza los valores de ejemplo con tus credenciales reales de PostgreSQL, Mailtrap y un secreto JWT seguro. Asegúrate de que `PORT` sea 4000.

4.  **Configurar Base de Datos**

    *   Asegúrate de que tu servidor PostgreSQL esté corriendo y que la base de datos especificada en `DATABASE_URL` exista.
    *   Ejecuta las migraciones para crear las tablas:

        ```bash
        npx prisma migrate dev
        ```

5.  **Crear Usuario por Defecto (Opcional pero recomendado para pruebas)**

    ```bash
    npx prisma db seed
    ```

## Ejecutar la Aplicación

*   **Modo Desarrollo (con Nodemon para recarga automática):**

    ```bash
    npm run dev
    ```

*   **Modo Producción:**

    ```bash
    npm start
    ```

El servidor estará escuchando en `http://localhost:4000` (o el puerto definido en `.env`).

## Probar con Postman

La URL base para todas las peticiones API es `http://localhost:4000/api`.

**Consejo:** En Postman, puedes crear un entorno y guardar el `accessToken` obtenido al iniciar sesión en una variable (ej. `{{authToken}}`) para usarla fácilmente en las cabeceras de las rutas protegidas (`Authorization: Bearer {{authToken}}`).

### 1. Registro de Usuario

*   **Método:** `POST`
*   **URL:** `http://localhost:4000/api/auth/register`
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body (raw, JSON):**

    ```json
    {
        "email": "otro.usuario@example.com",
        "password": "passwordSegura123",
        "firstName": "Otro",
        "lastName": "Usuario"
    }
    ```
*   **Respuesta Exitosa (201 Created):** Muestra mensaje y datos del usuario.
*   **Notas:** Revisa tu bandeja de Mailtrap para encontrar el correo de activación. El enlace ahora apuntará a `http://localhost:4000/api/auth/activate?token=...`

### 2. Activación de Cuenta

*   **Método:** `GET`
*   **URL:** `http://localhost:4000/api/auth/activate`
*   **Query Params:**
    *   `token`: `AQUI_EL_TOKEN_DEL_CORREO_DE_ACTIVACION` (Reemplaza con el token real del correo)
*   **Respuesta Exitosa (200 OK):**

    ```json
    {
        "message": "Account activated successfully."
    }
    ```
*   **Notas:** Simplemente visita la URL completa del correo de activación en tu navegador o usa Postman con el parámetro `token`.

### 3. Inicio de Sesión

*   **Método:** `POST`
*   **URL:** `http://localhost:4000/api/auth/login`
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body (raw, JSON):** (Usa el usuario por defecto o el que acabas de registrar y activar)

    ```json
    {
        "email": "admin@example.com",
        "password": "password123"
    }
    ```
*   **Respuesta Exitosa (200 OK):** Devuelve mensaje, datos del usuario y `accessToken`.
*   **Notas:** Guarda el `accessToken` para usarlo en las rutas protegidas.

### 4. Obtener Perfil de Usuario

*   **Método:** `GET`
*   **URL:** `http://localhost:4000/api/users/profile`
*   **Headers:**
    *   `Authorization`: `Bearer {{authToken}}` (Usa el token guardado del login)
*   **Respuesta Exitosa (200 OK):** Devuelve la información del perfil del usuario autenticado.

### 5. Actualizar Perfil de Usuario

*   **Método:** `PATCH`
*   **URL:** `http://localhost:4000/api/users/profile`
*   **Headers:**
    *   `Content-Type`: `application/json`
    *   `Authorization`: `Bearer {{authToken}}`
*   **Body (raw, JSON):** (Incluye solo los campos que deseas actualizar)

    ```json
    {
        "firstName": "Admin Actualizado",
        "address": "Calle Falsa 123",
        "dateOfBirth": "1995-10-20" 
    }
    ```
*   **Respuesta Exitosa (200 OK):** Devuelve mensaje y perfil actualizado.

### 6. Solicitar Recuperación de Contraseña

*   **Método:** `POST`
*   **URL:** `http://localhost:4000/api/auth/forgot-password`
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body (raw, JSON):**

    ```json
    {
        "email": "admin@example.com"
    }
    ```
*   **Respuesta Exitosa (200 OK):** Devuelve mensaje genérico.
*   **Notas:** Revisa Mailtrap para el correo de restablecimiento. El enlace apuntará al `CLIENT_URL` definido en `.env` (ej. `http://localhost:5173/reset-password?token=...`).

### 7. Restablecer Contraseña

*   **Método:** `POST`
*   **URL:** `http://localhost:4000/api/auth/reset-password`
*   **Headers:**
    *   `Content-Type`: `application/json`
*   **Body (raw, JSON):**

    ```json
    {
        "token": "AQUI_EL_TOKEN_DEL_CORREO_DE_RESETEO",
        "password": "miNuevaPassword789"
    }
    ```
*   **Respuesta Exitosa (200 OK):**

    ```json
    {
        "message": "Password has been reset successfully."
    }
    ```
*   **Notas:** Obtén el `token` del enlace en el correo de restablecimiento. El frontend (en `CLIENT_URL`) debería capturar este token y enviarlo junto con la nueva contraseña a este endpoint de la API.

### 8. Cerrar Sesión (Logout)

*   **Método:** `POST`
*   **URL:** `http://localhost:4000/api/auth/logout`
*   **Headers:**
    *   `Authorization`: `Bearer {{authToken}}`
*   **Respuesta Exitosa (200 OK):**

    ```json
    {
        "message": "Logged out successfully."
    }
    ```
*   **Notas:** Indica al cliente que debe descartar el token. 