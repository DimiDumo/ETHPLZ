import React from 'react';
import PropTypes from 'prop-types';

import { AdjustmentsIcon } from '@heroicons/react/solid';

import BottomLink from './BottomLink';

const BasePage = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      {/* <div className="BasePage-Header">Header</div> */}
      <div className="container mx-auto flex-grow">{children}</div>
      <div className="container mx-auto h-16 flex flex-row justify-around">
        <BottomLink path="/" label="Discover" icon={AdjustmentsIcon} />
        <BottomLink
          path="/portfolio"
          label="Portfolio"
          icon={AdjustmentsIcon}
        />
        <BottomLink path="/profile" label="Profile" icon={AdjustmentsIcon} />
        <BottomLink path="/settings" label="Settings" icon={AdjustmentsIcon} />
      </div>
    </div>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasePage;
