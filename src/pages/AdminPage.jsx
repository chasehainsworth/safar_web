import React, { Component } from "react";

class AdminPage extends Component {
  state = {};
  render() {
    return (
      <div className='text-center'>
        <h1 className='subtitle'>Account</h1>
        <Row className='spaced'>
          <Link to={ROUTES.LIST_ACC}>
            <Button type='default' size='large'>
              List All Accounts
            </Button>
          </Link>
        </Row>
        <Row className='spaced'>
          <Button type='default' size='large'>
            List All Services
          </Button>
        </Row>
        <Row>
          <SignOutButton />
        </Row>
      </div>
    );
  }
}

export default AdminPage;
