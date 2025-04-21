const express = require('express');
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { protect } = require('../middlewares/authMiddleware');
const {
    registerSchema,
    activateSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require('../validations/authValidations');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.get('/activate', validateRequest(activateSchema), authController.activate); // Activation via query param
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

router.post('/logout', protect, authController.logout); // Added protect here for consistency

module.exports = router; 