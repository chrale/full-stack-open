import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    createBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      const newBlogs = state.filter(
        (oneBlog) => oneBlog.id !== action.payload.id,
      )
      return newBlogs
    },
    addLike(state, action) {
      const newBlogs = state.map((oneBlog) => {
        if (oneBlog.id === action.payload.id) {
          return { ...oneBlog, likes: action.payload.blog.likes }
        }
        return oneBlog
      })
      return newBlogs
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const addOneBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.createNew(blogObject)
    dispatch(createBlog(newBlog))
  }
}

export const addOneLike = (blogObject) => {
  return async (dispatch) => {
    await blogService.addLikes(blogObject.id, blogObject.blog)
    dispatch(addLike(blogObject))
  }
}

export const deleteOneBlog = (blogObject) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blogObject.id)
    dispatch(removeBlog(blogObject))
  }
}

export const { setBlogs, createBlog, removeBlog, addLike } = blogSlice.actions

export default blogSlice.reducer
