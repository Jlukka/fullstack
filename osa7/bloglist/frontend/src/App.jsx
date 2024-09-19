import { useState, useEffect, useRef } from "react";

import { setNotification } from "./reducers/notificationReducer";

import { initializeBlogs, createBlog, updateBlog, deleteOneBlog } from "./reducers/blogReducer";

import { Login, loginWithJSON, Logout } from "./reducers/userReducer";

import { useDispatch, useSelector } from "react-redux";

import BlogView from "./components/BlogView";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      dispatch(loginWithJSON(loggedUserJSON))
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      dispatch(setNotification('notification', username, 5))
      dispatch(Login(username, password))
    } catch (exception) {
      const response = exception.response;
      dispatch(setNotification('error', response.data.error, 5))
    }
  };

  const handleLogout = (event) => {
    dispatch(Logout())
  };

  const handlePost = async ({ title, author, url }) => {
    try {
      dispatch(setNotification('notification', `new blog ${title} by ${author} added`, 5))

      blogFormRef.current.toggleVisibility()

      dispatch(createBlog({title, author, url}))

    } catch (exception) {
      const response = exception.response;
      dispatch(setNotification('error', response.data.error, 5))
    }
  };

  const likeBlog = async (blog) => {
    dispatch(updateBlog(blog))
  };

  const deleteBlog = async (blog) => {
    try {
      dispatch(deleteOneBlog(blog))
    } catch (exception) {
      const response = exception.response;
      dispatch(setNotification('error', response.data.error, 5))
    }
  };

  return (
    <div>
      <h1>blog app</h1>
      <Notification/>
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <BlogView
          user={user}
          handleLogout={handleLogout}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          handlePost={handlePost}
          blogFormRef={blogFormRef}
        />
      )}
    </div>
  );
};

export default App;
