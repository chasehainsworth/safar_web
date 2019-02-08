import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Layout from "antd/lib/layout";
import HomePage from "./pages/HomePage";
import UpdateAccountPage from "./pages/UpdateAccountPage"
const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className='layout'>
        <Content>
          {/* <HomePage /> */}
          <UpdateAccountPage />
        </Content>
        <Footer style={{ textAlign: "right" }}>
          Copyright &copy; 2019 Safar Team
        </Footer>
      </Layout>
    );
  }
}

export default App;
