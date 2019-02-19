import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Row, Col, Form, Input, Icon } from "antd";

const initial = ""
const whatsapp = () => (
  <svg
    t='1550193389257'
    className='icon'
    viewBox='0 0 1024 1024'
    version='1.1'
    pid='1192'
    width='20'
    height='20'
  >
    <path
      d='M2.282667 1024l72.021333-262.933333A506.389333 506.389333 0 0 1 6.549333 507.392C6.656 227.605333 234.368 0 514.133333 0c135.786667 0.064 263.210667 52.906667 359.04 148.8a504.277333 504.277333 0 0 1 148.544 358.997333c-0.128 279.765333-227.84 507.413333-507.584 507.413334h-0.213333c-84.949333-0.042667-168.426667-21.333333-242.56-61.76L2.282667 1024z'
      fill='#3AC34C'
      p-id='1193'
    />
    <path
      d='M387.264 295.253333c-10.282667-24.704-20.736-21.354667-28.522667-21.76-7.402667-0.362667-15.850667-0.426667-24.32-0.426666s-22.186667 3.157333-33.813333 15.850666c-11.626667 12.693333-44.373333 43.370667-44.373333 105.770667 0 62.421333 45.44 122.709333 51.776 131.157333 6.336 8.469333 89.429333 136.533333 216.661333 191.445334 30.250667 13.056 53.866667 20.864 72.298667 26.709333 30.378667 9.642667 58.026667 8.298667 79.872 5.034667 24.362667-3.648 75.029333-30.677333 85.610666-60.288 10.56-29.632 10.56-55.018667 7.402667-60.309334-3.178667-5.269333-11.626667-8.448-24.32-14.805333-12.672-6.336-75.029333-37.013333-86.656-41.237333-11.626667-4.245333-20.074667-6.357333-28.544 6.336-8.448 12.693333-32.746667 41.258667-40.149333 49.706666-7.402667 8.469333-14.805333 9.536-27.477334 3.2-12.693333-6.357333-53.546667-19.754667-101.973333-62.933333-37.717333-33.621333-63.168-75.157333-70.570667-87.850667-7.402667-12.693333-0.789333-19.541333 5.546667-25.877333 5.717333-5.674667 12.693333-14.805333 19.029333-22.186667 6.357333-7.424 8.469333-12.714667 12.693334-21.162666 4.224-8.469333 2.112-15.872-1.066667-22.229334-3.157333-6.336-28.522667-68.736-39.104-94.122666z'
      fill='#FFFFFF'
      p-id='1194'
    />
  </svg>
);

class SocialForm extends StepFormComponent {
  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.getFormObject();

    const orgSiteError = isFieldTouched("orgSite") && getFieldError("orgSite");

    return (
      <div>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={9}>
            <Icon type='link' style={{ fontSize: "22px" }} />
          </Col>
          <Col>Organization Website: </Col>
          <Col>
            <Form.Item
              validateStatus={orgSiteError ? "error" : ""}
              help={orgSiteError || ""}
            >
              {getFieldDecorator("orgSite", {
                rules: [
                  { required: true, message: "Enter organization website" }
                ]
              })(<Input style={{ width: 120 }} />)}
            </Form.Item>
          </Col>
        </Row>

        <Row type='flex' justify='start' gutter={32}>
          <Col offset={9}>
            <Icon
              type='facebook'
              theme='filled'
              style={{ fontSize: "22px", color: "#0e1f56" }}
            />
          </Col>
          <Col>Facebook: </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("facebook", { initialValue: initial })(
                <Input style={{ width: 120 }} />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row type='flex' justify='start' gutter={32}>
          <Col offset={9}>
            <Icon
              component={whatsapp}
              style={{ fontSize: "22px", color: "#25D366" }}
            />
          </Col>
          <Col>WhatsApp: </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("whatsapp", { initialValue: initial })(
                <Input style={{ width: 120 }} />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row type='flex' justify='start' gutter={32}>
          <Col offset={9}>
            <Icon
              type='twitter'
              style={{ fontSize: "22px", color: "#00aced" }}
            />
          </Col>
          <Col>Twitter: </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator("twitter", { initialValue: initial })(
                <Input style={{ width: 120 }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SocialForm;
