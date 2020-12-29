import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type Beauty = {
  id: string
  instagram: string
  images: string[]
}

type Beauties =
  | {
      [key: string]: Beauty
    }
  | Record<string, never>

const initialState = {
  isFetching: false,
  data: {} as Beauties
}

export const fetchBeauties = createAsyncThunk('beauties/fetchBeauties', async () => {
  const resp = await fetch('/api/beauties')
  const parsedResp = await resp.json()
  return {
    beauties: parsedResp.beauties.reduce((acc: Beauties, cur: Beauty) => {
      acc[cur.id] = cur
      return acc
    }, {})
  }
})

export const fetchSaveBeauties = createAsyncThunk('beauties/fetchSaveBeauties', async () => {
  const resp = await fetch('/api/beauties', { method: 'POST' })
  const parsedResp = await resp.json()
  return {
    beauties: parsedResp.beauties.reduce((acc: Beauties, cur: Beauty) => {
      acc[cur.id] = cur
      return acc
    }, {})
  }
})

const beautiesSlice = createSlice({
  name: 'beauties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBeauties.fulfilled, (state, action) => {
      state.data = action.payload.beauties
    })
    builder.addCase(fetchSaveBeauties.pending, (state) => {
      state.isFetching = true
    })
    builder.addCase(fetchSaveBeauties.fulfilled, (state) => {
      state.isFetching = false
    })
    builder.addCase(fetchSaveBeauties.rejected, (state) => {
      state.isFetching = false
      // TODO: error handling
    })
  }
})

export default beautiesSlice.reducer
