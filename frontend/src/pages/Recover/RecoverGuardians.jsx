import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import BasePage from '../BasePage/BasePage';

const guardiansPending = [
  { name: 'PLZ Wallet', status: 'Approved' },
  { name: 'Friend Katherine', status: 'Pending' },
  { name: 'Family James', status: 'Pending' },
  { name: 'Family Benjamin', status: 'Pending' },
];

const guardiansApproved = [
  { name: 'PLZ Wallet', status: 'Approved' },
  { name: 'Friend Katherine', status: 'Approved' },
  { name: 'Family James', status: 'Approved' },
  { name: 'Family Benjamin', status: 'Pending' },
];

const Recover = () => {
  const [guardians, setGuardians] = useState(guardiansPending);

  useEffect(() => {
    setTimeout(() => {
      setGuardians(guardiansApproved);
    }, 2000);
  }, []);

  let recoverStatus;

  if (
    guardians.filter((guardian) => guardian.status === 'Approved').length >= 3
  ) {
    recoverStatus = (
      <p className="guardian-status-approved">
        You have successfully recovered your account!
      </p>
    );
  } else {
    recoverStatus = (
      <p className="guardian-danger">
        3 of 4 of your pre-defined social guardians will need to approve this to
        verify authentication
      </p>
    );
  }

  return (
    <BasePage pageName="recover-guardians" headerTitle="Recover" arrowBack>
      <div className="pt-3 pl-5 pr-5 recover-page">
        <h1 className="mb-5">
          Use your pre-defined social guardians to verify your account:
        </h1>
        {guardians.map((guardian, index) => (
          <div className="mb-3" key={guardian.name}>
            <p className="guardian-name">
              Key {index}: {guardian.name}
            </p>
            <p
              className={classnames({
                'guardian-status-pending': guardian.status === 'Pending',
                'guardian-status-approved': guardian.status === 'Approved',
              })}
            >
              {guardian.status}
            </p>
          </div>
        ))}
        {recoverStatus}
      </div>
    </BasePage>
  );
};

export default Recover;
