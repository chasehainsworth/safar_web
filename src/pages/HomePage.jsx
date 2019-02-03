import React, { Component } from "react";
import { Row, Col, Button } from "antd";

class HomePage extends Component {
  state = {};
  render() {
    return (
      <div className='text-center'>
        <h1 className='title'>Safar</h1>
        <h2 style={{ "margin-bottom": 10 }}>Provider Portal</h2>
        <Row type='flex' justify='center' gutter={8}>
          <Col xs={24} sm={6} md={4} lg={3} xl={2}>
            <Button type='primary' size='large'>
              Request Access
            </Button>
          </Col>
          <Col xs={24} sm={4} md={4} lg={3} xl={4}>
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
