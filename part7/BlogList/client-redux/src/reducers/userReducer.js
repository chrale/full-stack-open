import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'
import loginService from '../services/login'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    } else {
      dispatch(setUser(null))
    }
  }
}

export const logOut = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedUser')
    dispatch(setUser(null))
  }
}

export const logIn = (username, password) => {
  return async (dispatch) => {
    const userLogin = await loginService.login({ username, password })
    window.localStorage.setItem('loggedUser', JSON.stringify(userLogin))
    blogService.setToken(userLogin.token)
    dispatch(setUser(userLogin))
  }
}

export const { setUser } = userSlice.actions

export default userSlice.reducer
