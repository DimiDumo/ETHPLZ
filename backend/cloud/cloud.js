Moralis.Cloud.define(
  'createNewUserWallet',
  async ({ user, params }) => {
    const { primaryKey } = params

    if (user.get('localWalletAddress') !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Wallet already registered')
    }

    const { data } = await api().post('/create-new-wallet', { primaryKey })

    const { walletUUID, newSmartWallet } = data
    user.set('localWalletAddress', newSmartWallet)
    user.set('walletUUID', walletUUID)
    user.set('currentPrimaryKey', primaryKey)
    await user.save(null, { useMasterKey: true })

    return { walletUUID, newSmartWallet }
  },
  {
    requireUser: true,
    useMasterKey: true
  }
)

// user object not always up-to-date unless you logout and log back in
Moralis.Cloud.define('getUser', async ({ user }) => JSON.parse(JSON.stringify(user)))
