import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Row, Col, Form, Input, Icon } from "antd";
import { ReactComponent as WhatsAppIcon } from "../social-whatsapp.svg";

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
            <Row type="flex" justify="start" gutter={32}>
                <Col offset={9}><Icon type="link" style={{ fontSize: '22px' }} /></Col>
                <Col>Organization Website: </Col>
                <Col>
                    <Form.Item
                    validateStatus ={orgSiteError ? "error" : ""}
                    help ={orgSiteError || ""}>
                        {getFieldDecorator("orgSite", {
                        rules: [{ required: true, message: "Enter organization website" }]
                        })(
                        <Input style={{width: 120}} />
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row type="flex" justify="start" gutter={32}>
                <Col offset={9}><Icon type="facebook" theme="filled" style={{ fontSize: '22px', color: "#0e1f56" }}/></Col>
                <Col>Facebook: </Col>
                <Col>
                    <Form.Item>
                        {getFieldDecorator("facebook")(
                        <Input style={{width: 120}} />
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row type="flex" justify="start" gutter={32}>
                <Col offset={9}><Icon component={WhatsAppIcon} style={{fontSize: "22px", color: "#25D366"}}/></Col>
                <Col>WhatsApp: </Col>
                <Col>
                    <Form.Item>
                        {getFieldDecorator("whatsapp")(
                        <Input style={{width: 120}} />
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row type="flex" justify="start" gutter={32}>
                <Col offset={9}><Icon type="twitter" style={{ fontSize: '22px', color: "#00aced" }}/></Col>
                <Col>Twitter: </Col>
                <Col>
                    <Form.Item>
                        {getFieldDecorator("twitter")(
                        <Input style={{width: 120}} />
                        )}
                    </Form.Item>
                </Col>
            </Row>

        </div>
    )}
}

export default SocialForm;