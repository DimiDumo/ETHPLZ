const getMasterWallet = require('../src/provider.js')

async function main() {
  const { provider } = getMasterWallet()
  const receipt = await provider.getTransactionReceipt(
    '0xacca609097a2773831090e98270a7cc152cfac770a4d1d4b3d7a56420404a1f2'
  )
  console.log('receipt: ', receipt)
  console.log('receipt.logs: ', receipt.logs)
  console.log('receipt.gasUsed.toString(): ', receipt.gasUsed.toString())
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
