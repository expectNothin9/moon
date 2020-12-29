import { configureStore } from '@reduxjs/toolkit'

import beautiesReducer from './features/beauties/beautiesSlice'
import clockReducer from './lib/slices/clockSlice'
import counterReducer from './lib/slices/counterSlice'
import notesReducer from './lib/slices/notesSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    clock: clockReducer,
    notes: notesReducer,
    beauties: beautiesReducer
  },
  devTools: true
})

export default store

export type RootState = ReturnType<typeof store.getState>
