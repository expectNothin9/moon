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
  },
  selectedId: ''
}

export const fetchBeauties = createAsyncThunk('beauties/fetchBeauties', async () => {
  const resp = await fetch('/api/beauties')
  const parsedResp = await resp.json()
  return parsedResp
})

export const fetchDeleteBeauty = createAsyncThunk(
  'beauties/fetchDeleteBeauty',

  async ({ beautyId }) => {
    const resp = await fetch(`/api/beauties/${beautyId}`, { method: 'DELETE' })
    const parsedResp = await resp.json()
    return parsedResp
  }
)

export const fetchSyncBeauties = createAsyncThunk('beauties/fetchSyncBeauties', async () => {
  const resp = await fetch('/api/beauties', { method: 'POST' })
  const parsedResp = await resp.json()
  return parsedResp
})

const beautiesSlice = createSlice({
  name: 'beauties',
  initialState,
  reducers: {
    selectBeauty: (state, action) => {
      state.selectedId = action.payload.beautyId
    }
  },
  extraReducers: {
    [fetchBeauties.fulfilled]: (state, action) => {
      state.data = arr2obj(action.payload.beauties)
    },
    [fetchDeleteBeauty.pending]: (state) => {
      state.isFetching = true
    },
    [fetchDeleteBeauty.fulfilled]: (state, action) => {
      state.isFetching = false
      const targetId = action.payload.beauty.id
      delete state.data[targetId]
    },
    [fetchDeleteBeauty.rejected]: (state) => {
      state.isFetching = false
      // TODO: error handling
    },
    [fetchSyncBeauties.pending]: (state) => {
      state.isFetching = true
    },
    [fetchSyncBeauties.fulfilled]: (state, action) => {
      state.isFetching = false
      action.payload.beauties.forEach((beauty) => {
        if (!state.data[beauty.id]) {
          state.data[beauty.id] = beauty
        }
      })
    },
    [fetchSyncBeauties.rejected]: (state) => {
      state.isFetching = false
      // TODO: error handling
    }
  }
})

export const { selectBeauty } = beautiesSlice.actions

export default beautiesSlice.reducer
