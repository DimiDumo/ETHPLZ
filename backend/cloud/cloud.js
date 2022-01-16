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

Moralis.Cloud.define(
  'createNewUserWallet',
  async ({ user, params }) => {
    const { primaryKey } = params

    if (user.get('localWalletAddress') !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Wallet already registered')
    }

    const res = await api().post('/create-new-wallet', {
      primaryKey,
      provideNewWalletAddress: true
    })
    const { data: newWallet } = res
    user.set('localWalletAddress', newWallet)
    await user.save(null, { useMasterKey: true })

    return newWallet
  },
  {
    requireUser: true,
    useMasterKey: true
  }
)
