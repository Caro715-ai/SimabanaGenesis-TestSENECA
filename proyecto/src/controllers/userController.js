const userService = require('../services/userService');

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const getMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json(userProfile);
});

const updateMyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updateData = req.body;
    const updatedUserProfile = await userService.updateUserProfile(userId, updateData);
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUserProfile });
});

module.exports = {
    getMyProfile,
    updateMyProfile,
}; 