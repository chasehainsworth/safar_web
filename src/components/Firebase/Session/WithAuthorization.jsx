import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { withFirebase, AuthUserContext } from "../";

import * as ROUTES from "../../../constants/routes";

/**
 * Provides a wrapper for components so that they only have access to the page
 * as an authorized user based on the condition parameter. Otherwise, they are
 * routed to the login page.
 *
 * @param {*} condition
 */
export const withAuthorization = condition => Component => {
  class WithAuthorization extends Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.LOGIN);
          }
        },
        () => this.props.history.push(ROUTES.LOGIN)
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(withFirebase(WithAuthorization));
};

withAuthorization.propTypes = {
  /** React-Router history to redirect between pages. */
  history: PropTypes.object
};

/** @component */
export default withAuthorization;
