import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const DetailView = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <div className={classnames('modal', { 'modal-open': isModalOpen })}>
      <div className="modal-box">
        <p>
          Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut
          adipisci qui iusto illo eaque. Consequatur repudiandae et. Nulla ea
          quasi eligendi. Saepe velit autem minima.
        </p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

DetailView.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default DetailView;
