import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    createErrorNotification(state, action) {
      return {
        message: action.payload,
        error: true,
      }
    },
    createSuccessNotification(state, action) {
      return {
        message: action.payload,
        error: false,
      }
    },
    emptyNotification(state, action) {
      return null
    },
  },
})

export const {
  createSuccessNotification,
  createErrorNotification,
  emptyNotification,
} = notificationSlice.actions

export default notificationSlice.reducer
