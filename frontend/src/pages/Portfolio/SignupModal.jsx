import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { useMoralis } from "react-moralis";

import localWallet from "../../domain/localWallet";

const SignupModal = ({ isModalOpen, setIsModalOpen }) => {
  const { signup, login } = useMoralis();
  // eslint-disable-next-line no-unused-vars
  const [userEmail, setUserEmail] = React.useState("web2user@gmail.com");
  // eslint-disable-next-line no-unused-vars
  const [userPassword, setUserPassword] = React.useState("nfts_are_cool_1234");

  const handleSignup = () => {
    const generatedAddress = localWallet.createWallet();
    signup(userEmail, userPassword, userEmail);
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
    <div className={classnames("modal", { "modal-open": isModalOpen })}>
      <div className="modal-box">
        <p>You need an account to be able to purchase and save NFTs</p>
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
            className="btn"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={loginOrSignup}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

SignupModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default SignupModal;
