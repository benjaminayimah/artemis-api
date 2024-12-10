const { body } = require('express-validator');

const User = require('../models/User');

// Validation middleware for user sign-in
const validateSignIn = [
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .notEmpty().withMessage('Email is required.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
];

// Validation middleware for user registration
const validateRegister = [
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .notEmpty().withMessage('Email is required.')
        .custom(async (email) => {
            const isUnique = await isEmailUnique(email);
            if (!isUnique) {
                throw new Error('Email already exists.');
            }
            return true; // If unique, return true
        }),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];
const validateUsernameInput = [
    body('displayName')
        .notEmpty().withMessage('Display name field is required.'),
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .custom(async (username, { req }) => {
            const userId = req.body.id;
            const isUnique = await isUsernameUnique(username, userId);
            if (!isUnique) {
                throw new Error('Username already exists.');
            }
            return true;
        })
];

const isEmailUnique = async (email) => {
    const user = await User.findOne({ where: { email } }); // Using Sequelize ORM
    return !user;
};

async function isUsernameUnique(username, userId) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return true; // Username does not exist
    }
    return user.id === userId; 
}

module.exports = {
    validateSignIn,
    validateRegister,
    validateUsernameInput,
    isUsernameUnique
};
