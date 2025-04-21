const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { updateUserSchema } = require('../validations/userValidations');

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getMyProfile);
router.patch('/profile', validateRequest(updateUserSchema), userController.updateMyProfile);

module.exports = router; 