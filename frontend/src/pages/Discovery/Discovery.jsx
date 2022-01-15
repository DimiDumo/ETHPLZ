/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Holder from 'holderjs';

import BasePage from '../BasePage/BasePage';
import DetailView from './DetailView';

const Discovery = () => {
  const content = new Array(18).fill({}).map((item) => ({
    id: uuidv4(),
    ...item,
  }));

  const [isDetailedViewOpen, setIsDetailedViewOpen] = React.useState(false);

  React.useEffect(() => {
    Holder.run();
  });

  const handleClick = (id) => {
    console.log(`clicked ${id}`);
    setIsDetailedViewOpen(true);
  };
  return (
    <BasePage headerTitle='Discover'>
      <div className="grid grid-cols-3 gap-1 p-2 pt-4 bg-base-100">
        {content.map((item) => (
          <span
            key={item.id}
            role="button"
            onClick={() => handleClick(item.id)}
          >
            <img src="holder.js/140x140" alt="" />
          </span>
        ))}
      </div>
      <DetailView
        isModalOpen={isDetailedViewOpen}
        setIsModalOpen={setIsDetailedViewOpen}
      />
    </BasePage>
  );
};

export default Discovery;
