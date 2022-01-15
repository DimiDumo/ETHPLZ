import React from 'react';
import PropTypes from 'prop-types';

import { LightBulbIcon, CogIcon, BookOpenIcon } from '@heroicons/react/solid';

import BottomLink from './BottomLink';

const BasePage = (props) => {
  const { children, headerTitle } = props;
  return (
    <div className="flex h-screen flex-col">
      <header className="BasePage-Header fixed">
        <div className="phone-notch"/>
          <p className="header-title">{headerTitle}</p>
      </header>
      <div className="container content h-10 flex-grow">{children}</div>
      <footer className="container fixed bottom-0 mx-auto flex flex-row justify-around">
        <BottomLink path="/" label="Discover" icon={LightBulbIcon} />
        <BottomLink
          path="/portfolio"
          label="Portfolio"
          icon={BookOpenIcon}
        />
        {/* <BottomLink path="/profile" label="Profile" icon={AdjustmentsIcon} /> */}
        <BottomLink path="/settings" label="Settings" icon={CogIcon} />
      </footer>
    </div>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
  headerTitle: PropTypes.string.isRequired
};

export default BasePage;
