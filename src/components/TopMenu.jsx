import React, { Component } from "react";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import Icon from "antd/lib/icon";
import { withFirebase, AuthUserContext } from "../components/Firebase";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";
import strings, { getCurrentLanguageAsString } from "../constants/localization";

const { Header } = Layout;
/**
 * Test
 */
export class TopMenu extends Component {
  /**
   * Handles any choices that aren't links. In this case, logout or language settings.
   *
   * @param {event} e
   * @public
   */
  handleClick = e => {
    switch (e.key) {
      case "SignOut":
        this.props.firebase.doSignOut();
        break;

      case "English":
        this.props.setLanguage("en");
        this.setState({});
        break;

      case "French":
        this.props.setLanguage("fr");
        this.setState({});
        break;

      case "Farsi":
        this.props.setLanguage("fa");
        this.setState({});
        break;

      case "Arabic":
        this.props.setLanguage("ar");
        this.setState({});
        break;

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
                key={ROUTES.LOGIN}
                style={{ backgroundColor: "inherit", ...menuItemProps }}
              >
                {/* Everyone */ console.log(authUser)}
                {/* <Link to={ROUTES.LOGIN} className="logo"> */}S A F A R
                {/* </Link> */}
              </Menu.Item>

              {/* Services providers */}

              {!!authUser && authUser.role === ROLES.ORGANIZATION && (
                <Menu.Item key={ROUTES.UPDATE_ACC} style={menuItemProps}>
                  <Link to={ROUTES.UPDATE_ACC}>
                    {strings.UPDATE_ACCOUNT_INFO}
                  </Link>
                </Menu.Item>
              )}
              {!!authUser && authUser.role === ROLES.ORGANIZATION && (
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
                <Menu.Item
                  key='SignOut'
                  style={{ ...menuItemProps, float: "right" }}
                >
                  <Icon type='logout' />
                  {strings.SIGN_OUT}
                </Menu.Item>
              )}

              {/* Language Selection (All Users) */}
              <Menu.SubMenu
                title={
                  <span className='submenu-title-wrapper'>
                    <Icon type='global' />
                    {getCurrentLanguageAsString()}
                  </span>
                }
                style={{ ...menuItemProps, float: "right" }}
              >
                <Menu.Item key='English'>English</Menu.Item>
                <Menu.Item key='French'>Français</Menu.Item>
                <Menu.Item key='Farsi'>فارسی</Menu.Item>
                <Menu.Item key='Arabic'>العربية</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          )}
        </AuthUserContext.Consumer>
      </Header>
    );
  }
}

TopMenu.propTypes = {
  /** The firebase instance. */
  firebase: PropTypes.object,
  /** React-Routers location to keep track of page moves. */
  location: PropTypes.object,
  /** The method to change the language via react-localization */
  setLanguage: PropTypes.object
};

export default withRouter(withFirebase(TopMenu));
