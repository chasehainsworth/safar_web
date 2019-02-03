import React, { Component } from "react";
import StepFormComponent from "./StepFormComponent";
import { Row, Col, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

class InfoForm extends StepFormComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.formObject;
        return (
            <div>
                <Row type="flex" justify="start" gutter={32}>
                    <Col offset={10}>Organization Name: </Col>
                    <Col>
                        <Form.Item
                        validateStatus ={isFieldTouched("orgName") && getFieldError("orgName") ? "error" : ""}
                        help ={isFieldTouched("orgName") && getFieldError("orgName") || ""}>
                            {getFieldDecorator("orgName", {
                            rules: [{ required: true, message: "Enter organization name" }]
                            })(
                            <Input style={{width: 120}} />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" justify="start" gutter={32}>
                    <Col offset={10}>Description: </Col>
                    <Col>
                        <Form.Item
                        validateStatus = {isFieldTouched("desc") && getFieldError("desc") ? "error" : ""}
                        help = {isFieldTouched("desc") && getFieldError("desc") || ""}>
                            {getFieldDecorator("desc", {
                            rules: [{ required: true, message: "Enter organization description"}]
                            })(
                            <TextArea autosize={{minRows: 2, maxRows: 4}} style={{width: 120}} />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" justify="start" gutter={32}>
                    <Col offset={10}>Phone Number: </Col>
                    <Col>
                        <Form.Item
                        validateStatus = {isFieldTouched("phone") && getFieldError("phone") ? "error" : ""}
                        help = {isFieldTouched("phone") && getFieldError("phone") || ""}>
                            {getFieldDecorator("phone", {
                            rules: [{ required: true, message: "Enter phone number"}]
                            })(
                            <Input style={{width: 120}} />
                            )
                            }
                        </Form.Item> 
                    </Col>
                </Row>
                <Row type="flex" justify="start" gutter={32} className="spaced">
                    <Col offset={10}>Hours: </Col>
                    <Col>
                        <Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row type="flex" justify="start" gutter={32}>
                    <Col offset={10}>Any special notes regarding availability?</Col>
                </Row>
                <Row type="flex" justify="start" gutter={32}>
                    <Col offset={10}>
                        <Form.Item>
                            <Input style={{width: 120}} />
                        </Form.Item>
                    </Col> 
                </Row>
        </div>
        )
    }
}

export default InfoForm;