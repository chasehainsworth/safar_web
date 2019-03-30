import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Modal, Form, Input } from "antd";
import CustomUpload from "./CustomUpload";
import TextArea from "antd/lib/input/TextArea";
import { withFirebase } from "./Firebase";
import strings from "../constants/localization";

const initial = "";

class InfoForm extends StepFormComponent {
  state = {
    previewVisible: false,
    previewImage: ""
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    // TODO: Remove thumburl and preview from URL
    //  console.log("file", file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  checkPhoneNumber = (rule, value, callback) => {
    if (value) {
      for (const i of value) {
        if (i === "(" || i === ")" || i === " " || i === "+" || i.match(/\d/)) {
          continue;
        } else {
          callback("Phone number must be in phone number format.");
          break;
        }
      }
    }
    callback();
  };

  checkImages = (rule, value, callback) => {
    // console.log(this.props.formData.images);
    if (this.props.formData.images.length < 1) {
      callback("Please upload at least one image.");
    } else {
      callback();
    }
  };

  render() {
    const { previewVisible, previewImage } = this.state;

    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.formObject;
    const orgNameError = isFieldTouched("orgName") && getFieldError("orgName");
    const descError =
      isFieldTouched("description") && getFieldError("description");
    const countryError = isFieldTouched("countryOfOrigin") && getFieldError("countryOfOrigin");
    const hoursError = isFieldTouched("hours") && getFieldError("hours");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");
    const emailError = isFieldTouched("email") && getFieldError("email");
    const imageError = this.props.formData.images.length > 0;

    const formItemLayout = {
      labelCol: { offset: 5, span: 6 },
      wrapperCol: { span: 6 }
    };

    return (
      <div>
        <Form.Item
          {...formItemLayout}
          validateStatus={orgNameError ? "error" : ""}
          help={orgNameError || ""}
          label={strings.ORGANIZATION_NAME}
        >
          {getFieldDecorator("orgName", {
            rules: [{ required: true, message: "Enter organization name" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          validateStatus={descError ? "error" : ""}
          {...formItemLayout}
          help={descError || ""}
          label={strings.DESCRIPTION}
        >
          {getFieldDecorator("description", {
            rules: [
              { required: true, message: "Enter organization description" }
            ]
          })(
            <TextArea
              autosize={{ minRows: 2, maxRows: 4 }}
              style={{ width: 240 }}
            />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={countryError ? "error" : ""}
          help={countryError || ""}
          label={strings.COUNTRY_OF_ORIGIN}
        >
          {getFieldDecorator("countryOfOrigin", {
            rules: [{ required: true, message: "Enter country of origin" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          validateStatus={phoneError ? "error" : ""}
          help={phoneError || ""}
          label={strings.PHONE_NUMBER}
          {...formItemLayout}
        >
          {getFieldDecorator("phone", {
            initialValue: "+30",
            rules: [
              { required: true, message: "Enter phone number" },
              { min: 9 },
              { validator: this.checkPhoneNumber }
            ]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          validateStatus={imageError ? "error" : ""}
          help={imageError || ""}
          {...formItemLayout}
          label={strings.UPLOAD_IMAGES}
          required={true}
        >
          <div className='clearfix'>
            {getFieldDecorator("images", {
              rules: [{ validator: this.checkImages }]
            })(
              <CustomUpload
                onPreview={this.handlePreview}
                maxUploads={3}
                {...this.props}
              />
            )}
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt='example' style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={emailError ? "error" : ""}
          help={emailError || ""}
          label={strings.EMAIL}
        >
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "Enter email" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={hoursError ? "error" : ""}
          help={hoursError || ""}
          label={strings.HOURS}
        >
          {getFieldDecorator("hours", {
            rules: [{ required: true, message: "Enter hours" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item label={strings.SPECIAL_NOTE} {...formItemLayout}>
          {getFieldDecorator("availabilityNote", { initialValue: initial })(
            <Input style={{ width: 240 }} />
          )}
        </Form.Item>
      </div>
    );
  }
}

export default withFirebase(InfoForm);
