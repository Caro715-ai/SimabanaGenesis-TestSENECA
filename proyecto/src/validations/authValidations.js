const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        firstName: z.string().min(1, 'First name is required').optional(), // Make optional if not required at registration
        lastName: z.string().min(1, 'Last name is required').optional(),  // Make optional if not required at registration
    }),
});

const activateSchema = z.object({
    query: z.object({
        token: z.string().min(1, 'Activation token is required'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
    }),
});

const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, 'Reset token is required'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
});

module.exports = {
    registerSchema,
    activateSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
}; 