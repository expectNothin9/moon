import { createSlice } from '@reduxjs/toolkit'

const LANDMARKS = [
  {
    id: 'TAIPEI_MAIN_STATION',
    name: '台北車站',
    lonLat: [121.5173735, 25.0477022]
  },
  { id: 'TAIPEI_101', name: '台北101', lonLat: [121.5645389, 25.033976] },
  {
    id: 'CKS_MEMORIAL_HALL',
    name: '中正紀念堂',
    lonLat: [121.521781, 25.0346119]
  }
]
const initialState = {
  map: {
    initialized: false
  },
  landmarks: LANDMARKS,
  selectedId: ''
}

const housesSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    setMapInitialized: (state, action) => {
      state.map.initialized = action.payload
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload
    }
  }
})

export const { setMapInitialized, setSelectedId } = housesSlice.actions

export default housesSlice.reducer
