const prisma = require('../config/prisma');
const createHttpError = require('http-errors');

const getUserProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        // Select only the fields safe to return (exclude password, tokens, etc.)
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            address: true,
            dateOfBirth: true,
            lastLogin: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw createHttpError(404, 'User not found.');
    }
    return user;
};

const updateUserProfile = async (userId, updateData) => {
    // Ensure sensitive fields are not passed in updateData (validation should handle this too)
    const { email, password, ...allowedUpdates } = updateData;

    if (Object.keys(allowedUpdates).length === 0) {
         throw createHttpError(400, 'No valid fields provided for update.');
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: allowedUpdates,
            select: { // Return updated profile data, excluding sensitive fields
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                address: true,
                dateOfBirth: true,
                lastLogin: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    } catch (error) {
        // Handle potential Prisma errors, e.g., unique constraint violation if email were updatable
        console.error("Error updating user profile:", error);
        throw createHttpError(500, 'Could not update user profile.');
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
}; 