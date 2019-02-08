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

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className='layout'>
        <Content>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path={ROUTES.UPDATE_ACC} component={UpdateAccountPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.LOGIN} component={LoginPage} />
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
