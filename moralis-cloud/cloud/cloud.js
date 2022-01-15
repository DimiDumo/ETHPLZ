Moralis.Cloud.define(
  'createNewUserWallet',
  async ({ params: primaryKey, user }) => {
    const logger = Moralis.Cloud.getLogger()

    if (user.localWalletAddress !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Wallet already registered')
    }

    return { wow: 'bob' }
  },
  {
    requireUser: true
  }
)
