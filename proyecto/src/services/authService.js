const prisma = require('../config/prisma');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken } = require('../utils/jwt');
const { generateRandomToken } = require('../utils/tokens');
const { sendEmail } = require('../config/mailer');
const createHttpError = require('http-errors');

// Helper function to create email HTML content
const createEmailHtml = (title, message, link, buttonText) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 3px; font-weight: bold; }
            a.button { color: #ffffff !important; }
            .footer { margin-top: 20px; font-size: 0.9em; color: #777; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>${title}</h2>
            <p>${message}</p>
            <p><a href="${link}" class="button">${buttonText}</a></p>
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p><a href="${link}">${link}</a></p>
            <p class="footer">Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
        </div>
    </body>
    </html>
    `;
};

const registerUser = async ({ email, password, firstName, lastName }) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw createHttpError(409, 'Email already in use.');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate activation token
    const activationToken = generateRandomToken();

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            activationToken,
            emailVerified: false, // Start as unverified
        },
    });

    // Construir la URL de activación apuntando al backend
    const serverPort = process.env.PORT || 3000; // Usar 4000 si está en .env
    const activationUrl = `http://localhost:${serverPort}/api/auth/activate?token=${activationToken}`;

    try {
        const emailHtml = createEmailHtml(
            'Activa tu Cuenta',
            '¡Gracias por registrarte! Por favor, haz clic en el botón de abajo para activar tu cuenta.',
            activationUrl,
            'Activar Cuenta'
        );
        await sendEmail({
            to: user.email,
            subject: 'Activa Tu Cuenta',
            text: `Por favor, activa tu cuenta visitando este enlace: ${activationUrl}`,
            html: emailHtml,
        });
    } catch (emailError) {
        console.error("Failed to send activation email:", emailError);
    }

    // Don't send password or tokens back
    const { password: _, activationToken: __, ...userResponse } = user;
    return userResponse;
};

const activateAccount = async (token) => {
    const user = await prisma.user.findUnique({ where: { activationToken: token } });

    if (!user) {
        throw createHttpError(400, 'Invalid or expired activation token.');
    }

    if (user.emailVerified) {
        return { message: 'Account already activated.' };
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: true,
            activationToken: null, // Clear the token once used
        },
    });

    return { message: 'Account activated successfully.' };
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
        throw createHttpError(401, 'Invalid email or password.');
    }

    if (!user.emailVerified) {
        throw createHttpError(403, 'Account not activated. Please check your email.');
    }

    // Update last login time
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
    });

    // Genera JWT
    const accessToken = generateAccessToken(updatedUser);

    // Don't send sensitive info back
    const { password: _, activationToken: __, resetPasswordToken: ___, resetPasswordExpires: ____, ...userResponse } = updatedUser;

    return {
        user: userResponse,
        accessToken,
    };
};

const requestPasswordReset = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log(`Password reset requested for non-existent email: ${email}`);
        return { message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' };
    }

    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        },
    });

    // Construir la URL de reseteo apuntando al frontend (donde estará el formulario)
    // El frontend luego llamará a la API /api/auth/reset-password con el token y la nueva contraseña
    const resetUrlFrontend = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
        const emailHtml = createEmailHtml(
            'Restablecer Contraseña',
            'Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para elegir una nueva. El enlace expirará en 1 hora.',
            resetUrlFrontend,
            'Restablecer Contraseña'
        );
        await sendEmail({
            to: user.email,
            subject: 'Solicitud de Restablecimiento de Contraseña',
            text: `Solicitaste restablecer tu contraseña. Haz clic en este enlace (válido por 1 hora): ${resetUrlFrontend}`,
            html: emailHtml,
        });
        return { message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' };
    } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        return { message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña.' };
    }
};

const resetPassword = async (token, newPassword) => {
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { gt: new Date() }, // Check if token is not expired
        },
    });

    if (!user) {
        throw createHttpError(400, 'Password reset token is invalid or has expired.');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null, // Clear token after use
            resetPasswordExpires: null,
            // Consider forcing re-login by invalidating existing sessions/tokens if applicable
        },
    });

    return { message: 'Password has been reset successfully.' };
};

const logoutUser = async (/* userId or tokenId if needed */) => {
    return { message: 'Logged out successfully.' };
};


module.exports = {
    registerUser,
    activateAccount,
    loginUser,
    requestPasswordReset,
    resetPassword,
    logoutUser,
}; 