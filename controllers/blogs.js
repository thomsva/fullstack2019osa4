const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  console.log('hep')
  const token = getTokenFrom(request)
  console.log('token', token)
  var blog = new Blog(request.body)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    blog.user = user

    if (blog.likes == null) blog.likes = 0

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(200).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end();
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog);
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter