import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Skeleton } from 'antd';

import BasePage from './BasePage/BasePage';

import './Discovery.scss';

const Discovery = () => {
  const content = [{}, {}, {}, {}, {}, {}].map((item) => ({
    id: uuidv4(),
    ...item,
  }));

  const handleClick = (id) => {
    console.log(`clicked ${id}`);
  };
  return (
    <BasePage>
      <div className="Discovery-Title">
        <h1>Discover</h1>
      </div>
      <div className="Discovery-Content">
        {content.map((item) => (
          <div key={item.id} role="button" onClick={() => handleClick(item.id)}>
            <Skeleton.Image />
          </div>
        ))}
      </div>
    </BasePage>
  );
};

export default Discovery;
