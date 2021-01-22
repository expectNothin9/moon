import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  map: {
    initialized: false
  }
}

const housesSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    setMapInitialized: (state, action) => {
      state.map.initialized = action.payload
    }
  }
})

export const { setMapInitialized } = housesSlice.actions

export default housesSlice.reducer
