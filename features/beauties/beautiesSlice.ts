import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type Beauty = {
  id: string
  instagram: string
  images: string[]
}

type Beauties = {
  [key: string]: Beauty
} | {}

const initialState = {} as Beauties

export const fetchBeauties = createAsyncThunk('beauties/fetchBeauties', async () => {
  const resp = await fetch('/api/beauties')
  const parsedResp = await resp.json()
  return parsedResp
})

const beautiesSlice = createSlice({
  name: 'beauties',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBeauties.fulfilled, (state, action) => {
      return action.payload.beauties
    })
  }
})

export default beautiesSlice.reducer
