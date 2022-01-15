import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const BottomLink = ({ label, path, icon }) => {
  return (
    <Link to={path} className="flex flex-col items-center">
      {icon()}
      {label}
    </Link>
  );
};

BottomLink.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
};

export default BottomLink;
