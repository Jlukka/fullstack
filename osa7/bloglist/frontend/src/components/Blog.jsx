import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ user, blog, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "unview" : "view"}
        </button>
      </p>
      {visible && <p>{blog.url}</p>}
      {visible && (
        <p>
          {blog.likes} <button onClick={() => likeBlog(blog)}>like</button>
        </p>
      )}
      {visible && <p>{blog.user.name}</p>}
      {visible && user.username === blog.user.username && (
        <button
          onClick={() =>
            window.confirm(`confirm delete ${blog.title} by ${blog.author}`)
              ? deleteBlog(blog)
              : undefined
          }
        >
          delete
        </button>
      )}
    </div>
  );
};

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
