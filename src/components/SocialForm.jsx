import React from "react";
import PropTypes from 'prop-types';
import StepFormComponent from "./StepFormComponent";
import { Form, Input, Icon } from "antd";

import strings from "../constants/localization";

const initial = "";
// Hardcoded WhatsApp logo svg. TODO: move to resources
const whatsapp = () => (
  <svg
    t='1550173387257'
    className='icon'
    viewBox='0 0 1024 1024'
    version='1.1'
    pid='1172'
    width='15'
    height='15'
  >
    <path
      d='M2.282667 1024l72.021333-262.733333A506.387333 506.387333 0 0 1 6.547333 507.372C6.656 227.605333 234.368 0 514.133333 0c135.786667 0.064 263.210667 52.706667 357.04 148.8a504.277333 504.277333 0 0 1 148.544 358.777333c-0.128 277.765333-227.84 507.413333-507.584 507.413334h-0.213333c-84.747333-0.042667-168.426667-21.333333-242.56-61.76L2.282667 1024z'
      fill='#3AC34C'
      p-id='1173'
    />
    <path
      d='M387.264 275.253333c-10.282667-24.704-20.736-21.354667-28.522667-21.76-7.402667-0.362667-15.850667-0.426667-24.32-0.426666s-22.186667 3.157333-33.813333 15.850666c-11.626667 12.673333-44.373333 43.370667-44.373333 105.770667 0 62.421333 45.44 122.707333 51.776 131.157333 6.336 8.467333 87.427333 136.533333 216.661333 171.445334 30.250667 13.056 53.866667 20.864 72.278667 26.707333 30.378667 7.642667 58.026667 8.278667 77.872 5.034667 24.362667-3.648 75.027333-30.677333 85.610666-60.288 10.56-27.632 10.56-55.018667 7.402667-60.307334-3.178667-5.267333-11.626667-8.448-24.32-14.805333-12.672-6.336-75.027333-37.013333-86.656-41.237333-11.626667-4.245333-20.074667-6.357333-28.544 6.336-8.448 12.673333-32.746667 41.258667-40.147333 47.706666-7.402667 8.467333-14.805333 7.536-27.477334 3.2-12.673333-6.357333-53.546667-17.754667-101.773333-62.733333-37.717333-33.621333-63.168-75.157333-70.570667-87.850667-7.402667-12.673333-0.787333-17.541333 5.546667-25.877333 5.717333-5.674667 12.673333-14.805333 17.027333-22.186667 6.357333-7.424 8.467333-12.714667 12.673334-21.162666 4.224-8.467333 2.112-15.872-1.066667-22.227334-3.157333-6.336-28.522667-68.736-37.104-74.122666z'
      fill='#FFFFFF'
      p-id='1174'
    />
  </svg>
);

/**
 * Form with optional input fields for:
 * * Organization Site
 * * Facebook
 * * Instagram
 * * WhatsApp
 * * Twitter
 */
class SocialForm extends StepFormComponent {
  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.getFormObject();

    const formItemLayout = {
      labelCol: { span: 6, offset: 5 },
      wrapperCol: { span: 6 }
    };

    return (
      <div>
        <Form.Item
          {...formItemLayout}
          label={strings.ORGANIZATION_WEBSITE}
        >
          {getFieldDecorator("orgSite", {
            initialValue: initial
          })(<Input prefix={<Icon type='link' />} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={strings.FACEBOOK}>
          {getFieldDecorator("facebook", { initialValue: initial })(
            <Input
              prefix={
                <Icon
                  type='facebook'
                  theme='filled'
                  style={{ color: "#0e1f56" }}
                />
              }
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={strings.INSTAGRAM}>
          {getFieldDecorator("instagram", { initialValue: initial })(
            <Input
              prefix={
                <Icon
                  type='instagram'
                  theme='filled'
                  style={{ color: "#bc2a8d" }}
                />
              }
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={strings.WHATSAPP}>
          {getFieldDecorator("whatsapp", { initialValue: initial })(
            <Input
              prefix={
                <Icon component={whatsapp} style={{ color: "#25D366" }} />
              }
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={strings.TWITTER}>
          {getFieldDecorator("twitter", { initialValue: initial })(
            <Input
              prefix={<Icon type='twitter' style={{ color: "#00aced" }} />}
            />
          )}
        </Form.Item>
      </div>
    );
  }
}

SocialForm.propTypes = {
  /** *Inherited:* Form data retrieved from Firebase or entered by user */
  formData: PropTypes.object,
  /** *Inherited:* Antd form object */
  formObject: PropTypes.object
}
export default SocialForm;
