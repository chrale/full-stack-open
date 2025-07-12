// handling of environment variables

require('dotenv').config();

const mongoUrl =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const port = process.env.PORT;
const secret = process.env.SECRET;

module.exports = {
  mongoUrl,
  port,
  secret,
};
