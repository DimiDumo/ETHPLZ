import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Discovery from './pages/Discovery/Discovery';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import './index.css';

export default function App() {
  return (
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
  );
}
