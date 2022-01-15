import React from 'react';

import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router-dom';

import localWallet from '../../domain/localWallet';

import BasePage from '../BasePage/BasePage';
import WithApple from './Buttons/Apple.png';
import WithGoogle from './Buttons/Google.png';

const SignIn = () => {
  const { signup, login } = useMoralis();
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [userEmail, setUserEmail] = React.useState('web2user@gmail.com');
  // eslint-disable-next-line no-unused-vars
  const [userPassword, setUserPassword] = React.useState('nfts_are_cool_1234');

  const handleSignup = () => {
    const generatedAddress = localWallet.createWallet();
    signup(userEmail, userPassword, userEmail, {
      localWalletAddress: generatedAddress,
    });
  };

  const handleLogin = () => {
    login(userEmail, userPassword);
  };

  const loginOrSignup = () => {
    const localAddress = localWallet.getAddress();
    if (!localAddress) {
      handleSignup();
      return;
    }

    handleLogin();
  };

  return (
    <BasePage headerTitle="Sign In">
      <div className="p-4">
        <p>Existing Users</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="email"
            className="input input-bordered"
            value={userEmail}
            readOnly
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            value={userPassword}
            readOnly
          />
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-primary"
            onClick={loginOrSignup}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>

        <p>or sign in here</p>
        <div className="flex flex-row justify-between">
          <img src={WithApple} alt="" />
          <img src={WithGoogle} alt="" />
        </div>

        <p>Recover account</p>
      </div>
    </BasePage>
  );
};

SignIn.propTypes = {};

export default SignIn;
