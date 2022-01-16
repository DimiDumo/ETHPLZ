import React from 'react';
// import { useMoralis } from 'react-moralis';
// import { useHistory } from 'react-router-dom';

import BasePage from '../BasePage/BasePage';

const Portfolio = () => {
  // eslint-disable-next-line no-unused-vars
  // const { isAuthenticated } = useMoralis();

  // const imgSrc = window.location.href.split('/').pop().replace(/>/g, '/');
  const imgSrc = decodeURIComponent(window.location.href.split('/').pop())
  console.log('imgSrc: ', imgSrc);

  // React.useEffect(() => {
  //   if (!isAuthenticated) {
  //     history.push('/login');
  //   }
  // }, [isAuthenticated, history]);

  return (
    <BasePage headerTitle="Portfolio" pageName="portfolio">
      <div className="img-preview">
        <img src={imgSrc} alt="" />
      </div>
    </BasePage>
  );
};

export default Portfolio;
