import React, { Component } from "react";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import { withFirebase, AuthUserContext } from "../components/Firebase";
import { Link, withRouter } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";

const { Header } = Layout;

class TopMenu extends Component {
  handleClick = e => {
    if (e.key === "SignOut") {
      this.props.firebase.doSignOut();
    }
  };

  render() {
    const menuItemProps = {
      height: "100%",
      paddingTop: 10
    };

    return (
      <Header>
        <AuthUserContext.Consumer>
          {authUser => (
            <Menu
              theme='dark'
              mode='horizontal'
              selectedKeys={[this.props.location.pathname]}
              onClick={this.handleClick}
              style={{ height: "100%" }}
            >
              <Menu.Item
                key={ROUTES.HOME}
                style={{ backgroundColor: "inherit", ...menuItemProps }}
              >
                {/* Everyone */}

                <Link to={ROUTES.HOME} className='logo'>
                  S A F A R
                </Link>
              </Menu.Item>

              {/* Services providers */}

              {!!authUser && authUser.role === ROLES.PROVIDER && (
                <Menu.Item key={ROUTES.HOURS} style={menuItemProps}>
                  <Link to={ROUTES.HOURS}>Update Hours</Link>
                </Menu.Item>
              )}
              {!!authUser && authUser.role === ROLES.PROVIDER && (
                <Menu.Item key={ROUTES.UPDATE_ACC} style={menuItemProps}>
                  <Link to={ROUTES.UPDATE_ACC}>Update Account Info</Link>
                </Menu.Item>
              )}
              {!!authUser && authUser.role === ROLES.PROVIDER && (
                <Menu.Item key={ROUTES.SERVICES} style={menuItemProps}>
                  <Link to={ROUTES.SERVICES}>Update Services</Link>
                </Menu.Item>
              )}

              {/* Administrators */}

              {!!authUser && authUser.role === ROLES.ADMIN && (
                <Menu.Item key={ROUTES.ADMIN} style={menuItemProps}>
                  <Link to={ROUTES.ADMIN}>Admin Page</Link>
                </Menu.Item>
              )}

              {/* All not Logged In */}

              {!authUser && (
                <Menu.Item key={ROUTES.LOGIN} style={menuItemProps}>
                  <Link to={ROUTES.LOGIN}>Login</Link>
                </Menu.Item>
              )}

              {/* All Logged In */}

              {!!authUser && (
                <Menu.Item key='SignOut' style={menuItemProps}>
                  Sign Out
                </Menu.Item>
              )}
            </Menu>
          )}
        </AuthUserContext.Consumer>
      </Header>
    );
  }
}

export default withRouter(withFirebase(TopMenu));
