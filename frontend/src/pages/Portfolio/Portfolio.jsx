import React from 'react';
import { useMoralis } from 'react-moralis';

import BasePage from '../BasePage/BasePage';
import SignupModal from './SignupModal';

const Portfolio = () => {
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, user } = useMoralis();

  console.log({ user });

  const [isSignupModalOpen, setIsSignupModalOpen] = React.useState(false);

  React.useEffect(() => {
    setIsSignupModalOpen(!isAuthenticated);
  }, [isAuthenticated]);

  return (
    <BasePage headerTitle="Portfolio">
      <div>Portfolio</div>
      <SignupModal
        isModalOpen={isSignupModalOpen}
        setIsModalOpen={setIsSignupModalOpen}
      />
    </BasePage>
  );
};

export default Portfolio;
