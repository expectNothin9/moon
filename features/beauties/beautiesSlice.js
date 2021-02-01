import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { arr2obj } from '../../util/array'

const initialState = {
  isFetching: false,
  data: {
    // [id]: {
    //   id,
    //   instagram,
    //   images: []
    // }
  }
}

export const fetchBeauties = createAsyncThunk('beauties/fetchBeauties', async () => {
  const resp = await fetch('/api/beauties')
  const parsedResp = await resp.json()
  return parsedResp
})

export const fetchSaveBeauties = createAsyncThunk('beauties/fetchSaveBeauties', async () => {
  const resp = await fetch('/api/beauties', { method: 'POST' })
  const parsedResp = await resp.json()
  return parsedResp
})

const beautiesSlice = createSlice({
  name: 'beauties',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchBeauties.fulfilled]: (state, action) => {
      state.data = arr2obj(action.payload.beauties)
    },
    [fetchSaveBeauties.pending]: (state) => {
      state.isFetching = true
    },
    [fetchSaveBeauties.fulfilled]: (state, action) => {
      state.isFetching = false
      action.payload.beauties.forEach((beauty) => {
        if (!state.data[beauty.id]) {
          state.data[beauty.id] = beauty
        }
      })
    },
    [fetchSaveBeauties.rejected]: (state) => {
      state.isFetching = false
      // TODO: error handling
    }
  }
})

export default beautiesSlice.reducer
