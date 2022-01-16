const hardhat = require('hardhat')
const { ethers } = hardhat

const delay = (timeout) => new Promise((resolve) => setTimeout(() => resolve(), timeout))

async function main() {
  const verifications = []
  const GuardianManager = await ethers.getContractFactory('GuardianManager')
  const PleaseWallet = await ethers.getContractFactory('PleaseWallet')
  const PleaseWalletFactory = await ethers.getContractFactory('PleaseWalletFactory')

  const guardianManager = await GuardianManager.deploy()
  console.log(`guardian manager deployed at ${guardianManager.address}`)
  verifications.push({ address: guardianManager.address })
  console.log(`prefix: ${await guardianManager.GUARDIAN_CALL_PREFIX()}`)
  const plzWalletImplementation = await PleaseWallet.deploy()
  console.log(`PleaseWallet implementaiton deployed at: ${plzWalletImplementation.address}`)
  verifications.push({ address: plzWalletImplementation.address })
  const walletFactory = await PleaseWalletFactory.deploy(
    plzWalletImplementation.address,
    guardianManager.address
  )
  console.log(`wallet factory deployed at: ${walletFactory.address}`)
  verifications.push({
    address: walletFactory.address,
    constructorArguments: [plzWalletImplementation.address, guardianManager.address]
  })
  await delay(30 * 1000)
  for (const verif of verifications) {
    await hardhat.run('verify:verify', verif)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
