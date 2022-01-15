require('dotenv').config()
const jwt = require('jsonwebtoken')
const { wrapMiddleware, ApiError } = require('./api.js')

const jwtVerify = (token) =>
  new Promise((resolve) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
      if (err) {
        resolve({ verified: false, content: null })
      } else {
        resolve({ verified: true, content: res })
      }
    })
  )

const verifyAuthToken = wrapMiddleware(async ({ body }) => {
  if (!body?.token) throw new ApiError(401, 'Missing .token auth token')
  const { verified } = await jwtVerify(body.token)
  if (!verified) throw new ApiError(401, 'Invalid token')
})

module.exports = { verifyAuthToken, jwtVerify }
