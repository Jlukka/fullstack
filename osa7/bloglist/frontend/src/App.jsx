import { useState, useEffect, useRef } from "react";

import { clearNotification, setNotification } from "./reducers/notificationReducer";

import { useDispatch } from "react-redux";

import BlogView from "./components/BlogView";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState("");

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      dispatch(setNotification('notification', username, 5))
      console.log("asd")
      console.log(username);
      console.log(password);

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      setUser(user);
      blogService.setToken(user.token);
      console.log(user);
    } catch (exception) {
      const response = exception.response;
      dispatch(setNotification('error', response.data.error, 5))
    }
  };

  const handleLogout = (event) => {
    setUser("");
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const handlePost = async ({ title, author, url }) => {
    try {
      const blog = await blogService.create({ title, author, url });

      dispatch(setNotification('notification', `new blog ${blog.title} by ${blog.author} added`, 5))

      blogFormRef.current.toggleVisibility();

      console.log(blog);
      blog.user = user;
      setBlogs(blogs.concat(blog));
    } catch (exception) {
      const response = exception.response;
      dispatch(setNotification('error', response.data.error, 5))
    }
  };

  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    await blogService.update(likedBlog);
    setBlogs(blogs.map((b) => (b.id === blog.id ? likedBlog : b)));
  };

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteBlog(blog);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
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
          blogs={blogs}
        />
      )}
    </div>
  );
};

export default App;
