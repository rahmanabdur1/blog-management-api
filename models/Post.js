const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished) {
    this.publishedAt = new Date();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', PostSchema);