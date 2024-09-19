import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  'style': null,
  'text': null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setStyleAndText(state, action) {
      console.log(action.payload)
      return action.payload
    },
    clearNotification(state, action) {
      return initialState
    }

  }
})

export const setNotification = (style, text, time) => {
  console.log(style)
  console.log(text)
  console.log(time)
  return async dispatch => {
    dispatch(setStyleAndText({ 'style': style, 'text': text}))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time*1000)
  }
}

export const { setStyleAndText, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
