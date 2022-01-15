const express = require('express')
const router = express.Router()
const { createHandler } = require('./api.js')
const { ethers } = require('ethers')
const getMasterWallet = require('./provider.js')
const { ApiError } = require('./api.js')

const PleaseWalletFactory = require('../contracts/WalletFactory.json')
const PleaseWalletAbi = require('../contracts/PleaseWalletAbi.json')

const getContract = (provider, { abi, address }) => new ethers.Contract(address, abi, provider)
const getWallet = (provider, address) => new ethers.Contract(address, PleaseWalletAbi, provider)

const validateAddress = (address) => {
  if (!ethers.utils.isAddress(address)) {
    throw new ApiError(400, `"${address}" is not a valid address`)
  }
  return ethers.utils.getAddress(address)
}

router.post(
  '/create-new-wallet',
  createHandler(async ({ body }) => {
    let { primaryKey, provideNewWalletAddress = false } = body
    primaryKey = validateAddress(primaryKey)
    const { masterWallet } = getMasterWallet()
    const walletFactory = getContract(masterWallet, PleaseWalletFactory)
    const tx = await walletFactory.createDefaultWallet(primaryKey)
    if (!provideNewWalletAddress) {
      return null
    }
    const { events } = await tx.wait()
    const [newWalletCreation] = events.filter(({ event }) => event === 'NewWalletCreated')

    return newWalletCreation.args.walletAddress
  })
)

router.get(
  '/primary-key/:walletAddress',
  createHandler(async ({ params }) => {
    const { masterWallet } = getMasterWallet()
    const walletAddress = validateAddress(params?.walletAddress)
    const wallet = getWallet(masterWallet, walletAddress)
    return await wallet.primarySigner()
  })
)

router.get(
  '/master-key',
  createHandler(async () => {
    const { masterWallet } = getMasterWallet()
    return masterWallet.address
  })
)

module.exports = router
