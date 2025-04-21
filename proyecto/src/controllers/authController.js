const authService = require('../services/authService');

// Utility to handle async controller logic and errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);
    // Send 201 Created status for successful registration
    res.status(201).json({ message: 'Registration successful. Please check your email to activate your account.', user });
});

const activate = asyncHandler(async (req, res) => {
    const { token } = req.query;
    await authService.activateAccount(token);

    // Construct the redirect URL to the frontend login page
    const frontendLoginUrl = `${process.env.CLIENT_URL}/login?activated=true`;

    // Redirect the user
    res.redirect(frontendLoginUrl);
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.loginUser({ email, password });
    res.status(200).json({ message: 'Login successful', user, accessToken });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.status(200).json(result);
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.status(200).json(result);
});

const logout = asyncHandler(async (req, res) => {
    const result = await authService.logoutUser(/* pass necessary info if needed */);
    res.status(200).json(result);
});

module.exports = {
    register,
    activate,
    login,
    forgotPassword,
    resetPassword,
    logout,
}; 