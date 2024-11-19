const Blog = require('../models/blog')
const User = require('../models/user')

const emptyList = []
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const biggerList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const oneBlog = {
  _id: '5a422aa71b54a676234d17f1',
  title: 'One Blog Title',
  author: 'One B. Author',
  url: 'https://blogspot.fi/blog/web-page.pdf',
  likes: 8,
  __v: 0
}

const oneBlogMissingLikes = {
  _id: '5a422aa71b54a676234d17f1',
  title: 'One Blog Title',
  author: 'One B. Author',
  url: 'https://blogspot.fi/blog/web-page.pdf',
  __v: 0
}

const oneBlogMissingURL = {
  _id: '5a422aa71b54a676234d17f1',
  title: 'One Blog Title',
  author: 'One B. Author',
  likes: 8,
  __v: 0
}

const oneBlogMissingTitle = {
  _id: '5a422aa71b54a676234d17f1',
  author: 'One B. Author',
  url: 'https://blogspot.fi/blog/web-page.pdf',
  likes: 8,
  __v: 0
}

const oneBlogMissingURLTitle = {
  _id: '5a422aa71b54a676234d17f1',
  author: 'One B. Author',
  likes: 8,
  __v: 0
}

const user = {
  username: 'mattim',
  password: 'salainen',
  name: 'Matti Meikäläinen',
}

const userMissingUserName = {
  password: 'salainen',
  name: 'admin 2',
}

const userMissingPassword = {
  username: 'root',
  name: 'admin 2',
}

const userTooShortPassword = {
  username: 'root',
  password: 'er',
  name: 'admin 2',
}

const userTooShortUserName = {
  username: 'er',
  password: 'salainen',
  name: 'admin 2',
}

const userNotUniqueName = {
  username: 'root',
  password: 'salainen',
  name: 'admin 2',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  emptyList, biggerList, listWithOneBlog, oneBlog, oneBlogMissingLikes,
  oneBlogMissingTitle, oneBlogMissingURL, oneBlogMissingURLTitle,
  user, userMissingUserName, userMissingPassword, userTooShortPassword, userTooShortUserName, userNotUniqueName,
  blogsInDb, usersInDb
}