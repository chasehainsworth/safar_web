import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal } from "antd";
import { withFirebase } from "../components/Firebase";
import { withRouter } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";

function hasErrors(fieldsError) {
  // console.log(
  //   "Errors: ",
  //   Object.keys(fieldsError).some(field => fieldsError[field])
  // );
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignUpPage extends Component {
  state = {};

  componentDidMount() {
    // To disabled next button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((fieldErr, values) => {
      const { email, passOne } = values;
      const role = ROLES.PROVIDER;
      if (!fieldErr) {
        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passOne)
          .then(authUser => {
            // Create a user in your Firebase realtime database
            let r = this.props.firebase.user(authUser.user.uid).set(
              {
                email,
                role
              },
              { merge: true }
            );
            this.props.history.push(
              ROUTES.UPDATE_ACC + "/" + authUser.user.uid
            );
            return r;
          })
          // .then(() => {
          //   return this.props.firebase.doSendEmailVerification();
          // })
          .catch(firebaseErr => {
            console.log(firebaseErr);
            Modal.error({
              title: "Failed",
              content: firebaseErr.message,
              centered: true
            });
          });
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("passOne")) {
      callback("The second password does not match!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
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
      isFieldTouched("passOne") && getFieldError("passOne");
    const noPassTwoError =
      isFieldTouched("passTwo") && getFieldError("passTwo");

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
        <Form.Item
          validateStatus={noPassOneError ? "error" : ""}
          help={noPassOneError || ""}
        >
          {getFieldDecorator("passOne", {
            rules: [
              { required: true, message: "Please input a password!" },
              { validator: this.validateToNextPassword }
            ]
          })(
            <Input
              prefix={<Icon type='key' style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder='Password'
              type='password'
            />
          )}
        </Form.Item>
        <Form.Item
          validateStatus={noPassTwoError ? "error" : ""}
          help={noPassTwoError || ""}
        >
          {getFieldDecorator("passTwo", {
            rules: [
              { required: true, message: "Please repeat your password!" },
              { validator: this.compareToFirstPassword }
            ]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder='Re-enter your password'
              type='password'
            />
          )}
        </Form.Item>
        <Button
          htmlType='submit'
          type='primary'
          disabled={hasErrors(getFieldsError())}
        >
          Sign Up
        </Button>
      </Form>
    );
  }
}

const WrappedSignUpPage = Form.create({ name: "signup" })(SignUpPage);

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;
export default withRouter(withFirebase(WrappedSignUpPage));