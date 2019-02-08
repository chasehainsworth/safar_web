import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Layout from "antd/lib/layout";
import HomePage from "./pages/HomePage";
import UpdateAccountPage from "./pages/UpdateAccountPage"
import AccountPage from "./pages/AccountPage"
import ResourcesPage from "./pages/ResourcesPage"
import Menu from "antd/lib/menu"
const { Content, Footer, Header } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className='layout'>
        <Header>
          <div className="logo">S A F A R</div>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ height: "25px"}}
            >
              <Menu.Item key="1">Account</Menu.Item> 
            </Menu>
        </Header>
        <Content>
          {/* <ResourcesPage /> */}
          <AccountPage />
          {/* <HomePage /> */}
          {/* <UpdateAccountPage /> */}
        </Content>
        <Footer style={{ textAlign: "right" }}>
          Copyright &copy; 2019 Safar Team
        </Footer>
      </Layout>
    );
  }
}

export default App;
