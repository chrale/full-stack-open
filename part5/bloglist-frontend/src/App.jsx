import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleCreateNew = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.createNew({title, author, url})
      setBlogs((prevBlogs) => [...prevBlogs, blog])
      setTitle('')
      setUrl('')
      setAuthor('')
      setNotification({ message: `a new blog ${title} by ${author} added`, error: false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch (exception) {
      setTitle('')
      setUrl('')
      setAuthor('')
      setNotification({ message: 'adding new post failed', error: true })
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
        <form onSubmit={handleLogin}>
          <div>
            username
            <input 
              type="text"
              name="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input 
              type="password"
              name="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
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
      <h2>create new</h2>
        <form onSubmit={handleCreateNew}>
          <div>
            title:<input 
              type="text"
              name="Title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:<input 
              type="text"
              name="Author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:<input 
              type="text"
              name="Url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      {blogs
        .filter(blog => blog.user.username === user.username)
        .map(blog => <Blog key={blog.id} blog={blog} />)
      }
    </div>
  )
}
export default App