import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: { message: '', visible: false },
    reducers: {
      showNotification(state, action) {
        return { message: action.payload, visible: true}
      },
      hideNotification() {
        return { message: '', visible: false }
      }
    }
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer