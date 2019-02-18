import React, { Component } from "react";
import { Row, Button } from "antd";
import { Link } from "react-router-dom";

import { withAuthorization } from "../components/Firebase";
import SignOutButton from "../components/Firebase/Session/SignOutButton";

class AccountPage extends Component {
  state = {
    name: this.props.name
  };

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
          <Link to='/UpdateAccount'>
            <Button type='default' size='large'>
              Update All Account Information
            </Button>
          </Link>
        </Row>
        <Row className='spaced'>
          <Button type='default' size='large'>
            Update Services
          </Button>
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
