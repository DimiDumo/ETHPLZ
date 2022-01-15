import React from 'react';
import PropTypes from 'prop-types';

import BottomLink from './BottomLink';

const BasePage = ({ children }) => {
  return (
    <div className="BasePage-Layout">
      {/* <div className="BasePage-Header">Header</div> */}
      <div className="BasePage-Content">{children}</div>
      <div className="flex flex-row">
        <BottomLink path="/" label="Discover" />
        <BottomLink path="/portfolio" label="Portfolio" />
        <BottomLink path="/profile" label="Profile" />
        <BottomLink path="/settings" label="Settings" />
      </div>
    </div>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasePage;
