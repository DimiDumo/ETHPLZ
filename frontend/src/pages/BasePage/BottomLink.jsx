import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const BottomLink = ({ label, path }) => {
  return (
    <div>
      <Link to={path}>{label}</Link>
    </div>
  );
};

BottomLink.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default BottomLink;
