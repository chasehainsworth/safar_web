import React from "react";
import { withFirebase } from "../";
import { withRouter } from "react-router-dom";

const AuthUserContext = React.createContext(null);

/**
 * Provides a wrapper to components to keep track of the state of the authenticated
 * user. Listens for user state changes and provides the updates to that state
 * via an AuthUserContext Provider.
 *
 * @param {Component} Component
 * @public
 */
const withAuthentication = Component => {
  class WithAuthentication extends Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
        },
        () => this.setState({ authUser: null })
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withRouter(withFirebase(WithAuthentication));
};

export default AuthUserContext;

export { withAuthentication };
