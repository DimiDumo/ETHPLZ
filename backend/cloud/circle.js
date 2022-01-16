const api_key =
  'QVBJX0tFWToxZDBiY2NkNzk2Y2E4ZDQ5MWEwYTRjMTJhYTgzYjBhOTowYjU1MGU5MjA0ZDM3ZGQ1MDYwMzAxYmZmNmNkMjhlYQ'
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + api_key
}

const uuidv4 = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

Moralis.Cloud.define(
  'circle_publicKey',
  async (request) => {
    return await Moralis.Cloud.httpRequest({
      url: 'https://api-sandbox.circle.com/v1/encryption/public',
      headers: headers
    }).then(
      function (httpResponse) {
        console.log(httpResponse.text)
        let jsonObj = JSON.parse(httpResponse.text)
        return { publicKey: jsonObj['data']['publicKey'], keyId: jsonObj['data']['keyId'] }
      },
      function (httpResponse) {
        throw 'Request failed with response code ' + JSON.stringify(httpResponse)
      }
    )
  },
  {
    requireUser: true
  }
)

Moralis.Cloud.define(
  'circle_addCard',
  async (request) => {
    let { cardDetails, encryptedCreditCardData, billingDetails, metadata } = request.params
    const addCardBody = {
      idempotencyKey: uuidv4(),
      expMonth: cardDetails.expMonth,
      expYear: cardDetails.expYear,
      keyId: encryptedCreditCardData.keyId,
      encryptedData: encryptedCreditCardData.encryptedMessage,
      billingDetails: billingDetails,
      metadata: metadata
    }
    return await Moralis.Cloud.httpRequest({
      method: 'POST',
      url: 'https://api-sandbox.circle.com/v1/cards',
      headers: headers,
      body: addCardBody
    }).then(
      function (httpResponse) {
        console.log(httpResponse.text)
        let jsonObj = JSON.parse(httpResponse.text)
        return jsonObj['data']
      },
      function (httpResponse) {
        throw 'Request failed with response code ' + JSON.stringify(httpResponse)
      }
    )
  },
  {
    requireUser: true
  }
)

Moralis.Cloud.define(
  'circle_pay',
  async (request) => {
    let { amount, metadata, encryptedCreditCardData, source } = request.params
    console.log('amount: ', amount)
    console.log('metadata: ', metadata)
    console.log('encryptedCreditCardData: ', encryptedCreditCardData)
    console.log('source: ', source)
    const paymentBody = {
      idempotencyKey: uuidv4(),
      amount: {
        amount: amount,
        currency: 'USD'
      },
      verification: 'cvv',
      source: source,
      description: '',
      channel: '',
      metadata: metadata,
      keyId: encryptedCreditCardData.keyId,
      encryptedData: encryptedCreditCardData.encryptedMessage
    }

    return await Moralis.Cloud.httpRequest({
      method: 'POST',
      url: 'https://api-sandbox.circle.com/v1/payments',
      headers: headers,
      body: paymentBody
    }).then(
      function (httpResponse) {
        console.log(httpResponse.text)
        let jsonObj = JSON.parse(httpResponse.text)
        return jsonObj['data']
      },
      function (httpResponse) {
        throw 'Request failed with response code ' + JSON.stringify(httpResponse)
      }
    )
  },
  {
    requireUser: true
  }
)

Moralis.Cloud.define(
  'circle_paymentStatus',
  async (request) => {
    console.log('circle_paymentStatus params: ', JSON.stringify(request.params))
    return await Moralis.Cloud.httpRequest({
      url: 'https://api-sandbox.circle.com/v1/payments/' + request.params.id,
      headers: headers
    }).then(
      function (httpResponse) {
        console.log('circle_paymentStatus httpResponse: ', JSON.stringify(httpResponse))
        let jsonObj = JSON.parse(httpResponse.text)
        return jsonObj
      },
      function (httpResponse) {
        throw 'Request failed with response code ' + JSON.stringify(httpResponse)
      }
    )
  },
  {
    requireUser: true
  }
)
