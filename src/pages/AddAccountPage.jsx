import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, Modal } from "antd";
import { withAuthorization, AuthUserContext } from "../components/Firebase";

import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";
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

let camp = "";

/**
 * The page for an administrator to create a new account for an organization. 
 * The input for organization name, password, and password confirmation are wrapped
 * in an antd form object.
 */
export class SignUpPage extends Component {
  state = { camp: "" };

  componentDidMount() {
    // To disabled next button at the beginning.
    this.props.form.validateFields();
  }

  /**
  * Creates a new user in firebase authentication, and the firestore users collection.
  * @param {*} e
  */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((fieldErr, values) => {
      const { email, passOne } = values;
      const role = ROLES.ORGANIZATION;

      if (!fieldErr) {
        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passOne)
          .then(authUser => {
            let r = this.props.firebase.user(authUser.user.uid).set(
              {
                email,
                role,
                camp
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

  /**
  * Validates password in second field matches first. 
  * @param {*} rule
  * @param {value} strings
  * @param {function} callback
  */
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("passOne")) {
      callback("The second password does not match!");
    } else {
      callback();
    }
  };

  /**
  * Validates password in first field matches second. 
  * @param {*} rule
  * @param {value} strings
  * @param {function} callback
  */
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
      <div key='title' className='smallFormWrapper'>
        <AuthUserContext.Consumer>
          {authUser => {
            camp = authUser.camp;
          }}
        </AuthUserContext.Consumer>
        <h1>{strings.CREATE_ACCOUNT}</h1>
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
                  prefix={
                    <Icon type='key' style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder={strings.PASSWORD}
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
                  prefix={
                    <Icon type='lock' style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder={strings.REENTER_PASSWORD}
                  type='password'
                />
              )}
            </Form.Item>
            <Button
              htmlType='submit'
              type='primary'
              disabled={hasErrors(getFieldsError())}
            >
              {strings.CREATE_ACCOUNT}
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

SignUpPage.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object,
  /** React-Router's history to redirect users. */
  history: PropTypes.object
}

const WrappedSignUpPage = Form.create({ name: "signup" })(SignUpPage);

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;
export default withAuthorization(condition)(WrappedSignUpPage);
