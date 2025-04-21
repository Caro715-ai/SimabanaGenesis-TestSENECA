const crypto = require('crypto');

const generateRandomToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

module.exports = {
    generateRandomToken,
}; 