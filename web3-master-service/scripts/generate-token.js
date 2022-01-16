const jwt = require('jsonwebtoken')
require('dotenv').config()

async function main() {
  const randomId = Math.floor(Math.random() * 100000)
  console.log(`id: #${randomId}`)
  const token = jwt.sign({ accessId: randomId }, process.env.JWT_SECRET)
  console.log('token: ', token)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('err:', err)
    process.exit(1)
  })
