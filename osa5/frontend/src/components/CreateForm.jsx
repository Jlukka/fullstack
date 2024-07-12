import { useState } from 'react'

const CreateForm = ({ handlePost }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()

    handlePost({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
          title <input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} placeholder="write title here"/>
        <br></br>
          author <input type="text" value={author} name="author" onChange={({ target }) => setAuthor(target.value)} placeholder="write author here"/>
        <br></br>
          url <input type="text" value={url} name="url" onChange={({ target }) => setUrl(target.value)} placeholder="write url here"/>
        <br></br>
        <button type="submit">create new blog</button>
      </form>
    </div>
  )
}

export default CreateForm