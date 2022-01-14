import React from "react";
import {Layout} from "antd";
import Discovery from './pages/Discovery'
import Portfolio from './pages/Portfolio'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import "./App.css";


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
