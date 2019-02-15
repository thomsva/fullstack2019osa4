const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
morgan.token('json-data', (req) => JSON.stringify(req.body))

//connect database
logger.info('connecting to', config.mongoUrl)
mongoose.set('useCreateIndex', true); //avoid deprecation warning
mongoose.set('useFindAndModify', false); //avoid deprecation warning
mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connection to MongoDB:', error.message)
  })

//middleware
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json-data'))
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app

