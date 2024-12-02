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

const isEmailUnique = async (email) => {
    const user = await User.findOne({ where: { email } }); // Using Sequelize ORM
    return !user; // Return true if the email is not found (i.e., unique)
};

module.exports = {
    validateSignIn,
    validateRegister,
};
