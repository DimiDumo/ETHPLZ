import React from 'react';
import PropTypes from 'prop-types';

import { Layout } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

const BasePage = ({ children }) => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>{children}</Content>
      <Footer>
        <Link to="/">Discover</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/settings">Settings</Link>
      </Footer>
    </Layout>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasePage;
