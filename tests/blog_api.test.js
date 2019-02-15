const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const _ = require('lodash')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  }]

const newBlog = {
  title: "New test note",
  author: "Aku Ankka",
  url: "http://new.note",
  likes: 2
}

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let note of initialBlogs) {
    let noteObject = new Blog(note)
    await noteObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('field id exists', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const title = response.body.map(r => r.title)
  expect(title).toContain(
    'React patterns'
  )
})

test('the number of blogs is correct', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length)
})


test('adding a blog works and the response is correct', async () => {
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(titles).toContain('New test note')
})

test('likes defaults to zero if not defined', async () => {
  var blog = _.clone(newBlog)
  delete blog.likes
  await api
    .post('/api/blogs')
    .send(blog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const addedBlog = response.body.filter(blog => blog.title === 'New test note')[0]
  expect(addedBlog.likes).toBe(0)
})

test('blog is not added if title is missing', async () => {
  var blog = _.clone(newBlog)
  delete blog.title
  await api
    .post('/api/blogs')
    .send(blog)
    .expect(400)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length)
})

test('blog is not added if url is missing', async () => {
  var blog = _.clone(newBlog)
  delete blog.url
  await api
    .post('/api/blogs')
    .send(blog)
    .expect(400)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const response = await api.get('/api/blogs')
  const deleteId = response.body[0].id
  await api
    .delete(`/api/blogs/${deleteId}`)
    .expect(204)
  const secondResponse = await api.get('/api/blogs')
  expect(secondResponse.body.length).toBe(initialBlogs.length - 1)
})

test('a blog can be updated', async () => {
  const response = await api.get('/api/blogs')
  var updateBlog = response.body[0]
  updateBlog.likes = 1000
  await api
    .put(`/api/blogs/${updateBlog.id}`)
    .send(updateBlog)
    .expect(200)
  const secondResponse = await api.get('/api/blogs')
  expect(secondResponse.body.filter(blog => blog.title === updateBlog.title)[0].likes).toBe(1000)
})



afterAll(() => {
  mongoose.connection.close()
})