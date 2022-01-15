/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Holder from 'holderjs';

import BasePage from '../BasePage/BasePage';
import DetailView from './DetailView';

const Discovery = () => {
  const content = new Array(18).fill({}).map((item, index) => ({
    id: uuidv4(),
    imgSrc: `/discover-images/${index + 1}.png`,
    title: 'The Corridor',
    author: 'NathFT',
    description:
      'As I walk through the corridor, where I reconsider my brain, I take a look at the lights, and realise there is a lot of gain...',
    ...item,
  }));

  const [isDetailedViewOpen, setIsDetailedViewOpen] = React.useState(false);
  const [activeNFT, setActiveNFT] = React.useState({});

  React.useEffect(() => {
    Holder.run();
  });

  const handleClick = (nft) => {
    setIsDetailedViewOpen(true);
    setActiveNFT(nft);
  };

  const options = (
    <>
      <div className="grid grid-cols-3 bottom-0 pt-5">
        <div className="col-span-1" />
        <div className="col-span-1">
          <img src="/filter.png" alt="" />
        </div>
        <div className="col-span-1">
          <img src="/search.png" alt="" />
        </div>
      </div>
    </>
  );

  return (
    <BasePage headerTitle="Discover" rightElem={options} pageName="discover">
      <div className="grid grid-cols-3 gap-1 pt-1 bg-base-100">
        {content.map((item) => (
          <div
            key={item.id}
            role="button"
            onClick={() => handleClick(item)}
            className="img-preview"
          >
            <img src={item.imgSrc} alt="" />
          </div>
        ))}
      </div>
      <DetailView
        isModalOpen={isDetailedViewOpen}
        setIsModalOpen={setIsDetailedViewOpen}
        nft={activeNFT}
      />
    </BasePage>
  );
};

export default Discovery;
