const jwt = require('jsonwebtoken');

const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        // Handle specific errors like TokenExpiredError, JsonWebTokenError if needed
        console.error('JWT Verification Error:', error.message);
        return null;
    }
};

// Generate Access Token (shorter lifespan)
const generateAccessToken = (user) => {
    const payload = { id: user.id, email: user.email }; // Add roles or other relevant info if needed
    return generateToken(payload, process.env.JWT_SECRET, '15m'); // Example: 15 minutes expiry
};

// Optional: Generate Refresh Token (longer lifespan, stored securely)
// const generateRefreshToken = (user) => {
//     const payload = { id: user.id };
//     return generateToken(payload, process.env.JWT_REFRESH_SECRET, '7d'); // Example: 7 days expiry
// };

module.exports = {
    generateToken,
    verifyToken,
    generateAccessToken,
    // generateRefreshToken, // Uncomment if using refresh tokens
}; 