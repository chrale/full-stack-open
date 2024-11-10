const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

// wrapping the express app into superagent object --> makes request to backend
const api = supertest(app)

// before each test cleaning db and adding the bigger list to it
beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.biggerList.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogLength = response.body.length
  assert.strictEqual(blogLength, helper.biggerList.length)
})

test('unique identifier of blog post is id', async () => {
  const response = await api.get('/api/blogs')
  const blogList = response.body
  const result = blogList.every(blog => Object.hasOwn(blog,'id'))
  assert(result)
})

describe('post methods', () => {
  test('blog post can be added to the database', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send(helper.oneBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const blogLength = blogs.length

    assert.strictEqual(savedBlog.body.title, helper.oneBlog.title)
    assert.strictEqual(savedBlog.body.author, helper.oneBlog.author)
    assert.strictEqual(savedBlog.body.likes, helper.oneBlog.likes)
    assert.strictEqual(savedBlog.body.url, helper.oneBlog.url)
    assert.strictEqual(blogLength, helper.biggerList.length+1)
  })

  test('likes property missing from request, defaulting likes to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.oneBlogMissingLikes)
    assert.strictEqual(response.body.likes,0)
  })

  test('title missing: returning 400 bad request', async () => {
    await api
      .post('/api/blogs')
      .send(helper.oneBlogMissingTitle)
      .expect(400)
  })

  test('URL missing: returning 400 bad request', async () => {
    await api
      .post('/api/blogs')
      .send(helper.oneBlogMissingURL)
      .expect(400)
  })

  test('title and URL missing: returning 400 bad request', async () => {
    await api
      .post('/api/blogs')
      .send(helper.oneBlogMissingURLTitle)
      .expect(400)
  })
})

test('deleting single blog', async () => {
  const blogList = await helper.blogsInDb()
  const blogToBeDeleted = blogList[0]
  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .expect(204)

  const blogListAfterDelete = await helper.blogsInDb()

  assert.strictEqual(blogList.length, blogListAfterDelete.length+1)
  assert(!blogListAfterDelete.some(blog => blog.id === blogToBeDeleted.id))
})

test('blog likes can be updated', async () => {
  const blogList = await helper.blogsInDb()
  const blogToBeUpdated = blogList[0]
  const updatedBlog = {
    ...blogToBeUpdated,
    likes: blogToBeUpdated.likes+5,
  }

  const updatedBlogResponse = await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(updatedBlog.likes, updatedBlogResponse.body.likes)
})

after(async () => {
  await mongoose.connection.close()
})