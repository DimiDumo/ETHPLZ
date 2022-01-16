Moralis.Cloud.define(
  'createNewUserWallet',
  async ({ user, params }) => {
    const { primaryKey } = params
    const logger = Moralis.Cloud.getLogger()

    logger.info(`params: ${JSON.stringify(params)}`)

    const localWalletAddress = user.get('localWalletAddress')
    if (localWalletAddress !== '0x0000000000000000000000000000000000000000' && localWalletAddress) {
      throw new Error('Wallet already registered')
    }

    const { data } = await api().post('/create-new-wallet', { primaryKey })

    const { walletUUID, newSmartWallet } = data
    logger.info(`smart wallet: ${newSmartWallet}`)
    user.set('localWalletAddress', newSmartWallet)
    logger.info(`uuid: ${walletUUID}`)
    user.set('walletUUID', walletUUID)
    logger.info(`prim key: ${primaryKey}`)
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
