const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to ', config.mongoUrl)

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs/', blogsRouter)
app.use('/api/users/', usersRouter)
app.use('/api/login/', loginRouter)

app.use(middleware.errorHandler)

module.exports = app