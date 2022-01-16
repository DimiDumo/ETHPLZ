import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Link } from 'react-router-dom';

const BottomLink = ({ path, imgSrc, isActive }) => {
  return (
    <Link to={path} className="flex flex-col items-center">
      <img className="nav-icon" src={imgSrc} alt="" />
      <div
        className={classnames('active-page-line', {
          'page-inactive': !isActive,
        })}
      />
    </Link>
  );
};

BottomLink.propTypes = {
  path: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

BottomLink.defaultProps = {
  isActive: false,
};

export default BottomLink;
