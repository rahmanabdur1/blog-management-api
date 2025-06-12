const { ApolloServer, gql } = require('apollo-server-express');
const Post = require('../models/Post');

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: String!
    location: String
    tags: [String]!
    isPublished: Boolean!
    publishedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedPosts {
    posts: [Post]!
    totalPosts: Int!
    totalPages: Int!
    currentPage: Int!
  }

  input PostInput {
    title: String!
    content: String!
    author: String!
    location: String
    tags: [String]
    isPublished: Boolean
  }

  type Query {
    getPosts(page: Int, limit: Int, author: String, location: String, isPublished: Boolean): PaginatedPosts
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(postInput: PostInput): Post
  }
`;

const resolvers = {
  Query: {
    getPosts: async (_, { page = 1, limit = 10, author, location, isPublished }) => {
      try {
        const skip = (page - 1) * limit;
        
        const query = {};
        if (author) query.author = author;
        if (location) query.location = location;
        if (isPublished !== undefined) query.isPublished = isPublished;

        const posts = await Post.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        const totalPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        return {
          posts,
          totalPosts,
          totalPages,
          currentPage: page
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    getPost: async (_, { id }) => {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error('Post not found');
        }
        return post;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createPost: async (_, { postInput }) => {
      try {
        // Validation
        if (!postInput.title || postInput.title.length < 3) {
          throw new Error('Title must be at least 3 characters');
        }
        if (!postInput.content || postInput.content.length < 10) {
          throw new Error('Content must be at least 10 characters');
        }
        if (!postInput.author) {
          throw new Error('Author is required');
        }

        const newPost = new Post({
          title: postInput.title,
          content: postInput.content,
          author: postInput.author,
          location: postInput.location || undefined,
          tags: postInput.tags || [],
          isPublished: postInput.isPublished || false
        });

        const post = await newPost.save();
        return post;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

module.exports = server;