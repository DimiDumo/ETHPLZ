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

const verifyAuthToken = wrapMiddleware(async ({ body, query }) => {
  const token = body?.auth ?? query?.auth
  if (!token) throw new ApiError(401, 'Missing .auth auth token')
  const { verified, content } = await jwtVerify(token)
  if (!verified) throw new ApiError(401, 'Invalid token')
  const { accessId } = content
  if (typeof accessId !== 'number' || accessId >= 100_000) {
    throw new ApiError(401, 'Invalid access ID')
  }
})

module.exports = { verifyAuthToken, jwtVerify }
