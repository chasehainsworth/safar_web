import React from "react";
import PropTypes from "prop-types";
import StepFormComponent from "./StepFormComponent";
import { Modal, Form, Input, Select, Button } from "antd";
import CustomUpload from "./CustomUpload";
import TextArea from "antd/lib/input/TextArea";
import { withFirebase } from "./Firebase";
import strings from "../constants/localization";
import * as i18nIsoCountries from "i18n-iso-countries";
import HoursPicker from "./HoursPicker";

const initial = "";
const Option = Select.Option;

/**
 * Form with fields:
 * * Organization Name
 * * Description
 * * Country of Origin (this is populated using the _i18n-iso-countries_ dependency)
 * * Upload Images
 * * Email
 * * Hours
 * * Any special notes regarding availability 
 */
class InfoForm extends StepFormComponent {
  constructor(props) {
    super(props);

    i18nIsoCountries.registerLocale(
      require("i18n-iso-countries/langs/en.json")
    );
    i18nIsoCountries.registerLocale(
      require("i18n-iso-countries/langs/fr.json")
    );
    i18nIsoCountries.registerLocale(
      require("i18n-iso-countries/langs/fa.json")
    );
    i18nIsoCountries.registerLocale(
      require("i18n-iso-countries/langs/ar.json")
    );
    
    console.log(this.props.formData.hours)
    this.state = {
      previewVisible: false,
      previewImage: "",
      hoursVisible: false,
      hoursString: this.props.formData.hours
    };
  }
  
  /**
 * Set image preview modal to invisible.
 * 
 * @public
 */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    // TODO: Remove thumburl and preview from URL
    //  console.log("file", file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  /**
 * Update 'hours' field and state with newly input value. 
 *
 * @param {string} text
 * @public
 */
  enterHours = times => {
    const hoursString = JSON.stringify(times);
    this.props.formObject.setFieldsValue({ hours: hoursString });
    this.setState({ hoursVisible: false, hoursString });
  };

  /**
 * Validate phone number to only contain numbers, parenthesis, space, or plus sign.
 *
 * @param {object} rule - Not used. 
 * @param {string} value - User input. 
 * @param {string} callback - Not used. 
 * @public
 */
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

  /**
 * Validate at least one image has been uploaded.
 *
 * @param {object} rule - Not used. 
 * @param {string} value - User input. 
 * @param {string} callback - Not used. 
 * @public
 */
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
    const countryError =
      isFieldTouched("countryOfOrigin") && getFieldError("countryOfOrigin");
    const hoursError = isFieldTouched("hours") && getFieldError("hours");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");
    const emailError = isFieldTouched("email") && getFieldError("email");
    const imageError = this.props.formData.images.length > 0;

    const formItemLayout = {
      labelCol: { offset: 5, span: 5 },
      wrapperCol: { offset: 1, span: 10 }
    };

    const hoursBtnStyle = {
      border: "none",
      height: "inherit",
      background: "inherit",
      boxShadow: "none"
    };

    let countries = i18nIsoCountries.getNames(strings.getLanguage());
    return (
      <div style={{ textAlign: "left" }}>
        <Form.Item
          {...formItemLayout}
          validateStatus={orgNameError ? "error" : ""}
          help={orgNameError || ""}
          label={strings.ORGANIZATION_NAME}
        >
          {getFieldDecorator("orgName", {
            rules: [{ required: true, message: "Enter organization name" }]
          })(<Input />)}
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
          })(<TextArea />)}
        </Form.Item>
        <Form.Item label={strings.LOCATION} {...formItemLayout}>
          {getFieldDecorator("availabilityNote", { initialValue: initial })(
            <Input />
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
          })(
            <Select>
              {Object.keys(countries).map(countryCode => {
                return (
                  <Option value={countryCode}>{countries[countryCode]}</Option>
                );
              })}
            </Select>
          )}
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
              { message: "Enter phone number" },
              { min: 9 },
              { validator: this.checkPhoneNumber }
            ]
          })(<Input />)}
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
                disableNext={this.props.disableNext}
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
          })(<Input />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={hoursError ? "error" : ""}
          help={hoursError || ""}
          label={strings.OPERATING_HOURS}
        >
          {getFieldDecorator("hours", {
            rules: [{ required: true, message: "Enter hours" }], initialValue: this.props.formData.hoursString
          })(
            <Input
              disabled
              addonAfter={
                <Button
                  icon='plus'
                  style={hoursBtnStyle}
                  onClick={() => {
                    const v = this.state.hoursVisible;
                    this.setState({
                      hoursVisible: !v
                    });
                  }}
                >
                  Update Hours
                </Button>
              }
            />
          )}
        </Form.Item>

        <HoursPicker
          visible={this.state.hoursVisible}
          onOk={this.enterHours}
          currentTimes={this.state.hoursString}
        />
      </div>
    );
  }
}

InfoForm.propTypes = {
  /** *Inherited:* Form data retrieved from Firebase or entered by user */
  formData: PropTypes.object,
  /** *Inherited:* Antd form object */
  formObject: PropTypes.object
}
export default withFirebase(InfoForm);
