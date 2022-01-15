import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';

import Discovery from './pages/Discovery/Discovery';
import Portfolio from './pages/Portfolio/Portfolio';
import Profile from './pages/Profile';
import Settings from './pages/Settings/Settings';

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
          <Route path="/">
            <Discovery />
          </Route>
        </Switch>
      </Router>
    </MoralisProvider>
  );
}
