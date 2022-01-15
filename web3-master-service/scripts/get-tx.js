const getMasterWallet = require('../src/provider.js')

async function main() {
  const { provider } = getMasterWallet()
  const receipt = await provider.getTransactionReceipt(
    '0xd195536f2f58e62829fa89c23845f0c093887ee1c27238c2126a7876fcca58c4'
  )
  console.log('receipt: ', receipt)
  console.log('receipt.gasUsed.toString(): ', receipt.gasUsed.toString())
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
