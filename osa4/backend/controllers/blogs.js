const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  } else {

  user = request.user
  
  
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  blogToDelete = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  const user = request.user
  userId = user.id.toString()

  blogUser = blogToDelete.user.toString()

  if (!(decodedToken.id) || (userId !== blogUser)) {
    return response.status(401).json({ error: 'invalid token' })
  } else {
    console.log('deleting')
    const user = request.user

    user.blogs = user.blogs.filter(blog => blog.id !== request.params.id)

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).end()
})

module.exports = blogsRouter