import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal } from "antd";
import { withFirebase, AuthUserContext } from "../components/Firebase";
import { withRouter } from "react-router-dom";

import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";
import strings from "../constants/localization";

function hasErrors(fieldsError) {
  // console.log(
  //   "Errors: ",
  //   Object.keys(fieldsError).some(field => fieldsError[field])
  // );
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function errorMessage(title, content) {
  Modal.error({
    title,
    content,
    centered: true
  });
}

class LoginPage extends Component {
  state = {
    forgotPassword: false
  };

  componentDidMount() {
    // To disabled next button at the beginning.
    this.props.form.validateFields();
  }

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
            authUser && authUser.role === ROLES.ADMIN && (this.props.history.push(ROUTES.ADMIN));
            authUser && authUser.role === ROLES.ORGANIZATION && (this.props.history.push(ROUTES.UPDATE_ACC));
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
              type="button"
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
            <Button type='default'>
              {strings.REQUEST_ACCESS}
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedLoginPage = Form.create({ name: "login" })(
  withRouter(withFirebase(LoginPage))
);

export default WrappedLoginPage;
