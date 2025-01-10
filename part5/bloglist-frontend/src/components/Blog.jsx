import { useState } from "react"

const Blog = ({ blog }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!blogVisible) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}  
        <button onClick={() => setBlogVisible(true)}>view</button>
        </div>  
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}  
          <button onClick={() => setBlogVisible(false)}>hide</button><br/>
          {blog.url}<br/>
          likes {blog.likes} <button onClick={()=>addLike()}>like</button><br/>
          {blog.user.name}
          </div>  
      </div>
    )
  }

}

export default Blog