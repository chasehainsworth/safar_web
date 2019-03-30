import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withAuthorization } from "./Firebase";
import strings from "../constants/localization";

class ServiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: (this.props.language === "New Language") ? this.props.newLanguage : this.props.language
    }
  }

  componentDidMount() {
    // autofill email field from org
    // create deep copy of data to avoid it being added to table if user cancels
    let data = JSON.parse(JSON.stringify(this.props.data));
    if(this.props.org && this.props.org["langs"] && this.props.org["langs"][this.state.language]) {
      data[this.state.language] = {};
      data[this.state.language]["hours"] = this.props.org["langs"][this.state.language]["hours"];
    }
    this.props.form.setFieldsValue({ ...data[this.state.language] });
  }

  onCancel = () => {
    let modalsVisible = this.props.modalsVisible;
    if(this.props.newLanguage) {
      modalsVisible["New Language"] = false;
    }
    else {
      modalsVisible[this.state.language] = false;
    }
    this.props.updateParent(modalsVisible, this.props.data);
  };

  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.firebase
          .serviceLanguage(this.props.serviceUid, this.state.language)
          .set({ ...values }, { merge: true })
          .then(() => {
            let modalsVisible = this.props.modalsVisible;
            if(this.props.newLanguage) {
              modalsVisible["New Language"] = false;
            }
            else {
              modalsVisible[this.state.language] = false;
            }
            let langData = values;
            langData["language"] = this.state.language;
            let data = this.props.data;
            data[this.state.language] = langData;
            this.props.updateParent(modalsVisible, data);
          });
      }
    });
  };

  render() {
    const {
      isFieldTouched,
      getFieldDecorator,
      getFieldError
    } = this.props.form;
    const nameError = isFieldTouched("name") && getFieldError("name");
    const descError =
      isFieldTouched("description") && getFieldError("description");
    const hoursError = isFieldTouched("hours") && getFieldError("hours");

    let modalName = (this.props.language === "New Language") ? "New Language" : this.state.language;

    return (
      <div>
        <Modal
          title={this.state.language}
          visible={this.props.modalsVisible[modalName]}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <Form>
            <Form.Item
              validateStatus={nameError ? "error" : ""}
              help={nameError || ""}
              label={strings.NAME}
            >
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Enter organization name" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              validateStatus={descError ? "error" : ""}
              help={descError || ""}
              label={strings.DESCRIPTION}
            >
              {getFieldDecorator("description", {
                rules: [
                  { required: true, message: "Enter organization description" }
                ]
              })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </Form.Item>
            <Form.Item
              validateStatus={hoursError ? "error" : ""}
              help={hoursError || ""}
              label={strings.HOURS}
            >
              {getFieldDecorator("hours", {
                rules: [{ required: true, message: "Enter hours" }]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedServiceModal = Form.create()(ServiceModal);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(WrappedServiceModal);
