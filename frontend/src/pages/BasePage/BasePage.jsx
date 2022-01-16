import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BottomLink from './BottomLink';

const BasePage = (props) => {
  const { children, headerTitle, rightElem, pageName } = props;
  const [isLoggedIn] = useState(false);
  return (
    <div className="flex h-screen flex-col">
      <header className="BasePage-Header fixed">
        <div className="phone-notch" />
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            <p className="header-title">{headerTitle}</p>
          </div>
          <div className="col-span-1">{rightElem}</div>
        </div>
      </header>
      <div className="container content h-10 flex-grow">
        {children}
        <div className="spacer" />
      </div>
      <footer className="container fixed pt-4 bottom-0 mx-auto flex flex-row justify-around grid grid-cols-5">
        <div className="col-span-1">
          <BottomLink
            path="/profile"
            label="Profile"
            imgSrc={
              isLoggedIn ? '/profile_active.png' : '/profile_inactive.png'
            }
            isActive={pageName === 'profile'}
          />
        </div>
        <div className="col-span-1">
          <BottomLink
            path="/"
            imgSrc="/light_bulb.png"
            isActive={pageName === 'discover'}
          />
        </div>
        <div className="col-span-1">
          <BottomLink
            path="/portfolio"
            label="Portfolio"
            imgSrc="/book.png"
            isActive={pageName === 'portfolio'}
          />
        </div>
        <div className="col-span-1">
          <BottomLink
            path="/education"
            label="Knowledge Base"
            imgSrc="/education.png"
          />
        </div>
        <div className="col-span-1">
          <BottomLink
            path="/settings"
            label="Menu"
            imgSrc="/burger.png"
            isActive={pageName === 'settings'}
          />
        </div>
      </footer>
    </div>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
  headerTitle: PropTypes.string.isRequired,
  rightElem: PropTypes.element,
  pageName: PropTypes.string.isRequired,
};

BasePage.defaultProps = {
  rightElem: <span />,
};

export default BasePage;
