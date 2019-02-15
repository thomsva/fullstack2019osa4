const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (body.password.length < 3) {
      return response.status(400).json({ error: 'password too short (minlenght=3)' })
    }
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {

  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter