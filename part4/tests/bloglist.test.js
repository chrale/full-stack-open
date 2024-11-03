const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { emptyList, listWithOneBlog, biggerList } = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 36)
  })
})

describe('favourite blog', () => {
  test('of empty list is none', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.deepStrictEqual(result, 'list is empty!')
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    const blog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    assert.deepStrictEqual(result, blog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(biggerList)
    const blog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    assert.deepStrictEqual(result, blog)
  })
})

describe('most blogs', () => {
  test('of empty list is none', () => {
    const result = listHelper.mostBlogs(emptyList)
    assert.deepStrictEqual(result, 'list is empty!')
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const blog = {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    }
    assert.deepStrictEqual(result, blog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(biggerList)
    const blog = {
      author: 'Robert C. Martin',
      blogs: 3,
    }
    assert.deepStrictEqual(result, blog)
  })
})

describe('most likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostLikes(emptyList)
    assert.deepStrictEqual(result, 'list is empty!')
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const blog = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    assert.deepStrictEqual(result, blog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(biggerList)
    const blog = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    assert.deepStrictEqual(result, blog)
  })
})