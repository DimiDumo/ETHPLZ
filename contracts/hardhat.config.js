require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
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
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000
      }
    }
  },
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // public metamask url
      accounts
    },
    polygon: {
      url: 'http://polygon-rpc.com/',
      accounts,
      gasPrice: 51000000000
    }
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_KEY,
      polygon: process.env.POLYGONSCAN_KEY
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD'
  }
}
