import React from 'react';
import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router-dom';

import BasePage from '../BasePage/BasePage';

const Portfolio = () => {
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated } = useMoralis();

  const history = useHistory();

  React.useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated, history]);

  return (
    <BasePage headerTitle="Portfolio">
      <div>Portfolio</div>
    </BasePage>
  );
};

export default Portfolio;
