import { configureStore } from '@reduxjs/toolkit'
import userSlicer from './reducer/userSlicer.js'
import bookSlicer from './reducer/bookSlicer.js';

export const store = configureStore({
  reducer: {
    user: userSlicer,
    book: bookSlicer
  },
})

export const server = 'http://localhost:4000/api/v1';