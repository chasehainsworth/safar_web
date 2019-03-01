import React, { Component } from "react";
import { Row, Button } from "antd";
import { Link } from "react-router-dom";

import { withAuthorization, AuthUserContext } from "../components/Firebase";
import SignOutButton from "../components/Firebase/Session/SignOutButton";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";

class AccountPage extends Component {
  state = {};

  render() {
    return (
      <div className='text-center'>
        <h1 className='subtitle'>Account</h1>
        <Row className='spaced'>
          <Button type='default' size='large'>
            Update Hours
          </Button>
        </Row>
        <Row className='spaced'>
          <AuthUserContext.Consumer>
            {authUser =>
              authUser.role === ROLES.ADMIN ? (
                <Link to={ROUTES.LIST_ACC}>
                  <Button type='default' size='large'>
                    List All Accounts
                  </Button>
                </Link>
              ) : (
                <Link to={ROUTES.UPDATE_ACC}>
                  <Button type='default' size='large'>
                    Update All Account Information
                  </Button>
                </Link>
              )
            }
          </AuthUserContext.Consumer>
        </Row>
        <Row className='spaced'>
          <AuthUserContext.Consumer>
            {authUser => {
              return (
              <Link to={ROUTES.SERVICES}>
                <Button type='default' size='large'>
                  Update Services
                </Button>
              </Link>
            )}}
          </AuthUserContext.Consumer>
        </Row>
        <Row>
          <SignOutButton />
        </Row>
      </div>
    );
  }
}

// If not logged in, redirects to login page
const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
