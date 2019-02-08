import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Layout from "antd/lib/layout";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import UpdateAccountPage from "./pages/UpdateAccountPage";

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className='layout'>
        <Content>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/UpdateAccount' component={UpdateAccountPage} />
            <Route path='/Account' component={AccountPage} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "right" }}>
          Copyright &copy; 2019 Safar Team
        </Footer>
      </Layout>
    );
  }
}

export default App;
