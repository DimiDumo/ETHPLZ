import React, { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import localStorage from '../../domain/localStorage';
// import getNftDetails from './getNftDetails';

const DetailView = ({ isModalOpen, setIsModalOpen, nft }) => {
  const infoBoxRef = useRef(null);
  const scrollBox = useRef(null);
  const [isVoted, setIsVoted] = useState(false);
  const { isAuthenticated } = useMoralis();
  const history = useHistory();

  const buyOrLogin = () => {
    if (isAuthenticated) {
      const paymentMethod = localStorage.read('paymentMethodInfo', null);
      console.log('paymentMethod: ', paymentMethod);
      if (!paymentMethod) {
        history.push(`/set-up-payment/${nft.id}`);
        return;
      }
      history.push(`/portfolio/${encodeURIComponent(nft.imgSrc)}`);
      return;
    }
    history.push(`/login/${nft.id}`);
  };

  const priceBreakdown = [
    { text: 'NFT Price', value: '14.79' },
    { text: 'Gas Fees', value: '13.50' },
    { text: 'Platform Charges', value: '2.00' },
    { text: 'Total', value: '30.29', bold: true },
  ].map((item) => (
    <>
      <div className={classnames('col-span-2', { 'price-bold': item.bold })}>
        {item.text}
      </div>
      <div className={classnames('col-span-1', { 'price-bold': item.bold })}>
        <span className="float-right">€{item.value}</span>
      </div>
    </>
  ));

  let votingButton;
  if (isVoted) {
    votingButton = (
      <button
        type="button"
        className="btn-voting-active"
        onClick={() => setIsVoted(false)}
      >
        <span>
          <img
            className="inline float-left ml-3 mt-1"
            src="/heart.png"
            alt="<3"
          />
          <div className="inline ml-2 btn-voting-text">
            <div className="btn-voting-text-inside">1035</div>
          </div>
        </span>
      </button>
    );
  } else {
    votingButton = (
      <button
        type="button"
        className="btn-voting-hollow float-right"
        onClick={() => setIsVoted(true)}
      >
        <img src="/heart.png" alt="<3" />
      </button>
    );
  }

  // const getNftDetailsLocal = async () => {
  //   console.log('finding for nft: ', nft);
  //   console.log('nftId: ', nftId)
  //   const idArray = nftId.split('-');
  //   if (!idArray.length) return;
  //   const [tokenId, contractAddress]  = idArray;
  //   await getNftDetails({ contractAddress, tokenId });
  // };

  useEffect(() => {
    if (isModalOpen) {
      scrollBox.current.scrollTo({ top: 0 });
      document.querySelector('body').classList.add('noscroll');
      // getNftDetailsLocal();
    } else {
      document.querySelector('body').classList.remove('noscroll');
      scrollBox.current.scrollTo({ top: 0 });
    }
  }, [isModalOpen, nft]);

  return (
    <div className={classnames('my-modal', { 'my-modal-open': isModalOpen })}>
      <div className="my-modal-inner" ref={scrollBox}>
        <div className="py-7 px-9">
          <img className="nft-full-img" src={nft.imgSrc} alt="" />
          <div className="mt-4 mb-6" ref={infoBoxRef}>
            <div className="grid grid-cols-5">
              <div className="col-span-3">
                <h1>{nft.title}</h1>
                <p>{nft.author}</p>
              </div>
              <div className="col-span-2">{votingButton}</div>
            </div>
            <h1 className="mt-5">Description</h1>
            <p className="description">{nft.description}</p>
          </div>
          <div>
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <h1>Price Breakdown</h1>
              </div>
              <div className="col-span-1">
                <select className="currency-select">
                  <option value="1">€</option>
                  <option value="2">$</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 pricing-table">
              {priceBreakdown}
            </div>
            <div className="grid grid-cols-4">
              <div className="col-span-3 pr-3">
                <button
                  type="button"
                  className="btn-buy"
                  onClick={() => buyOrLogin()}
                >
                  Buy NFT
                </button>
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  className="btn-hollow"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DetailView.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  nft: PropTypes.object,
};

DetailView.defaultProps = {
  nft: {},
};

export default DetailView;
