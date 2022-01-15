import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const DetailView = ({ isModalOpen }) => {
  return (
    <div className={classnames('modal', { 'modal-open': isModalOpen })}>
      <div className="modal-box">
        <p>
          Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut
          adipisci qui iusto illo eaque. Consequatur repudiandae et. Nulla ea
          quasi eligendi. Saepe velit autem minima.
        </p>
        <div className="modal-action">
          <label htmlFor="my-modal-2" className="btn btn-primary">
            Accept
          </label>
          <label htmlFor="my-modal-2" className="btn">
            Close
          </label>
        </div>
      </div>
    </div>
  );
};

DetailView.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
};

export default DetailView;
