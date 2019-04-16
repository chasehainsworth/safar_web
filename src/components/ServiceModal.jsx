import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withAuthorization } from "./Firebase";
import strings from "../constants/localization";

/**
 * Modal with the service name and description for a given translation. They
 * are wrapped in an antd form, which allows the fields to be loaded with existing data.
 * 
 * Each visibility of each modal is controlled state variables in modalsVisible. Since the
 * "Add New Language" modal could be associated with any language, it has a special variable
 * newLanguage which contains the new language being added.
*/
export class ServiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:
        this.props.language === "New Language"
          ? this.props.newLanguage
          : this.props.language
    };
  }

  componentDidMount() {
    // autofill hours field from org
    // create deep copy of data to avoid it being added to table if user cancels
    let data = JSON.parse(JSON.stringify(this.props.data));
    if (
      this.props.org &&
      this.props.org["langs"] &&
      this.props.org["langs"][this.state.language]
    ) {
      data[this.state.language] = {};
      data[this.state.language]["hours"] = this.props.org["langs"][
        this.state.language
      ]["hours"];
    }
    this.props.form.setFieldsValue({ ...data[this.state.language] });
  }

  /**
   * Make modal invisible.
  */
  onCancel = () => {
    let modalsVisible = this.props.modalsVisible;
    if (this.props.newLanguage) {
      modalsVisible["New Language"] = false;
    } else {
      modalsVisible[this.state.language] = false;
    }
    this.props.updateParent(modalsVisible, this.props.data);
  };

  /**
   * Update language entry for service in firebase, update the parent, and make modal invisible.
  */
  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.firebase
          .serviceLanguage(this.props.serviceUid, this.state.language)
          .set({ ...values }, { merge: true })
          .then(() => {
            let modalsVisible = this.props.modalsVisible;
            if (this.props.newLanguage) {
              modalsVisible["New Language"] = false;
            } else {
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

    let modalName =
      this.props.language === "New Language"
        ? "New Language"
        : this.state.language;

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
              label={strings.SERVICE_NAME}
            >
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Enter service name" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              validateStatus={descError ? "error" : ""}
              help={descError || ""}
              label={strings.SERVICE_DESCRIPTION}
            >
              {getFieldDecorator("description", {
                rules: [
                  { required: true, message: "Enter service description" }
                ]
              })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </Form.Item>
            <Form.Item
              validateStatus={hoursError ? "error" : ""}
              help={hoursError || ""}
              label={strings.SERVICE_HOURS}
            >
              {getFieldDecorator("hours", {
                rules: [{ required: true, message: "Enter service hours" }]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

ServiceModal.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object,
  /** Current language. Used as a key in modalsVisible */
  language: PropTypes.string,
  /** Specify the new language being added. Optional */
  newLanguage: PropTypes.string, 
  /** Map between language and bool controlling visibility of the associated modal */
  modalsVisible: PropTypes.object,
  /** Function to update parent state */
  updateParent: PropTypes.func,
  /** Translation of service name and description */
  data: PropTypes.object 
}

const WrappedServiceModal = Form.create()(ServiceModal);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(WrappedServiceModal);
