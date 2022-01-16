const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('PleaseWalletFactory', () => {
  let deployer, user1, user2, attacker
  let walletFactory

  before(async () => {
    [deployer, user1, user2, attacker] = await ethers.getSigners()
    const GuardianManager = await ethers.getContractFactory('GuardianManager')
    const PleaseWallet = await ethers.getContractFactory('PleaseWallet')
    const PleaseWalletFactory = await ethers.getContractFactory('PleaseWalletFactory')
    const guardianManager = await GuardianManager.deploy()
    const plzWalletImplementation = await PleaseWallet.deploy()

    walletFactory = await PleaseWalletFactory.deploy(
      plzWalletImplementation.address,
      guardianManager.address
    )
  })
  it('creates wallet', async () => {
    await walletFactory.createDefaultWallet(user1.address)
  })
})
