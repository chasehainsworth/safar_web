import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal } from "antd";
import { withFirebase } from "../components/Firebase";
import { withRouter } from "react-router-dom";

import * as ROUTES from "../constants/routes";

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
        this.props.history.push(ROUTES.HOME);
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
        this.setState({ error });
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
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          validateStatus={noEmailError ? "error" : ""}
          help={noEmailError || ""}
        >
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "Please input your email!" }]
          })(
            <Input
              prefix={<Icon type='mail' style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder='Email'
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
                placeholder='Password'
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
          {this.state.forgotPassword ? "Send reset password email" : "Login"}
        </Button>
        {!this.state.forgotPassword && (
          <a onClick={() => this.setState({ forgotPassword: true })}>
            Forgot Password?
          </a>
        )}
      </Form>
    );
  }
}

const WrappedLoginPage = Form.create({ name: "login" })(
  withRouter(withFirebase(LoginPage))
);

export default WrappedLoginPage;
