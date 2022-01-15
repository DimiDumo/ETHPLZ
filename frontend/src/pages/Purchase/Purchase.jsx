import React from 'react';
import { useParams } from 'react-router-dom';

import BasePage from '../BasePage/BasePage';

const Purchase = () => {
  const { nftId } = useParams();

  return (
    <BasePage headerTitle="Purchase NFT">
      <div>Purchasing NFT with id: {nftId}</div>
    </BasePage>
  );
};

export default Purchase;
