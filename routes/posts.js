const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');
const { postValidation } = require('../schemas/post');

// GET /posts - Get all posts with pagination and filtering
router.get('/', postController.getPosts);

// POST /post - Create a new post
router.post('/', postValidation, postController.createPost);

module.exports = router;