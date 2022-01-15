const hardhat = require('hardhat')
const { ethers } = hardhat

async function main() {
  const PlaceholderToken = await ethers.getContractFactory('PlaceholderToken')
  const token = await PlaceholderToken.deploy()
  console.log(`placeholder token deployed at ${token.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
