import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal } from "antd";
import { withFirebase, AuthUserContext } from "../components/Firebase";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";
import strings from "../constants/localization";

/**
 * @param {*} fieldsError
 * @returns A filtered list of all fields that have errors.
 * @public
 */
function hasErrors(fieldsError) {
  // console.log(
  //   "Errors: ",
  //   Object.keys(fieldsError).some(field => fieldsError[field])
  // );
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * Creates an antd Modal (Error type) with an error message.
 *
 * @param {string} title
 * @param {string} content
 * @public
 */
function errorMessage(title, content) {
  Modal.error({
    title,
    content,
    centered: true
  });
}

/**
 * Provides a form with email and password for a user to login to the portal via
 * firebase authentication.
 */
class LoginPage extends Component {
  state = {
    forgotPassword: false
  };

  componentDidMount() {
    // To disable login button at the beginning.
    this.props.form.validateFields();
  }

  /**
   * Validates the fields and attempts login.
   * @param {event} e
   * @public
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((fieldErr, values) => {
      if (!fieldErr) {
        if (this.state.forgotPassword) {
          this.submitResetPW(values);
        } else {
          this.submitLogin(values);
        }
      }
    });
  };

  /**
   * Attempts to login via firebase authentication. Shows a modal with the error
   * on failure.
   * @param {Object} values
   * @public
   */
  submitLogin = values => {
    this.props.firebase
      .doSignInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        console.log("Success:", values.email);
        this.props.history.push(ROUTES.LOGIN);
      })
      .catch(firebaseErr => {
        errorMessage("Failed to Login.", firebaseErr.message);
      });
  };

  /**
   * Validates the email and calls firebase's reset password method.
   * @param {Object} values
   * @public
   */
  submitResetPW = values => {
    this.props.firebase
      .doPasswordReset(values.email)
      .then(() => {
        this.setState({ forgotPassword: false });
      })
      .catch(error => {
        errorMessage("Failed to send email", error.message);
      });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      getFieldsError,
      isFieldTouched
    } = this.props.form;

    const noEmailError = isFieldTouched("email") && getFieldError("email");
    const noPassOneError =
      isFieldTouched("password") && getFieldError("password");

    return (
      <div className='smallFormWrapper'>
        <AuthUserContext.Consumer>
          {authUser => {
            authUser &&
              authUser.role === ROLES.ADMIN &&
              this.props.history.push(ROUTES.ADMIN);
            authUser &&
              authUser.role === ROLES.ORGANIZATION &&
              this.props.history.push(ROUTES.UPDATE_ACC);
          }}
        </AuthUserContext.Consumer>
        <h1>{strings.LOGIN}</h1>
        <div className='smallForm'>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              validateStatus={noEmailError ? "error" : ""}
              help={noEmailError || ""}
            >
              {getFieldDecorator("email", {
                rules: [{ required: true, message: "Please input your email!" }]
              })(
                <Input
                  prefix={
                    <Icon type='mail' style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder={strings.EMAIL}
                />
              )}
            </Form.Item>
            {!this.state.forgotPassword && (
              <Form.Item
                validateStatus={noPassOneError ? "error" : ""}
                help={noPassOneError || ""}
              >
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please input a password!" },
                    { validator: this.validateToNextPassword }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type='key' style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={strings.PASSWORD}
                    type='password'
                  />
                )}
              </Form.Item>
            )}
            <Button
              htmlType='submit'
              type='primary'
              disabled={hasErrors(getFieldsError())}
            >
              {this.state.forgotPassword
                ? strings.SEND_RESET_PASSWORD_EMAIL
                : strings.LOGIN}
            </Button>

            <button
              type='button'
              onClick={() =>
                this.setState({ forgotPassword: !this.state.forgotPassword })
              }
              style={{ marginLeft: 10 }}
              className='buttonLink'
            >
              {!this.state.forgotPassword
                ? strings.FORGOT_PASSWORD
                : strings.GO_BACK}
            </button>
            {!this.state.forgotPassword && (
              <Link to={ROUTES.REQ_ACC}>
                <Button type='default' style={{ float: "right" }}>
                  {strings.REQUEST_ACCESS}
                </Button>
              </Link>
            )}
          </Form>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  form: PropTypes.object,
  /** React-Router's history to redirect users. */
  history: PropTypes.object
};

const WrappedLoginPage = Form.create({ name: "login" })(
  withRouter(withFirebase(LoginPage))
);

export default WrappedLoginPage;
