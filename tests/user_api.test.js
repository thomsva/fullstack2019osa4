const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('adding a new user', () => {

  const newUser = {
    username: "Iines",
    name: "Iines Ankka",
    password: "12"
  }

  test('is rejected if password is too short', async () => {
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(0)
  })

  test('is rejected if username is too short', async () => {
    newUser.username = 'a'
    newUser.password = '123'
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(0)
  })

  test('works correctly when input is valid', async () => {
    newUser.username = 'Iines'
    newUser.password = '123'
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(1)
  })

  test('is rejected if username already exists', async () => {
    newUser.username = 'Iines'
    newUser.password = '123'
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(1)
  })


})

afterAll(() => {
  mongoose.connection.close()
})