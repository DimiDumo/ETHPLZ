/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { useParams, useHistory } from 'react-router-dom';

import BasePage from '../BasePage/BasePage';
import DetailView from './DetailView';

import jsonContent from './content.json';

const Discovery = () => {
  // const content = new Array(18).fill({}).map((item, index) => ({
  //   id: uuidv4(),
  //   imgSrc: `/discover-images/${index + 1}.png`,
  //   title: 'The Corridor',
  //   author: 'NathFT',
  //   description:
  //     'As I walk through the corridor, where I reconsider my brain, I take a look at the lights, and realise there is a lot of gain...',
  //   ...item,
  // }));
  // console.log(JSON.stringify(content));

  const content = jsonContent;

  const history = useHistory();
  const { nftId } = useParams();

  const [isDetailedViewOpen, setIsDetailedViewOpen] = React.useState(false);
  const [activeNFT, setActiveNFT] = React.useState({});

  const handleClick = (nft) => {
    setIsDetailedViewOpen(true);
    setActiveNFT(nft);
    history.push(`/${nft.id}`);
  };

  React.useEffect(() => {
    if (nftId) {
      setIsDetailedViewOpen(true);
      const nft = content.find((item) => item.id === nftId);
      setActiveNFT(nft);
    }
  }, [nftId]);
  return (
    <BasePage headerTitle="Discover">
      <div className="grid grid-cols-3 gap-1 pt-4 bg-base-100">
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
