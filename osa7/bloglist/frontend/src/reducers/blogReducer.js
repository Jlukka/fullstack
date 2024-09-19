import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: 'blogs',
  initialState:  [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    likeBlog(state, action) {
      const likedBlog = action.payload
      return state.map((b) => (b.id === likedBlog.id ? likedBlog : b))
    },
    removeBlog(state, action) {
      const blog = action.payload
      return state.filter((b) => b.id !== blog.id)
    }
  }
})

export const { setBlogs, appendBlog, likeBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    console.log(newBlog)
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlog = (content) => {
  console.log(content)
  return async dispatch => {
    const likedBlog = { ...content, likes: content.likes + 1 };
    await blogService.update(likedBlog);
    dispatch(likeBlog(likedBlog))
  }
}

export const deleteOneBlog = (content) => {
  console.log(content)
  return async dispatch => {
    await blogService.deleteBlog(content)
    dispatch(removeBlog(content))
  }
}


export default blogSlice.reducer