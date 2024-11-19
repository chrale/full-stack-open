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

    await api
      .post('/api/users')
      .send(helper.user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(helper.user.username))
  })
})

describe('incorrect username and password', () => {
  test('username is missing', async () => {
    const responseMissingUserName = await api
      .post('/api/users')
      .send(helper.userMissingUserName)
      .expect(400)

    const errorMessageMissingUserName = responseMissingUserName.body.error
    assert.strictEqual(errorMessageMissingUserName, 'User validation failed: username: Path `username` is required.')
  })

  test('password is missing', async () => {
    const responseMissingPassword = await api
      .post('/api/users')
      .send(helper.userMissingPassword)
      .expect(400)

    const errorMessageMissingPassword = responseMissingPassword.body.error
    assert.strictEqual(errorMessageMissingPassword, 'password is not given!')
  })

  test('username is not unique', async () => {
    const response = await api
      .post('/api/users')
      .send(helper.userNotUniqueName)
      .expect(400)

    const errorMessage = response.body.error
    assert.strictEqual(errorMessage, 'expected `username` to be unique')
  })

  test('username is too short', async () => {
    await api
      .post('/api/users')
      .send(helper.userTooShortUserName)
      .expect(400)
  })

  test('password is too short', async () => {
    const responseTooShortPassword = await api
      .post('/api/users')
      .send(helper.userTooShortPassword)
      .expect(400)

    const errorMessageTooShortPassword = responseTooShortPassword.body.error
    assert.strictEqual(errorMessageTooShortPassword, 'password is too short!')
  })
})

after(async () => {
  await mongoose.connection.close()
})