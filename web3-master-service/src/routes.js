const express = require('express')
const router = express.Router()
const { createHandler } = require('./api.js')
const { ethers } = require('ethers')
const { getMasterWallet } = require('./provider.js')
const { ApiError } = require('./api.js')
const PleaseWalletFactory = require('../contracts/WalletFactory.json')

const getContract = (provider, { abi, address }) => new ethers.Contract(address, abi, provider)

router.post(
  '/create-new-wallet/:primaryKey',
  createHandler(async ({ body }) => {
    let { primaryKey } = body
    if (!ethers.utils.isAddress(primaryKey)) {
      throw new ApiError(400, `"${primaryKey}" is not a valid address`)
    }
    primaryKey = ethers.utils.getAddress(primaryKey)
    const { masterWallet } = getMasterWallet()
    const walletFactory = getContract(masterWallet, PleaseWalletFactory)
    const tx = await walletFactory.createDefaultWallet(primaryKey)
    const { events } = await tx.wait()
    const [newWalletCreation] = events.filter(({ event }) => event === 'NewWalletCreated')

    return { newWalletAddress: newWalletCreation.args.walletAddress }
  })
)

module.exports = router
