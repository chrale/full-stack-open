const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash, name: 'admin' })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      password: 'salainen',
      name: 'Matti Luukkainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('incorrect username and password', () => {
  test('username is missing', async () => {
    const newUserMissingUserName = {
      password: 'salainen',
      name: 'admin 2',
    }

    const responseMissingUserName = await api
      .post('/api/users')
      .send(newUserMissingUserName)
      .expect(400)

    const errorMessageMissingUserName = responseMissingUserName.body.error
    assert.strictEqual(errorMessageMissingUserName, 'User validation failed: username: Path `username` is required.')
  })

  test('password is missing', async () => {
    const newUserMissingPassword = {
      username: 'root',
      name: 'admin 2',
    }
    const responseMissingPassword = await api
      .post('/api/users')
      .send(newUserMissingPassword)
      .expect(400)

    const errorMessageMissingPassword = responseMissingPassword.body.error
    assert.strictEqual(errorMessageMissingPassword, 'password is not given!')
  })

  test('username is not unique', async () => {
    const newUser = {
      username: 'root',
      password: 'salainen',
      name: 'admin 2',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const errorMessage = response.body.error
    assert.strictEqual(errorMessage, 'expected `username` to be unique')
  })

  test('username is too short', async () => {
    const newUserTooShortUserName = {
      username: 'er',
      password: 'salainen',
      name: 'admin 2',
    }

    await api
      .post('/api/users')
      .send(newUserTooShortUserName)
      .expect(400)
  })

  test('password is too short', async () => {
    const newUserTooShortPassword = {
      username: 'root',
      password: 'er',
      name: 'admin 2',
    }
    const responseTooShortPassword = await api
      .post('/api/users')
      .send(newUserTooShortPassword)
      .expect(400)

    const errorMessageTooShortPassword = responseTooShortPassword.body.error
    assert.strictEqual(errorMessageTooShortPassword, 'password is too short!')
  })
})

after(async () => {
  await mongoose.connection.close()
})