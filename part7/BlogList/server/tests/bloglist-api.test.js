const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

// wrapping the express app into superagent object --> makes request to backend
const api = supertest(app);

// before each test cleaning db and adding the bigger list and users to it
beforeEach(async () => {
  // adding the blogs
  await Blog.deleteMany({});
  const blogObjects = helper.biggerList.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  // adding two users
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash(helper.user.password, 10);
  const user = new User({
    username: helper.user.username,
    passwordHash,
    name: helper.user.name,
  });
  await user.save();
  const secondPasswordHash = await bcrypt.hash(helper.secondUser.password, 10);
  const secondUser = new User({
    username: helper.secondUser.username,
    secondPasswordHash,
    name: helper.secondUser.name,
  });
  await secondUser.save();
});

test('all blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogLength = response.body.length;
  assert.strictEqual(blogLength, helper.biggerList.length);
});

test('unique identifier of blog post is id', async () => {
  const response = await api.get('/api/blogs');
  const blogList = response.body;
  const result = blogList.every((blog) => Object.hasOwn(blog, 'id'));
  assert(result);
});

describe('post methods', () => {
  test('blog post can be added to the database', async () => {
    const login = {
      username: helper.user.username,
      password: helper.user.password,
    };
    const savedLogin = await api.post('/api/login').send(login);
    const token = 'Bearer ' + savedLogin.body.token;

    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();
    const blogLength = blogs.length;

    assert.strictEqual(savedBlog.body.title, helper.oneBlog.title);
    assert.strictEqual(savedBlog.body.author, helper.oneBlog.author);
    assert.strictEqual(savedBlog.body.likes, helper.oneBlog.likes);
    assert.strictEqual(savedBlog.body.url, helper.oneBlog.url);
    assert.strictEqual(blogLength, helper.biggerList.length + 1);
  });

  test('likes property missing from request, defaulting likes to 0', async () => {
    const login = {
      username: helper.user.username,
      password: helper.user.password,
    };
    const savedLogin = await api.post('/api/login').send(login);
    const token = 'Bearer ' + savedLogin.body.token;

    const response = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlogMissingLikes);
    assert.strictEqual(response.body.likes, 0);
  });

  test('title missing: returning 400 bad request', async () => {
    const login = {
      username: helper.user.username,
      password: helper.user.password,
    };
    const savedLogin = await api.post('/api/login').send(login);
    const token = 'Bearer ' + savedLogin.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlogMissingTitle)
      .expect(400);
  });

  test('URL missing: returning 400 bad request', async () => {
    const login = {
      username: helper.user.username,
      password: helper.user.password,
    };
    const savedLogin = await api.post('/api/login').send(login);
    const token = 'Bearer ' + savedLogin.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlogMissingURL)
      .expect(400);
  });

  test('title and URL missing: returning 400 bad request', async () => {
    const login = {
      username: helper.user.username,
      password: helper.user.password,
    };
    const savedLogin = await api.post('/api/login').send(login);
    const token = 'Bearer ' + savedLogin.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlogMissingURLTitle)
      .expect(400);
  });
});

test('deleting single blog', async () => {
  // login
  const login = {
    username: helper.user.username,
    password: helper.user.password,
  };
  const savedLogin = await api.post('/api/login').send(login);
  const token = 'Bearer ' + savedLogin.body.token;

  // post new blog
  const savedBlog = await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(helper.oneBlog);

  const blogList = await helper.blogsInDb();

  // delete the just saved blog
  await api
    .delete(`/api/blogs/${savedBlog.body.id}`)
    .set('Authorization', token)
    .expect(204);

  const blogListAfterDelete = await helper.blogsInDb();

  assert.strictEqual(blogList.length, blogListAfterDelete.length + 1);
  assert(!blogListAfterDelete.some((blog) => blog.id === savedBlog.body.id));
});

test('blog likes can be updated', async () => {
  const blogList = await helper.blogsInDb();
  const blogToBeUpdated = blogList[0];
  const updatedBlog = {
    ...blogToBeUpdated,
    likes: blogToBeUpdated.likes + 5,
  };

  const updatedBlogResponse = await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200);

  assert.strictEqual(updatedBlog.likes, updatedBlogResponse.body.likes);
});

describe('correct token', () => {
  test('no token provided when posting blog', async () => {
    await api
      .post('/api/blogs')
      .send(helper.oneBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('incorrect token provided when posting', async () => {
    const login = {
      username: helper.user.username,
      password: helper.user.password,
    };
    const savedLogin = await api.post('/api/login').send(login);
    const token = savedLogin.body.token;

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlog)
      .expect(401);
  });
});

after(async () => {
  await mongoose.connection.close();
});
