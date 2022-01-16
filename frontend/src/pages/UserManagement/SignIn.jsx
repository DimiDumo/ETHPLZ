import React from "react";

import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useHistory, useParams } from "react-router-dom";

import localWallet from "../../domain/localWallet";

import WithApple from "./Buttons/Apple.png";
import WithGoogle from "./Buttons/Google.png";

const SignIn = () => {
  const { signup, login, isAuthenticated } = useMoralis();
  const { nftId } = useParams();
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [userEmail, setUserEmail] = React.useState("web2user@gmail.com");
  // eslint-disable-next-line no-unused-vars
  const [userPassword, setUserPassword] = React.useState("nfts_are_cool_1234");
  // eslint-disable-next-line no-unused-vars
  const [primaryKey, setPrimaryKey] = React.useState(null);

  const createNewUserWalletCloudFunction = useMoralisCloudFunction(
    "createNewUserWallet",
    { primaryKey },
    { autoFetch: false }
  );

  const handleSignup = async () => {
    const generatedAddress = localWallet.createWallet();
    setPrimaryKey(generatedAddress);
    await signup(userEmail, userPassword, userEmail, {
      localWalletAddress: generatedAddress,
    });
  };

  const handleLogin = () => {
    login(userEmail, userPassword);
  };

  const loginOrSignup = async () => {
    const localAddress = localWallet.getAddress();
    if (!localAddress) {
      await handleSignup();
      return;
    }

    handleLogin();
  };

  React.useEffect(() => {
    if (primaryKey) {
      if (!isAuthenticated) return;
      createNewUserWalletCloudFunction.fetch();
    }

    if (primaryKey && !createNewUserWalletCloudFunction.data) {
      return;
    }

    if (!isAuthenticated) return;

    if (nftId) {
      history.push(`/purchase/${nftId}`);
      return;
    }

    history.push(`/`);
  }, [
    isAuthenticated,
    nftId,
    primaryKey,
    createNewUserWalletCloudFunction.data,
  ]);

  return (
    <>
      <div className="p-4 login-page h-screen">
        <div className="login-spacer" />
        <h1>PLZ Wallet</h1>
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text">Email/Username</span>
          </label>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="email"
                className="input input-bordered w-full"
                value={userEmail}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <input
                type="password"
                placeholder="password"
                className="input input-bordered w-full"
                value={userPassword}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-3 mt-7">
            <div className="col-span-2">
              <button
                type="button"
                className="btn-submit"
                onClick={loginOrSignup}
              >
                Submit
              </button>
            </div>
            <div className="col-span-1">
              <button
                type="button"
                className="btn-login-cancel"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 font-bold">Forgot username/password</p>
        <p className="mt-3 font-bold">Or sign in here:</p>
        <div className="flex flex-row justify-between mt-2">
          <img src={WithApple} alt="" />
          <img src={WithGoogle} alt="" />
        </div>
        <div className="white-line mt-4" />
        <button
          type="button"
          className="btn-submit mt-4"
          onClick={loginOrSignup}
        >
          Sign up!
        </button>
      </div>
    </>
  );
};

SignIn.propTypes = {};

export default SignIn;
