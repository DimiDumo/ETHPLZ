const hardhat = require('hardhat')
const { ethers } = hardhat

async function main() {
  const verifications = []
  const GuardianManager = await ethers.getContractFactory('GuardianManager')
  const PleaseWallet = await ethers.getContractFactory('PleaseWallet')
  const PleaseWalletFactory = await ethers.getContractFactory('PleaseWalletFactory')

  const guardianManager = await GuardianManager.deploy()
  console.log(`guardian manager deployed at ${guardianManager.address}`)
  verifications.push(hardhat.run('verify:verify', { address: guardianManager.address }))
  console.log(`prefix: ${await guardianManager.GUARDIAN_CALL_PREFIX()}`)
  const plzWalletImplementation = await PleaseWallet.deploy()
  console.log(`PleaseWallet implementaiton deployed at: ${plzWalletImplementation.address}`)
  verifications.push(hardhat.run('verify:verify', { address: plzWalletImplementation.address }))
  const walletFactory = await PleaseWalletFactory.deploy()
  console.log(`wallet factory deployed at: ${walletFactory.address}`)
  verifications.push(
    hardhat.run('verify:verify', {
      address: walletFactory.address,
      constructorArguments: [plzWalletImplementation.address, guardianManager.address]
    })
  )
  await Promise.all(verifications)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
