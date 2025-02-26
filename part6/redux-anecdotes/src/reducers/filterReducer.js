import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: 'ALL',
  reducers: {
    filterChange(state, action) {
      const filterContent = action.payload
      return filterContent
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer