import React from "react";
import Layout from "antd/lib/layout/layout";
const {Header, Content} = Layout

export default function Discovery(props) {
    const {children} = props

    return <Layout>
      <Header>Header</Header>
      <Content>{children}</Content>
    </Layout>
}