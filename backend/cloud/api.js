function api() {
  const ENV = CLOUD_ENV()
  const createBasicReq = (method, setupOptions) => (path, options) => {
    if (path[0] === '/') path = path.slice(1)
    return Moralis.Cloud.httpRequest({
      method,
      url: `${ENV.API_URI}/api/${path}`,
      ...setupOptions({ ...options, auth: ENV.ACCESS_TOKEN })
    })
  }
  return {
    get: createBasicReq('GET', (params) => ({ params })),
    post: createBasicReq('POST', (body) => ({ body }))
  }
}
