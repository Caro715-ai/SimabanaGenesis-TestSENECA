const { z } = require('zod');

const updateUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name cannot be empty').optional(),
        lastName: z.string().min(1, 'Last name cannot be empty').optional(),
        address: z.string().optional(), // Address can be empty or null if allowed
        dateOfBirth: z.preprocess((arg) => {
            // Attempt to parse the date string
            if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
            return arg;
        }, z.date({
            errorMap: (issue, ctx) => {
                if (issue.code === z.ZodIssueCode.invalid_date) {
                    return { message: 'Invalid date format for date of birth' };
                }
                return { message: ctx.defaultError };
            },
        }).optional()),
        // Ensure no sensitive fields like password or email are updatable here
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    }),

});


module.exports = {
    updateUserSchema,
}; 