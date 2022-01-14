import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Discovery from './pages/Discovery';
import Portfolio from './pages/Portfolio';

import './App.css';

export default function App() {
  return (
    <Router>
      <Switch>
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
