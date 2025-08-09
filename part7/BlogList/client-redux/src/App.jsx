import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  createSuccessNotification,
  createErrorNotification,
  emptyNotification,
} from './reducers/notificationReducer'
import { logOut, logIn, initializeUser } from './reducers/userReducer'
import {
  initializeBlogs,
  addOneBlog,
  addOneLike,
  deleteOneBlog,
} from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (credentials) => {
    const username = credentials.username
    const password = credentials.password
    try {
      dispatch(logIn(username, password))
      dispatch(createSuccessNotification('login successful'))
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    } catch (exception) {
      dispatch(createErrorNotification('wrong username or password'))
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    dispatch(logOut())
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(addOneBlog(blogObject))
      dispatch(
        createSuccessNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
        ),
      )
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 2000)
    } catch (exception) {
      dispatch(createErrorNotification('adding new post failed'))
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    }
  }

  const addLike = async (blogObject) => {
    try {
      dispatch(addOneLike(blogObject))
      dispatch(
        createSuccessNotification(`new like added to ${blogObject.blog.title}`),
      )
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    } catch (exception) {
      dispatch(createErrorNotification('adding new like failed'))
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      dispatch(deleteOneBlog(blogObject))
      dispatch(
        createSuccessNotification(
          `blog ${blogObject.blog.title} deleted successfully`,
        ),
      )
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    } catch (exception) {
      dispatch(createErrorNotification('deleting blog failed'))
      setTimeout(() => {
        dispatch(emptyNotification())
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm login={handleLogin} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type="submit">logout</button>
        </p>
      </form>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((blogA, blogB) => blogB.likes - blogA.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            userId={user.userId}
          />
        ))}
    </div>
  )
}

export default App
