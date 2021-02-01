import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  appEnv: process.env.APP_ENV
}

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    // setAppEnv: (state, action) => {
    //   state.appEnv = action.payload
    // }
  }
})

// export const { setAppEnv } = sharedSlice.actions

export default sharedSlice.reducer
