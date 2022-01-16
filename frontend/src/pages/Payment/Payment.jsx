import React from "react";

import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useHistory } from "react-router-dom";
import * as openpgp from "openpgp";

import BasePage from "../BasePage/BasePage";

import localStorage from "../../domain/localStorage";

const CreditCardState = {
  NONE: "NONE",
  CLICKED: "CLICKED",
  GOT_PUBLIC_KEY: "GOT_PUBLIC_KEY",
  ENC_CARD: "ENC_CARD",
  ADDED_CARD: "ADDED_CARD",
};

const Payment = () => {
  const { isAuthenticated } = useMoralis();
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [nameOnCard, setNameOnCard] = React.useState("Customer 0001");
  // eslint-disable-next-line no-unused-vars
  const [cardNumber, setCardNumber] = React.useState("4007400000000007");
  // eslint-disable-next-line no-unused-vars
  const [expDate, setExpDate] = React.useState("01-2023");
  // eslint-disable-next-line no-unused-vars
  const [cardCvv, setCardCvv] = React.useState("123");
  // eslint-disable-next-line no-unused-vars
  const [fastTx, setFastTx] = React.useState(true);
  // eslint-disable-next-line no-unused-vars
  const [encryptedCreditCardData, setEncryptedCreditCardData] =
    React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [creditCardState, setCreditCardState] = React.useState(
    CreditCardState.NONE
  );
  // eslint-disable-next-line no-unused-vars
  const [publicKeyData, setPublicKeyData] = React.useState(null);

  const cardDetails = {
    number: "4007400000000007",
    cvv: "123",
    expMonth: 1,
    expYear: 2025,
  };
  const billingDetails = {
    line1: "Test",
    line2: "",
    city: "Test City",
    district: "MA",
    postalCode: "11111",
    country: "US",
    name: "Customer 0001",
  };
  const metadata = {
    phoneNumber: "+12025550180",
    email: "customer-0001@circle.com",
    sessionId: "xxx",
    ipAddress: "172.33.222.1",
  };

  const encryptCardDetails = async function (
    publicKey,
    keyId,
    { number, cvv }
  ) {
    const decodedPublicKey = await openpgp.readKey({
      armoredKey: atob(publicKey),
    });
    const message = await openpgp.createMessage({
      text: JSON.stringify({ number, cvv }),
    });
    const ed = await openpgp
      .encrypt({
        message,
        encryptionKeys: decodedPublicKey,
      })
      .then((ciphertext) => {
        return {
          encryptedMessage: btoa(ciphertext),
          keyId,
        };
      });

    return ed;
  };

  const awaitCf = async function (cf) {
    if (cf.fetch) await cf.fetch();
    let count = 0;
    while (!cf.data) {
      console.log(cf);
      await (async () => new Promise((resolve) => setTimeout(resolve, 1000)))();
      count += 1;
      if (count >= 5) break;
    }
    return cf.data;
  };

  const publicKeyCloudFunction = useMoralisCloudFunction(
    "circle_publicKey",
    {}
  );

  const addCardCloudFunction = useMoralisCloudFunction(
    "circle_addCard",
    {
      cardDetails,
      encryptedCreditCardData,
      billingDetails,
      metadata,
    },
    { autoFetch: false }
  );

  React.useEffect(() => {
    if (!isAuthenticated) return;
    history.push(`/set-up-payment`);
  }, [isAuthenticated, history]);

  React.useEffect(() => {
    if (
      addCardCloudFunction.data &&
      creditCardState === CreditCardState.ENC_CARD
    ) {
      setCreditCardState(CreditCardState.ADDED_CARD);
    }
  }, [addCardCloudFunction.data, creditCardState]);

  React.useEffect(async () => {
    switch (creditCardState) {
      case CreditCardState.NONE: {
        break;
      }
      case CreditCardState.CLICKED: {
        const { publicKey, keyId } = await awaitCf(publicKeyCloudFunction);
        setPublicKeyData({ publicKey, keyId });
        setCreditCardState(CreditCardState.GOT_PUBLIC_KEY);
        break;
      }
      case CreditCardState.GOT_PUBLIC_KEY: {
        const { publicKey, keyId } = publicKeyData;
        console.log("publicKey: ", publicKey);
        console.log("keyId: ", keyId);

        const ed = await encryptCardDetails(publicKey, keyId, cardDetails);
        setEncryptedCreditCardData(ed);

        console.log("encryptedCreditCardData: ", ed);

        setCreditCardState(CreditCardState.ENC_CARD);
        break;
      }
      case CreditCardState.ENC_CARD: {
        addCardCloudFunction.fetch();
        break;
      }
      case CreditCardState.ADDED_CARD: {
        console.log("add res: ", addCardCloudFunction.data);
        const source = {
          id: addCardCloudFunction.data.id,
          type: "card",
        };
        console.log("source: ", source);
        localStorage.write("paymentMethodInfo", {
          publicKeyData,
          source,
          encryptedCreditCardData,
        });

        alert("DONE! TODO: Go to the next page?");

        // TODO: Go to the next page?
        break;
      }
      default: {
        break;
      }
    }
  }, [creditCardState]);

  return (
    <BasePage headerTitle="Payment" arrowBack pageName="settings">
      <div className="p-4 payment-page h-screen">
        <div className="payment-spacer" />
        <h1>Confirm payment details:</h1>
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text">Name on card</span>
          </label>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Vitalik Buterin"
                className="input input-bordered w-max"
                value={nameOnCard}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text">Card number</span>
          </label>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="1234 5678 9101 1121"
                className="input input-bordered w-max"
                value={cardNumber}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-3 mt-7">
            <div className="col-span-2">
              <div className="form-control mb-5">
                <label className="label">
                  <span className="label-text">Expiration</span>
                </label>
                <div className="grid grid-cols-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="xx-20xx"
                      className="input input-bordered w-max exp-input"
                      value={expDate}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="form-control mb-5">
                <label className="label">
                  <span className="label-text">CVV</span>
                </label>
                <div className="grid grid-cols-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="123"
                      className="input input-bordered w-max cvv-input"
                      value={cardCvv}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1>Faster Transactions!</h1>
        <div className="form-control mb-5">
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={fastTx}
                  className="toggle"
                  defaultChecked
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
          <label className="label">
            <span className="fast-tx-label-text">
              Would you like to set this as your default payment method?
            </span>
          </label>
        </div>
        <div className="">
          <div className="grid grid-cols-3 mt-7">
            <div className="col-span-2">
              <button
                type="button"
                className="btn-payment-submit"
                onClick={() => setCreditCardState(CreditCardState.CLICKED)}
              >
                Add Card
              </button>
            </div>
            <div className="col-span-1">
              <button
                type="button"
                className="btn-payment-cancel"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default Payment;
