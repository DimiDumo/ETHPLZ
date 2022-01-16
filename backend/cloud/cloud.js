Moralis.Cloud.define(
  'createNewUserWallet',
  async ({ params, user }) => {
    const logger = Moralis.Cloud.getLogger()
    logger.info(`params: ${JSON.stringify(params)}`)
    logger.info(`user: ${JSON.stringify(user)}`)

    if (user.localWalletAddress !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Wallet already registered')
    }

    return { wow: 'bob' }
  },
  {
    requireUser: true
  }
)
