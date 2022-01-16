import { createMessage, encrypt, readKey } from 'openpgp'
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// enable atob and btoa in nodejs
global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return Buffer.from(str, 'binary').toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = function (b64Encoded) {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    };
}

const api_key = 'QVBJX0tFWToxZDBiY2NkNzk2Y2E4ZDQ5MWEwYTRjMTJhYTgzYjBhOTowYjU1MGU5MjA0ZDM3ZGQ1MDYwMzAxYmZmNmNkMjhlYQ'
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + api_key
};

async function getPublicKey() {
    let response = await fetch('https://api-sandbox.circle.com/v1/encryption/public', { method: 'GET', headers: headers })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));

    return { publicKey: response['publicKey'], keyId: response['keyId'] }
}

async function encryptCardDetails(publicKey, keyId, { number, cvv }) {
    const decodedPublicKey = await readKey({ armoredKey: atob(publicKey) })
    const message = await createMessage({ text: JSON.stringify({ number, cvv }) })
    const encryptedCreditCardData = await encrypt({
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

async function addCard(cardDetails, encryptedCreditCardData, billingDetails, metadata) {
    const addCardBody = {
        'idempotencyKey': uuidv4(),
        'expMonth': cardDetails.expMonth,
        'expYear': cardDetails.expYear,
        'keyId': encryptedCreditCardData.keyId,
        'encryptedData': encryptedCreditCardData.encryptedMessage,
        'billingDetails': billingDetails,
        'metadata': metadata
    };

    return await fetch('https://api-sandbox.circle.com/v1/cards', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(addCardBody)
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function pay(amount, metadata, encryptedCreditCardData) {
    const paymentBody = {
        'idempotencyKey': uuidv4(),
        'amount': {
            'amount': amount,
            'currency': 'USD'
        },
        'verification': 'cvv',
        'source': source,
        'description': '',
        'channel': '',
        'metadata': metadata,
        'keyId': encryptedCreditCardData.keyId,
        'encryptedData': encryptedCreditCardData.encryptedMessage,
    };

    return await fetch('https://api-sandbox.circle.com/v1/payments', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentBody)
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function getPaymentStatus(id) {
    return await fetch('https://api-sandbox.circle.com/v1/payments/' + id, {
        method: 'GET',
        headers: headers
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function getMasterWalletBalance() {
    return await fetch('https://api-sandbox.circle.com/v1/balances', {
        method: 'GET',
        headers: headers
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function createWallet() {
    const paymentBody = {
        'idempotencyKey': uuidv4()
    };

    return await fetch('https://api-sandbox.circle.com/v1/wallets', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentBody)
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function createDepositAddress(walletId) {
    const paymentBody = {
        'idempotencyKey': uuidv4(),
        'currency': 'USD',
        'chain': 'ETH'
    };

    return await fetch('https://api-sandbox.circle.com/v1/wallets/' + walletId + '/addresses', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentBody)
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function getConfiguration() {
    return await fetch('https://api-sandbox.circle.com/v1/configuration', {
        method: 'GET',
        headers: headers
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

async function getSettlements() {
    return await fetch('https://api-sandbox.circle.com/v1/settlements', {
        method: 'GET',
        headers: headers
    })
        .then(res => res.json())
        .then(json => json["data"])
        .catch(err => console.error('error:' + err));
}

// ================usage======================

const { publicKey, keyId } = await getPublicKey()

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

const addCardResult = await addCard(cardDetails, encryptedCreditCardData, billingDetails, metadata);
console.log('addCardResult: ', addCardResult);

const source = {
    'id': addCardResult['id'],
    'type': 'card'
};

const payResult = await pay('420.69', metadata, encryptedCreditCardData);
console.log('payResult: ', payResult);

while (true) {
    let paymentStatus = await getPaymentStatus(payResult['id']);
    console.log('new status: ', paymentStatus);
    // status will at first be "confirmed" and then eventually "confirmed"
    if (paymentStatus['status'] !== 'pending') {
        break;
    }
}

const masterWalletBalance = await getMasterWalletBalance();
console.log('masterWalletBalance: ', JSON.stringify(masterWalletBalance));

const configuration = await getConfiguration();
console.log('configuration: ', configuration);

const createWalletResult = await createWallet();
console.log('createWalletResult: ', createWalletResult);

const createDepositAddressResult = await createDepositAddress(createWalletResult['walletId']);
console.log('createDepositAddressResult: ', createDepositAddressResult);

const settlementsResult = await getSettlements();
console.log('settlementsResult: ', settlementsResult);
