const { check, validationResult } = require('express-validator');

exports.validateCreatApartment = [
    check('type').not().isEmpty().withMessage('Type is required'),
    check('image').not().isEmpty().withMessage('Image is required'),
    check('city').not().isEmpty().withMessage('City is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('available').not().isEmpty().withMessage('Available must be a boolean'),
    check('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
    check('bathrooms').isNumeric().withMessage('Bathrooms must be a number'),
    check('petPolicy').not().isEmpty().withMessage('PetPolicy is required'),
    check('amenities').isArray().withMessage('Amenities must be an array'),
    check('formattedAddress').not().isEmpty().withMessage('FormattedAddress is required')

]


exports.validateSearch = [
    check('city')
        .optional()
        .isString()
        .withMessage('City must be a string'),
    check('minPrice')
        .optional()
        .isNumeric()
        .withMessage('Minimum price must be a numeric value'),
    check('maxPrice')
        .optional()
        .isNumeric()
        .withMessage('Maximum price must be a numeric value'),
    check('bedrooms')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Number of bedrooms must be an integer greater than 0'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
