const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  const user = await User.findById(request.user)
  const blog = new Blog({
    id: body.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  // no blog found with the ID
  if (!blog) {
    return response.status(204).end()
  }

  const blogUserId = blog.user.toString()
  if (blogUserId === request.user) {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'user ids for the token and blog do not match' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const id = request.params.id
  const blog = {
    id: body.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter