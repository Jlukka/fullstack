import { configureStore, createSlice } from '@reduxjs/toolkit'

import loginService from "../services/login";
import blogService from "../services/blogs";

const userSlice = createSlice({
  name: "user",
  initialState: "",
  reducers: {
    login(state, action) {
      return action.payload
    },
    logout(state, action) {
      return ''
    }
  }
})

export const { login, logout } = userSlice.actions

export const Login = (username, password) => {
  return async dispatch => {
  const user = await loginService.login({ username, password });
  window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
  console.log(user)
  dispatch(login(user))
  blogService.setToken(user.token);
  }
}

export const loginWithJSON = (loggedUserJSON) => {
  return async dispatch => {
    const user = JSON.parse(loggedUserJSON);
    blogService.setToken(user.token);
    dispatch(login(user))
  }
}

export const Logout = () => {
  return async dispatch => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(logout())
  }
}

export default userSlice.reducer