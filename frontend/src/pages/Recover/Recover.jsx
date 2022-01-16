import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import BasePage from '../BasePage/BasePage';

const Recover = () => {
  const [recoverStarted, setRecoverStarted] = useState(false);

  let startRecover;
  const history = useHistory();

  if (recoverStarted) {
    startRecover = (
      <div className="confirm-text mt-2">
        <p>
          Are you sure you want to send out a request to your key
          guardians?&nbsp;
          <span>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => history.push(`/recover-guardians`)}
            >
              Yes, confirm
            </button>
          </span>
        </p>
      </div>
    );
  } else {
    startRecover = (
      <button
        type="button"
        className="start-button mt-2"
        onClick={() => setRecoverStarted(true)}
      >
        Start
      </button>
    );
  }

  return (
    <BasePage pageName="recover" headerTitle="Recover" arrowBack>
      <div className="pt-3 pl-5 pr-5 recover-page">
        <h1>Choose your recovery method:</h1>
        <p className="info-grey mt-2">
          Use your pre-defined social guardians to verify your account:
        </p>
        {startRecover}
        <div className="grey-line mt-5" />
        <p className="info-grey mt-2">Use PLZ Wallet to verify your account.</p>
        <button type="button" className="start-button mt-3">
          2FA
        </button>
        <br />
        <button type="button" className="start-button mt-3">
          Eamil ID
        </button>
      </div>
    </BasePage>
  );
};

export default Recover;
