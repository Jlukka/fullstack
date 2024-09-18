import { useState, useEffect, useRef } from "react";
import BlogView from "./components/BlogView";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState("");
  const [notification, setNotification] = useState(null);
  const [notifStyle, setNotifStyle] = useState(null);

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

      console.log(username);
      console.log(password);

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setNotification(`logged in as ${user.username}`);
      setNotifStyle("notification");
      setUser(user);
      blogService.setToken(user.token);
      console.log(user);
      setTimeout(() => {
        setNotification(null);
        setNotifStyle(null);
      }, 5000);
    } catch (exception) {
      const response = exception.response;
      setNotification(response.data.error);
      setNotifStyle("error");
      setTimeout(() => {
        setNotification(null);
        setNotifStyle(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    setUser("");
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const handlePost = async ({ title, author, url }) => {
    try {
      const blog = await blogService.create({ title, author, url });

      setNotification(`new blog ${blog.title} by ${blog.author} added`);
      setNotifStyle("notification");

      blogFormRef.current.toggleVisibility();

      setTimeout(() => {
        setNotification(null);
        setNotifStyle(null);
      }, 5000);
      console.log(blog);
      blog.user = user;
      setBlogs(blogs.concat(blog));
    } catch (exception) {
      const response = exception.response;
      setNotification(response.data.error);
      setNotifStyle("error");
      setTimeout(() => {
        setNotification(null);
        setNotifStyle(null);
      }, 5000);
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
      setNotification(response.data.error);
      setNotifStyle("error");
      setTimeout(() => {
        setNotification(null);
        setNotifStyle(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h1>blog app</h1>
      <Notification style={notifStyle} message={notification} />
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
