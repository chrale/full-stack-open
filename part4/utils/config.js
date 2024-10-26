// handling of environment variable to own module

require('dotenv').config()

const mongoUrl = process.env.MONGODB_URI
const port = process.env.PORT

module.exports = {
  mongoUrl, port
}