const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { verifyAuthToken } = require('./src/verify-jwt.js')
const routes = require('./src/routes.js')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(verifyAuthToken)

const port = process.env.PORT || 8081
const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

app.use('/api', routes)

app.listen(port, () =>
  console.log(`start server on port ${port}; mode: ${mode}; node version: ${process.version}`)
)
