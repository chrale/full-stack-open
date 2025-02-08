import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    const username = credentials.username
    const password = credentials.password
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setNotification({ message: 'login successful', error: false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch (exception) {
      setNotification({ message: 'wrong username or password', error: true })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.createNew(blogObject)
      setBlogs((prevBlogs) => [...prevBlogs, blog])
      setNotification({ message: `a new blog ${blogObject.title} by ${blogObject.author} added`, error: false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch (exception) {
      setNotification({ message: 'adding new post failed', error: true })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addLike = async (blogObject) => {
    try {
      await blogService.addLikes(blogObject.id, blogObject.blog)
      setBlogs((prevBlogs) => prevBlogs.map((oneBlog) => {
        if (oneBlog.id===blogObject.id) {
          return { ...oneBlog, likes : blogObject.blog.likes }
        }
        return oneBlog
      }))

      setNotification({ message: `new like added to ${blogObject.blog.title}`, error: false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch (exception) {
      setNotification({ message: 'adding new like failed', error: true })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject.id)
      const newBlogs = blogs.filter((oneBlog) => oneBlog.id !== blogObject.id)
      setBlogs(newBlogs)
      setNotification({ message: `blog ${blogObject.blog.title} deleted successfully`, error: false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch (exception) {
      setNotification({ message: 'deleting blog failed', error: true })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification}/>
        <LoginForm
          login = {handleLogin}
        />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      <form onSubmit={handleLogout}>
        <p>
          {user.name} logged in
          <button type="submit">logout</button>
        </p>
      </form>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          createBlog = {addBlog}
        />
      </Togglable>
      {blogs
        .sort((blogA, blogB) => blogB.likes-blogA.likes)
        .map(blog => <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} userId={user.userId}/>)
      }
    </div>
  )
}

export default App