import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const DetailView = ({ isModalOpen, setIsModalOpen, nft }) => {
  const infoBoxRef = useRef(null);
  const scrollBox = useRef(null);

  const priceBreakdown = [
    { text: 'NFT Price', value: '14.79' },
    { text: 'Gas Fees', value: '13.50' },
    { text: 'Platform Charges', value: '2.00' },
    { text: 'Total', value: '30.29', bold: true },
  ].map((item) => (
    <>
      <div className={classnames('col-span-2', { 'price-bold': item.bold })}>{item.text}</div>
      <div className={classnames('col-span-1', { 'price-bold': item.bold })}>
        <span className="float-right">€{item.value}</span>
      </div>
    </>
  ));

  useEffect(() => {
    if (isModalOpen) {
      scrollBox.current.scrollTo({ top: 0 });
      document.querySelector('body').classList.add('noscroll');
    } else {
      document.querySelector('body').classList.remove('noscroll');
      scrollBox.current.scrollTo({ top: 0 });
    }
  }, [isModalOpen]);

  return (
    <div className={classnames('my-modal', { 'my-modal-open': isModalOpen })}>
      <div className="my-modal-inner" ref={scrollBox}>
        <div className="py-7 px-9">
          <img className="nft-full-img" src={nft.imgSrc} alt="" />
          <div className="mt-3 mb-6" ref={infoBoxRef}>
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <h1>{nft.title}</h1>
                <p>{nft.author}</p>
              </div>
              <div className="col-span-1">Voting coming soon</div>
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
                  onClick={() => setIsModalOpen(false)}
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
  nft: PropTypes.object.isRequired,
};

export default DetailView;
