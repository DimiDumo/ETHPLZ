import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';

import Discovery from './pages/Discovery/Discovery';
import Portfolio from './pages/Portfolio/Portfolio';
import Profile from './pages/Profile';
import Settings from './pages/Settings/Settings';
import SignIn from './pages/UserManagement/SignIn';
import Purchase from './pages/Purchase/Purchase';
import Payment from './pages/Payment/Payment';
import Recover from './pages/Recover/Recover';
import RecoverGuardians from './pages/Recover/RecoverGuardians';

import './index.css';

const moralisServerUrl = 'https://hjokahdvmfah.usemoralis.com:2053/server';
const moralisAppId = 'iv7viFkSSsphlLGbduTjH3T181hwLNhaC9IBSUem';

export default function App() {
  return (
    <MoralisProvider appId={moralisAppId} serverUrl={moralisServerUrl}>
      <Router>
        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/portfolio">
            <Portfolio />
          </Route>
          <Route path="/recover">
            <Recover />
          </Route>
          <Route path="/recover-guardians">
            <RecoverGuardians />
          </Route>
          <Route path="/purchase/:nftId">
            <Purchase />
          </Route>
          <Route path="/set-up-payment">
            <Payment />
          </Route>
          <Route path="/login/:nftId?">
            <SignIn />
          </Route>
          <Route path="/:nftId?">
            <Discovery />
          </Route>
        </Switch>
      </Router>
    </MoralisProvider>
  );
}
