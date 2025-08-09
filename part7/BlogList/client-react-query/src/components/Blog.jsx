import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, addLike, deleteBlog, userId }) => {
  const [blogVisible, setBlogVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = (event) => {
    event.preventDefault();
    addLike({
      id: blog.id,
      blog: {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      },
    });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog({
        id: blog.id,
        blog: {
          user: blog.user.id,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url,
        },
      });
    }
  };

  if (!blogVisible) {
    return (
      <div className="blog" style={blogStyle}>
        &apos;{blog.title}&apos; by {blog.author}
        <br />
        <button className="viewDetails" onClick={() => setBlogVisible(true)}>
          view details
        </button>
      </div>
    );
  } else {
    return (
      <div className="blog" style={blogStyle}>
        Title: {blog.title}
        <br />
        Author: {blog.author}
        <br />
        <button className="hideDetails" onClick={() => setBlogVisible(false)}>
          hide details
        </button>
        <br />
        Url: {blog.url}
        <br />
        Likes: {blog.likes}
        <br />
        <button className="addLike" onClick={handleLike}>
          add like
        </button>
        <br />
        Added by user: {blog.user.name}
        <br />
        {userId === blog.user.id ? (
          <button onClick={handleDelete}>remove blog</button>
        ) : (
          ''
        )}
      </div>
    );
  }
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
