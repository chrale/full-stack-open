import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [author, setAuthor] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    
    const addBlog = (event) => {
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
            <form onSubmit={addBlog}>
                <div>
                title:<input 
                    type="text"
                    name="Title"
                    value={title}
                    onChange={ event => setTitle(event.target.value)}
                />
                </div>
                <div>
                author:<input 
                    type="text"
                    name="Author"
                    value={author}
                    onChange={ event  => setAuthor(event.target.value)}
                />
                </div>
                <div>
                url:<input 
                    type="text"
                    name="Url"
                    value={url}
                    onChange={ event => setUrl(event.target.value)}
                />
                </div>
                <button type="submit">create</button>
            </form>
      </div>
    )
}

export default BlogForm