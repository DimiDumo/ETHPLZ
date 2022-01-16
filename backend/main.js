/* Moralis init code */
const serverUrl = 'https://hjokahdvmfah.usemoralis.com:2053/server'
const appId = 'iv7viFkSSsphlLGbduTjH3T181hwLNhaC9IBSUem'
Moralis.start({ serverUrl, appId })

/* Authentication code */
async function login() {
  let user = Moralis.User.current()
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: 'Log in using Moralis' })
      .then(function (user) {
        console.log('logged in user:', user)
        console.log(user.get('ethAddress'))
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

async function logOut() {
  await Moralis.User.logOut()
  console.log('logged out')
}

async function resetWalletAddress() {
  const params = {}
  const result = await Moralis.Cloud.run('resetWalletAddress', params)
  console.log('resetWalletAddress: ', result)
}

async function emailPasswordSignup(email, password) {
  console.log(email, password)
  const user = new Moralis.User()
  user.set('username', email)
  user.set('password', password)
  user.set('email', email)
  // TODO: An actual local address
  user.set('localWalletAddress', '0x0000000000000000000000000000000000000000')
  // TODO: Could add some signature verification but eh

  try {
    await user.signUp()
    // Hooray! Let them use the app now.
  } catch (error) {
    // Show the error message somewhere and let the user try again.
    alert('Error: ' + error.code + ' ' + error.message)
  }
}

async function generateContractWallet() {
  let user = Moralis.User.current()
  if (user) {
    const params = {}
    const result = await Moralis.Cloud.run('generateContractWallet', params)
    console.log('generateContractWallet: ', result)
  }
}

async function emailPasswordLogin(email, password) {
  console.log(email, password)

  let user = Moralis.User.current()
  if (!user) {
    user = await Moralis.User.logIn(email, password)
      .then(function (user) {
        console.log('logged in user:', user)
        console.log(JSON.stringify(user))
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

async function encryptCardDetails(publicKey, keyId, { number, cvv }) {
  const decodedPublicKey = await openpgp.readKey({ armoredKey: atob(publicKey) })
  const message = await openpgp.createMessage({ text: JSON.stringify({ number, cvv }) })
  const encryptedCreditCardData = await openpgp.encrypt({
    message,
    encryptionKeys: decodedPublicKey,
  }).then((ciphertext) => {
    return {
      encryptedMessage: btoa(ciphertext),
      keyId: keyId,
    }
  });

  return encryptedCreditCardData;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function circlePayment() {
  let user = Moralis.User.current()
  if (user) {
    const { publicKey, keyId } = await Moralis.Cloud.run('circle_publicKey', {})
    console.log('publicKey: ', publicKey)
    console.log('keyId: ', keyId)

    const cardDetails = { number: '4007400000000007', cvv: '123', expMonth: 1, expYear: 2025 };
    const encryptedCreditCardData = await encryptCardDetails(publicKey, keyId, cardDetails);

    const billingDetails = {
      'line1': 'Test',
      'line2': '',
      'city': 'Test City',
      'district': 'MA',
      'postalCode': '11111',
      'country': 'US',
      'name': 'Customer 0001'
    };
    const metadata = {
      'phoneNumber': '+12025550180',
      'email': 'customer-0001@circle.com',
      'sessionId': 'xxx',
      'ipAddress': '172.33.222.1'
    };

    const addCardResult = await Moralis.Cloud.run('circle_addCard', { cardDetails, encryptedCreditCardData, billingDetails, metadata });
    console.log('addCardResult: ', addCardResult);

    const source = {
      'id': addCardResult['id'],
      'type': 'card'
    };
    console.log(source);

    const payResult = await Moralis.Cloud.run('circle_pay', { amount: '420.69', metadata, encryptedCreditCardData, source });
    console.log('payResult: ', payResult);

    while (true) {
      await sleep(1000);
      let paymentStatus = await Moralis.Cloud.run('circle_paymentStatus', { id: payResult['id'] });
      console.log('new status: ', paymentStatus);
      // status will at first be "confirmed" and then eventually "complete"
      if (paymentStatus['status'] !== 'pending') {
        break;
      }
    }
  }
}

document.getElementById('btn-login').onclick = login
document.getElementById('btn-logout').onclick = logOut
document.getElementById('btn-reset').onclick = resetWalletAddress
document.getElementById('btn-gen').onclick = generateContractWallet
document.getElementById('btn-circle').onclick = circlePayment
