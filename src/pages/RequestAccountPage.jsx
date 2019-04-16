import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, Modal, Select } from "antd";
import { withFirebase} from "../components/Firebase";
import { withRouter } from "react-router-dom";

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

const Option = Select.Option;

/**
 * Creates an antd Modal of either Error or Success type.
 *
 * @param {string} type
 * @param {string} title
 * @param {string} content
 * @public
 */
function modalMessage(type, title, content) {
  if(type === 'error') {
    Modal.error({
      title,
      content,
      centered: true
    });
  } else {
    Modal.success({
      title,
      content,
      centered: true
    });
  }
}

/**
 * The page for an organization to request an account from the camp admin. 
 * The input for organization name and email, and a dropdown of all camps using Safar
 * is wrapped in an antd form object.
 */
class RequestAccountPage extends Component {
  state = {};

  componentDidMount() {
    // To disabled next button at the beginning.
    this.props.form.validateFields();
  }

/**
 * Calls the requestAccount cloud function to send an email to the camp admin
 * with the organization's information.
 */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((fieldErr, values) => {
      if(!fieldErr) {
        const { name, email, camp } = values;
        let requestAccount = this.props.firebase.functions
          .httpsCallable('requestAccount');
        requestAccount({'name': name, 'email': email, 'camp': camp})
          .then(res => {
            modalMessage('success', 'Request successfully sent!', '');
            console.log(res);
            return res;
          })
          .catch(error => {
            modalMessage('error', 'Error in sending request', <p>Please contact the system administrator</p>)
            console.log(error);
          })
        }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      getFieldsError,
      isFieldTouched
    } = this.props.form;

    const noNameError = isFieldTouched("name") && getFieldError("name");
    const noEmailError = isFieldTouched("email") && getFieldError("email");
    const noCampError = isFieldTouched("camp") && getFieldError("camp");

    return (
      <div key='title' className='smallFormWrapper'>
        <h1>{strings.REQUEST_ACCOUNT}</h1>
        <div className='smallForm'>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              validateStatus={noNameError ? "error" : ""}
              help={noNameError || ""}
            >
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Please input your name!" }]
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder={strings.ORGANIZATION_NAME}
                />
              )}
              
            </Form.Item>
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
              validateStatus={noCampError ? "error" : ""}
              help={noCampError || ""}
            >
              {getFieldDecorator("camp", {
                rules: [{ required: true, message: "Please choose your camp!" }]
              })(
                <Select placeholder={strings.SELECT_CAMP}>
                  <Option value={strings.MORIA}>{strings.MORIA}</Option>
                </Select>
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

RequestAccountPage.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object
}

const WrappedRequestAccountPage = Form.create({ name: "request" })(
  withRouter(withFirebase(RequestAccountPage)));

export default WrappedRequestAccountPage;
