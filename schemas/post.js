const { check } = require('express-validator');

exports.postValidation = [
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  check('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  check('author')
    .notEmpty().withMessage('Author is required'),
  check('location')
    .optional()
    .trim(),
  check('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  check('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean')
];