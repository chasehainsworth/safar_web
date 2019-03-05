import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { AuthUserContext } from "../components/Firebase";
import SignOutButton from "../components/Firebase/Session/SignOutButton";

import strings from "../constants/localization";

class HomePage extends Component {
  state = {};
  render() {
    return (
      <div className='text-center'>
        <h1 className='title'>Safar</h1>
        <h2 style={{ marginBottom: 10 }}>{strings.PROVIDER_PORTAL}</h2>
        <Row type='flex' justify='center' gutter={8}>
          <Col xs={24} sm={6} md={4} lg={3} xl={2}>
            <AuthUserContext.Consumer>
              {authUser =>
                !authUser && (
                  <Button type='primary' size='large'>
                    {strings.REQUEST_ACCESS}
                  </Button>
                )
              }
            </AuthUserContext.Consumer>
          </Col>
          <Col xs={24} sm={4} md={4} lg={3} xl={4}>
            <AuthUserContext.Consumer>
              {authUser =>
                !authUser ? (
                  <Link to='/Login'>
                    <Button type='primary' size='large'>
                      {strings.LOGIN}
                    </Button>
                  </Link>
                ) : (
                  <SignOutButton />
                )
              }
            </AuthUserContext.Consumer>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
