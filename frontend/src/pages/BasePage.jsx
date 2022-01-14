import React from 'react';
import PropTypes from 'prop-types';

import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

const BasePage = ({ children }) => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasePage;
