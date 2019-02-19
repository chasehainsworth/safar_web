import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Row, Col, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

class InfoForm extends StepFormComponent {
  checkPassword = (rule, value, callback) => {
    if (value) {
      for (const i of value) {
        if (i === "(" || i === "(" || i === "(" || i === "+" || i.match(/\d/)) {
          continue;
        } else {
          callback("Phone number must be in phone number format.");
          break;
        }
      }
    }
    callback();
  };

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.formObject;
    const orgNameError = isFieldTouched("orgName") && getFieldError("orgName");
    const descError = isFieldTouched("desc") && getFieldError("desc");
    const hoursError = isFieldTouched("hours") && getFieldError("hours");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");

    return (
      <div>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Organization Name: </Col>
          <Col>
            <Form.Item
              validateStatus={orgNameError ? "error" : ""}
              help={orgNameError || ""}
            >
              {getFieldDecorator("orgName", {
                rules: [{ required: true, message: "Enter organization name" }]
              })(<Input style={{ width: 120 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Description: </Col>
          <Col>
            <Form.Item
              validateStatus={descError ? "error" : ""}
              help={descError || ""}
            >
              {getFieldDecorator("desc", {
                rules: [
                  { required: true, message: "Enter organization description" }
                ]
              })(
                <TextArea
                  autosize={{ minRows: 2, maxRows: 4 }}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Phone Number: </Col>
          <Col>
            <Form.Item
              validateStatus={phoneError ? "error" : ""}
              help={phoneError || ""}
            >
              {getFieldDecorator("phone", {
                initialValue: "+30",
                rules: [
                  { required: true, message: "Enter phone number" },
                  { min: 10 },
                  { validator: this.checkPassword }
                ]
              })(<Input style={{ width: 120 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="start" gutter={32} className="spaced">
            <Col offset={10}>Hours: </Col>
            <Col>
                <Form.Item
                validateStatus = {hoursError ? "error" : ""}
                help = {hoursError || ""}>
                    {getFieldDecorator("hours", {
                    rules: [{ required: true, message: "Enter hours"}]
                    })(
                    <Input style={{width: 120}} />
                    )
                    }
                </Form.Item>
            </Col>
        </Row> 
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Any special notes regarding availability?</Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>
            <Form.Item>
              <Input style={{ width: 120 }} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

export default InfoForm;
