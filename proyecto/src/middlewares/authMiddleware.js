const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

const protect = async (req, res, next) => {
    let token;

    // 1) Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // 2) Alternatively, check for token in cookies (optional)

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    try {
        // 3) Verify token
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Not authorized, token invalid or expired.' });
        }

        // 4) Check if user still exists
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token does no longer exist.' });
        }

        req.user = currentUser; // Attach user to the request object
        next();
    } catch (error) {
        // Catch potential verification errors not handled by verifyToken utility
        console.error('Auth Middleware Error:', error);
        return res.status(401).json({ message: 'Not authorized, token verification failed.' });
    }
};

module.exports = { protect }; 