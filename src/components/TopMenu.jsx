import React, { Component } from "react";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import Icon from "antd/lib/icon";
import { withFirebase, AuthUserContext } from "../components/Firebase";
import { Link, withRouter } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";
import strings from "../constants/localization";

const { Header } = Layout;

class TopMenu extends Component {
  handleClick = e => {
    switch (e.key) {
      case "SignOut":
      this.props.firebase.doSignOut();
      break;

      // case "English":
      // {
      //   strings.setLanguage('en');
      //   this.setState({});
      // }
      // break;

      // case "French":
      // {
      //   strings.setLanguage('fr');
      //   this.setState({});
      // }
      // break;

      // case "Farsi":
      // {
      //   strings.setLanguage('fa');
      //   this.setState({});
      // }
      // break;

      // case "Arabic":
      // {
      //   strings.setLanguage('ar');
      //   this.setState({});
      // }
      // break;

      default:
      break;
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
                  <Link to={ROUTES.HOURS}>{strings.UPDATE_HOURS}</Link>
                </Menu.Item>
              )}
              {!!authUser && authUser.role === ROLES.PROVIDER && (
                <Menu.Item key={ROUTES.UPDATE_ACC} style={menuItemProps}>
                  <Link to={ROUTES.UPDATE_ACC}>
                    {strings.UPDATE_ACCOUNT_INFO}
                  </Link>
                </Menu.Item>
              )}
              {!!authUser && authUser.role === ROLES.PROVIDER && (
                <Menu.Item key={ROUTES.SERVICES} style={menuItemProps}>
                  <Link to={ROUTES.SERVICES}>{strings.UPDATE_SERVICES}</Link>
                </Menu.Item>
              )}

              {/* Administrators */}

              {!!authUser && authUser.role === ROLES.ADMIN && (
                <Menu.Item key={ROUTES.ADMIN} style={menuItemProps}>
                  <Link to={ROUTES.ADMIN}>{strings.ADMIN_PAGE}</Link>
                </Menu.Item>
              )}

              {/* All not Logged In */}

              {!authUser && (
                <Menu.Item key={ROUTES.LOGIN} style={menuItemProps}>
                  <Link to={ROUTES.LOGIN}>{strings.LOGIN}</Link>
                </Menu.Item>
              )}

              {/* All Logged In */}

              {!!authUser && (
                <Menu.Item key='SignOut' style={menuItemProps}>
                  {strings.SIGN_OUT}
                </Menu.Item>
              )}
              
              {/* Language Selection (All Users) */}
              <Menu.SubMenu title={<span className="submenu-title-wrapper"><Icon type="global" />English</span>} style={{...menuItemProps, float: "right"} }>
                <Menu.Item key="English">English</Menu.Item>
                <Menu.Item key="French">French</Menu.Item>
                <Menu.Item key="Farsi">Farsi</Menu.Item>
                <Menu.Item key="Arabic">Arabic</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          )}
        </AuthUserContext.Consumer>
      </Header>
    );
  }
}

export default withRouter(withFirebase(TopMenu));
