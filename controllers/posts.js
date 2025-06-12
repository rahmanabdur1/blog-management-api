const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// Get all posts with pagination and filtering
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query object for filtering
    const query = {};
    if (req.query.author) query.author = req.query.author;
    if (req.query.location) query.location = req.query.location;
    if (req.query.isPublished) query.isPublished = req.query.isPublished === 'true';

    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, author, location, tags, isPublished } = req.body;

    const newPost = new Post({
      title,
      content,
      author,
      location,
      tags,
      isPublished
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};