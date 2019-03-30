import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Layout from "antd/lib/layout";
import message from "antd/lib/message";
import { Switch, Route } from "react-router-dom";
import { withAuthentication } from "./components/Firebase";

import * as ROUTES from "./constants/routes";
import strings from "./constants/localization";

import HomePage from "./pages/HomePage";
import UpdateAccountPage from "./pages/UpdateAccountPage";
import AddAccountPage from "./pages/AddAccountPage";
import LoginPage from "./pages/LoginPage";
import ServicesPage from "./pages/ServicesPage";
import TopMenu from "./components/TopMenu";
import AdminPage from "./pages/AdminPage";

const { Content, Footer } = Layout;

class App extends Component {
  setLanguage = (language) => {
    strings.setLanguage(language);
    this.setState({});
    message.config({top: 50});
    message.info(strings.LANGUAGE_SET);
  }
  render() {
    return (
      <Layout className='layout'>
        <TopMenu setLanguage={this.setLanguage} />
        <Content>
          <Switch>
            <Route exact path='/' component={HomePage} />

            <Route path={ROUTES.UPDATE_ACC} component={UpdateAccountPage} />
            <Route path={ROUTES.ADD_ACC} component={AddAccountPage} />
            <Route path={ROUTES.LOGIN} component={LoginPage} />
            <Route path={ROUTES.SERVICES} component={ServicesPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "right" }}>
          {strings.COPYRIGHT} &copy; 2019 Safar Team
        </Footer>
      </Layout>
    );
  }
}

export default withAuthentication(App);
