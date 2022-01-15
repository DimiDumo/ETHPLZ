/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Holder from 'holderjs';

import BasePage from './BasePage/BasePage';

import './Discovery.scss';

const Discovery = () => {
  const content = [{}, {}, {}, {}, {}, {}, {}].map((item) => ({
    id: uuidv4(),
    ...item,
  }));

  React.useEffect(() => {
    Holder.run();
  }, []);

  const handleClick = (id) => {
    console.log(`clicked ${id}`);
  };
  return (
    <BasePage>
      <div className="Discovery-Title">
        <h1>Discover</h1>
      </div>
      <div className="grid grid-cols-3 gap-4 p-2 pt-4 bg-base-100">
        {content.map((item) => (
          <span
            key={item.id}
            role="button"
            onClick={() => handleClick(item.id)}
          >
            <img src="holder.js/300x200" alt="" />
          </span>
        ))}
      </div>
    </BasePage>
  );
};

export default Discovery;
