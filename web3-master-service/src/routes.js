const _ = require('lodash')
const express = require('express')
const router = express.Router()
const { createHandler } = require('./api.js')
const { ethers } = require('ethers')
const getMasterWallet = require('./provider.js')
const { ApiError } = require('./api.js')

const PleaseWalletFactory = require('../contracts/WalletFactory.json')
const GuardianManager = require('../contracts/GuardianManager.json')
const PleaseWalletAbi = require('../contracts/PleaseWalletAbi.json')

const getContract = ({ abi, address }) =>
  new ethers.Contract(address, abi, getMasterWallet().masterWallet)
const getWallet = (address) =>
  new ethers.Contract(address, PleaseWalletAbi, getMasterWallet().masterWallet)

const validateAddress = (address) => {
  if (!ethers.utils.isAddress(address)) {
    throw new ApiError(400, `"${address}" is not a valid address`)
  }
  return ethers.utils.getAddress(address)
}

async function getPrimarySigner(walletAddress) {
  const wallet = getWallet(walletAddress)
  return await wallet.primarySigner()
}

async function getExistingWallet(signerAddress) {
  const walletFactory = getContract(PleaseWalletFactory)
  const newWalletCreationFilter = walletFactory.filters.NewWalletCreated(null, signerAddress)
  const events = await walletFactory.queryFilter(newWalletCreationFilter)
  const wallets = events.map(({ args }) => args.walletAddress)
  const primarySigners = await Promise.all(wallets.map(getPrimarySigner))
  const res = _.zip(wallets, primarySigners).filter(
    ([, primarySigner]) => primarySigner === signerAddress
  )
  if (!res.length) return null
  const [[firstWallet]] = res
  return firstWallet
}

async function getSmartWallet(primaryKey) {
  const walletFactory = getContract(PleaseWalletFactory)
  const existingWallet = await getExistingWallet(primaryKey)
  if (existingWallet) return existingWallet
  const tx = await walletFactory.createDefaultWallet(primaryKey)
  const { events } = await tx.wait()
  const [newWalletCreation] = events.filter(({ event }) => event === 'NewWalletCreated')

  return newWalletCreation.args.walletAddress
}

router.post(
  '/create-new-wallet',
  createHandler(async ({ body }) => {
    let { primaryKey } = body
    primaryKey = validateAddress(primaryKey)
    const newSmartWallet = await getSmartWallet(primaryKey)
    const walletUUID = await getWallet(newSmartWallet).WALLET_UUID()
    return { walletUUID, newSmartWallet }
  })
)

router.get(
  '/primary-key/:walletAddress',
  createHandler(async ({ params }) => {
    const walletAddress = validateAddress(params?.walletAddress)
    return await getPrimarySigner(walletAddress)
  })
)

router.get(
  '/master-key',
  createHandler(async () => {
    const { masterWallet } = getMasterWallet()
    return masterWallet.address
  })
)

router.post(
  '/submit-recovery',
  createHandler(async ({ body }) => {
    const { masterAccept, targetWallet, newSigner, guardianAccepts } = body
    const calldata = getWallet(targetWallet).interface.encodeFunctionData('resetPrimarySigner', [
      newSigner
    ])
    if (masterAccept) {
      guardianAccepts.push({
        isPlzWallet: false,
        salt: ethers.utils.hexZeroPad('0x0', 32),
        signature: '0x',
        guardian: getMasterWallet().masterWallet.address
      })
    }
    const guardianManager = getContract(GuardianManager)
    const tx = await guardianManager.executeGuardianCall(targetWallet, guardianAccepts, calldata, {
      gasLimit: 2000000
    })
    return tx.hash
  })
)

module.exports = router
