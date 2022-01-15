import { createMessage, encrypt, readKey } from 'openpgp'
import fetch from 'node-fetch';

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

let response = await fetch('https://api-sandbox.circle.com/v1/encryption/public', { method: 'GET', headers: headers })
    .then(res => res.json())
    .catch(err => console.error('error:' + err));

const publicKey = response['data']['publicKey']
const publicKeyId = response['data']['keyId']

const cardDetails = { number: '4007400000000007', cvv: '123' };

const decodedPublicKey = await readKey({ armoredKey: atob(publicKey) })
const message = await createMessage({ text: JSON.stringify(cardDetails) })
const encryptedCreditCardData = await encrypt({
    message,
    encryptionKeys: decodedPublicKey,
}).then((ciphertext) => {
    return {
        encryptedMessage: btoa(ciphertext),
        keyId: publicKeyId,
    }
});

const addCardBody = {
    'idempotencyKey': '64008d21-0794-42a6-8c91-368a7d249d15',
    'expMonth': 1,
    'expYear': 2025,
    'keyId': encryptedCreditCardData.keyId,
    'encryptedData': encryptedCreditCardData,
    'billingDetails': {
        'line1': 'Test',
        'line2': '',
        'city': 'Test City',
        'district': 'MA',
        'postalCode': '11111',
        'country': 'US',
        'name': 'Customer 0001'
    },
    'metadata': {
        'phoneNumber': '+12025550180',
        'email': 'customer-0001@circle.com',
        'sessionId': 'xxx',
        'ipAddress': '172.33.222.1'
    }
};

console.log('addCardBody: ', addCardBody);

fetch('https://api-sandbox.circle.com/v1/cards', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(addCardBody)
})
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
