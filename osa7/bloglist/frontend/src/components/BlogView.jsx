import Blog from "./Blog";
import Togglable from "./Togglable";
import CreateForm from "./CreateForm";

import { useSelector } from "react-redux"


const BlogView = ({
  user,
  handleLogout,
  likeBlog,
  deleteBlog,
  handlePost,
  blogFormRef,
}) => {
  const compareByLikes = (a, b) => {
    return b.likes - a.likes;
  };

  const blogs = [...useSelector(state => state.blogs)]

  return (
    <div>
      <p>
        {`${user.name} logged in`}{" "}
        <button onClick={handleLogout}>log out</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateForm handlePost={handlePost} />
      </Togglable>
      <h2>blogs</h2>
      {blogs.sort(compareByLikes).map((blog) => (
        <Blog
          user={user}
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default BlogView;
