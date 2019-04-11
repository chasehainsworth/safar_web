import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal, Select } from "antd";
import { withFirebase} from "../components/Firebase";
import { withRouter } from "react-router-dom";

import strings from "../constants/localization";

function hasErrors(fieldsError) {
  // console.log(
  //   "Errors: ",
  //   Object.keys(fieldsError).some(field => fieldsError[field])
  // );
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const Option = Select.Option;

class RequestAccountPage extends Component {
  state = {};

  componentDidMount() {
    // To disabled next button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((fieldErr, values) => {
      const { name, email, camp } = values;
      let requestAccount = this.props.firebase.functions.httpsCallable('requestAccount');
      requestAccount({name: name, email: email, camp: camp })
        .catch(error => {
          console.log(error);
        })
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

const WrappedRequestAccountPage = Form.create({ name: "request" })(
  withRouter(withFirebase(RequestAccountPage)));

export default WrappedRequestAccountPage;
