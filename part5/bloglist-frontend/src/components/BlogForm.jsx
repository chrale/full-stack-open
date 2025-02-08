import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>create a new blog</h2> 
      <form onSubmit={handleAddBlog}>
        <div>
          <label htmlFor="title-input">title:</label>
          <input
            type="text"
            name="Title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            id="title-input"
          />
        </div>
        <div>
          <label htmlFor="author-input">author:</label>
          <input
            type="text"
            name="Author"
            value={author}
            onChange={event  => setAuthor(event.target.value)}
            id="author-input"
          />
        </div>
        <div>
          <label htmlFor="url-input">url:</label>
          <input
            type="text"
            name="Url"
            value={url}
            onChange={event => setUrl(event.target.value)}
            id="url-input"
          />
        </div>
        <button className="addBlog" type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm