require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const accounts = process.env.PRIV_KEY !== undefined ? [process.env.PRIV_KEY] : []

task('update-implementation')
  .addParam('factory', 'address of wallet factory')
  .setAction(async ({ factory }, { ethers }) => {
    const walletFactory = await ethers.getContractAt('PleaseWalletFactory', factory)
    const PleaseWallet = await ethers.getContractFactory('PleaseWallet')
    const plzWalletImplementation = await PleaseWallet.deploy()
    await plzWalletImplementation.deployed()
    await walletFactory.setDefaultImplementation(plzWalletImplementation.address)
    console.log(`PleaseWallet deployed at ${plzWalletImplementation.address}`)
  })

module.exports = {
  solidity: {
    version: '0.8.11',
    optimizer: {
      enabled: true,
      runs: 10_000
    }
  },
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // public metamask url
      accounts
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
}
