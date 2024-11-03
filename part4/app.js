const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const logger = require('./utils/logger')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to ', config.mongoUrl)

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs/', blogsRouter)

module.exports = app