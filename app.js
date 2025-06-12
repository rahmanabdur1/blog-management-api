const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const graphqlServer = require('./controllers/graphql');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// REST API routes
app.use('/posts', postsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// GraphQL API setup
async function setupApolloServer() {
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, path: '/graphql' });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`REST API available at http://localhost:${PORT}/posts`);
    console.log(`GraphQL API available at http://localhost:${PORT}/graphql`);
  });
}

setupApolloServer().catch(err => {
  console.error('Failed to start Apollo Server:', err);
  process.exit(1);
});

module.exports = app;