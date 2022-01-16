const { ethers } = require('ethers')

async function main() {
  const walletInterface = new ethers.utils.Interface(require('../contracts/PleaseWalletAbi.json'))
  const calldata = walletInterface.encodeFunctionData('updateRecoverySettings', [
    [
      '0xc0bcbf456349e02634BAa38a2Cd3aEBC0855Ad37',
      '0x0Eb00b28Bfaa7Cd4045E16801A3D8F9a74c62301',
      '0x6fF546eC084962Ac2A7962b0f94d5f766e467aF4'
    ],
    2
  ])
  console.log('calldata: ', calldata)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
