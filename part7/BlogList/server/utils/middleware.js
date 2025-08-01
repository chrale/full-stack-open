const config = require('../utils/config');
const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  console.error('Error message: ', error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  } else if (error.name === 'SyntaxError') {
    return response.status(401).json({ error: 'token invalid' });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    return response.status(401).json({ error: 'token invalid' });
  }
  next();
};

const userExtractor = (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, config.secret);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    request.user = decodedToken.id;
  } else {
    return response.status(401).json({ error: 'token invalid' });
  }
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
