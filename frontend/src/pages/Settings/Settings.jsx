import React from 'react';
import BasePage from '../BasePage/BasePage';

const Settings = () => {
  return (
    <BasePage headerTitle="Settings">
      <div className="grid gap-1 p-3 pt-4">
        <div className="settings-item">Profile</div>
        <div className="settings-item">Preference</div>
        <div className="settings-item">Payment Details</div>
        <div className="settings-item">History</div>
        <div className="settings-item">Contact Support</div>
      </div>
    </BasePage>
  );
};

export default Settings;
