Moralis.Cloud.define(
  'createNewUserWallet',
  async ({ params: primaryKey, user }) => {
    const logger = Moralis.Cloud.getLogger()
    const web3 = Moralis.web3ByChain('0x4')
    const { address: mainAccount } = web3.eth.accounts.wallet.add(CLOUD_ENV().MASTER_KEY)

    if (user.localWalletAddress !== '0x0000000000000000000000000000000000000000') {
      throw new Error('Wallet already registered')
    }

    const contracts = getContracts(web3)

    return { wow: 'bob' }
  },
  {
    requireUser: true
  }
)
