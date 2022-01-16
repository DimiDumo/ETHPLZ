const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('PleaseWalletFactory', () => {
  let deployer, user1, user2, attacker
  let walletFactory
  let sig

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

    const SignatureValid = await ethers.getContractFactory('SignatureValid')
    sig = await SignatureValid.deploy()
  })
  it('creates wallet', async () => {
    await walletFactory.createDefaultWallet(user1.address)
  })
  it('get signer', async () => {
    console.log('sig: ', sig)
    await sig.getSigner(
      '0x1b6ef3999c9bb6250b9eabed7b7cd030046897784d50f8efd6b407cb0fb571a6',
      '0x4485f49cba5e7cdc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c0bcbf456349e02634baa38a2cd3aebc0855ad370000000000000000000000000eb00b28bfaa7cd4045e16801a3d8f9a74c623010000000000000000000000006ff546ec084962ac2a7962b0f94d5f766e467af4',
      '0x2956d1ad37e5674a2bcd4c4b27a62c0245b4a0400489d0780c3d8ec915dcb560146eabed742eb9b1b7ffff49f4483b1f1ed865f4c67f7d6840fbf00fb2eae3a41b'
    )
    const signer = await sig['signer()']()
    console.log('signer: ', signer)
  })
})
