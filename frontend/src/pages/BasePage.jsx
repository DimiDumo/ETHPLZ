import React from 'react';
import PropTypes from 'prop-types';
import Layout from 'antd/lib/layout/layout';

const { Header, Content } = Layout;

const BasePage = ({ children }) => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>{children}</Content>
    </Layout>
  );
};

BasePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasePage;
