const { check } = require('express-validator');

exports.validateCreateAgent = [
    check('username')
        .not()
        .isEmpty()
        .withMessage('Username is required'),

    check('email')
        .isEmail()
        .withMessage('Email must be a valid email address'),

    check('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters'),

    check('phone')
        .isLength({ min: 10, max: 25 })
        .withMessage('Phone must be between 10 and 25 characters'),

    check('agencyName')
        .not()
        .isEmpty()
        .withMessage('Agency Name is required'),

    check('address')
        .isLength({ min: 1, max: 255 })
        .withMessage('Address must be between 1 and 255 characters'),

    check('age')
        .isInt({ min: 18, max: 120 })
        .withMessage('Age must be between 18 and 120'),
];


exports.validateAgentUpdate = [
    check('username')
        .optional()
        .not()
        .isEmpty()
        .withMessage('Username cannot be empty'),

    check('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address'),
    check('password')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters'),

    check('phone')
        .optional()
        .isLength({ min: 10, max: 25 })
        .withMessage('Phone must be between 10 and 25 characters'),

    check('agencyName')
        .optional()
        .not()
        .isEmpty()
        .withMessage('Agency Name cannot be empty'),

    check('address')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('Address must be between 1 and 255 characters'),
    check('age')
        .optional().
        isInt({ min: 18, max: 120 })
        .withMessage('Age must be between 18 and 120'),
];
