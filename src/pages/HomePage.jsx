import React, { Component } from "react";
import Button from "antd/lib/button";
import { Row, Col } from "antd";

class HomePage extends Component {
  state = {};
  render() {
    return (
      <div className='text-center'>
        <h1 className='title'>Safar</h1>
        <h2 style={{ "margin-bottom": 10 }}>Provider Portal</h2>
        <Row type='flex' justify='center' gutter={8}>
          <Col xs={24} md={2}>
            <Button type='primary' size='large'>
              Request Access
            </Button>
          </Col>
          <Col xs={24} md={2}>
            <Button type='primary' size='large'>
              Login
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
