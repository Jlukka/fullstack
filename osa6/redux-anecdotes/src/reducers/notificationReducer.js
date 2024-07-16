import { createSlice } from "@reduxjs/toolkit"


const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action) {
      return action.payload
    }
  }
})

export const setNotification = (msg, time) => {
  return async dispatch => {
    dispatch(notificationChange(msg))
    setTimeout(() => {
      dispatch(notificationChange(''))
    }, time*1000)
  }
}

export const { notificationChange } = notificationSlice.actions
export default notificationSlice.reducer