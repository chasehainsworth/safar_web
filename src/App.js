import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Layout from "antd/lib/layout";
import { Switch, Route } from "react-router-dom";
import { withAuthentication } from "./components/Firebase";

import * as ROUTES from "./constants/routes";

import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import UpdateAccountPage from "./pages/UpdateAccountPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ResourcesPage from "./pages/ResourcesPage";
import Menu from "antd/lib/menu";

const { Content, Footer, Header } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className='layout'>
        <Header>
          <div className='logo'>S A F A R</div>
          <Menu theme='dark' mode='horizontal' style={{ height: "25px" }}>
            <Menu.Item key='1'>Account</Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path={ROUTES.UPDATE_ACC} component={UpdateAccountPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.LOGIN} component={LoginPage} />
            <Route path={ROUTES.RESOURCES} component={ResourcesPage} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "right" }}>
          Copyright &copy; 2019 Safar Team
        </Footer>
      </Layout>
    );
  }
}

export default withAuthentication(App);
