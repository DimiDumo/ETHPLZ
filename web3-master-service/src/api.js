class ApiError extends Error {
  constructor(statusCode, errorMessage) {
    super(errorMessage)
    this.statusCode = statusCode
  }
}

const handleError = (err, apiRes) => {
  if (err instanceof ApiError) {
    apiRes.status(err.statusCode).json({ errorMessage: err.message })
  } else {
    console.log('err: ', err)
    apiRes.status(500).json({ message: err.message })
  }
}

const createHandler = (handler) => async (req, apiRes) => {
  try {
    const res = await handler(req)
    apiRes.status(200).json(res)
  } catch (err) {
    handleError(err, apiRes)
  }
}

const wrapMiddleware = (middleware) => async (req, res, next) => {
  try {
    await middleware(req)
  } catch (err) {
    handleError(err, res)
  }
  next()
}

module.exports = { ApiError, createHandler, wrapMiddleware }
