require('dotenv').config()
const { ethers } = require('ethers')

const getMasterWallet = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_PROVIDER)
  const masterWallet = new ethers.Wallet(process.env.MASTER_KEY, provider)
  return { masterWallet, provider }
}

module.exports = getMasterWallet
