import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withAuthorization } from "./Firebase";

class ServiceModal extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.form.setFieldsValue({ ...this.props.data[this.props.language] });
    }

    onCancel = () => {
        let modalsVisible = this.props.modalsVisible;
        modalsVisible[this.props.language] = false;
        this.props.updateParent(modalsVisible, this.props.data);
    }

    onOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.firebase
                .serviceLanguage(this.props.serviceUid, this.props.language)
                .set({ ...values }, { merge: true })
                .then( () => {
                    let modalsVisible = this.props.modalsVisible;
                    modalsVisible[this.props.language] = false;
                    let langData = values;
                    langData["language"] = this.props.language;
                    let data = this.props.data;
                    data[this.props.language] = langData;
                    this.props.updateParent(modalsVisible, data);
                }
                )
            }
        });
    }

    render() {
        const { isFieldTouched, getFieldDecorator, getFieldError} = this.props.form;
        const nameError = isFieldTouched("name") && getFieldError("name");
        const descError =
        isFieldTouched("description") && getFieldError("description");
        const hoursError = isFieldTouched("hours") && getFieldError("hours");

        return (
            <div>
                <Modal
                    title={this.props.language}
                    visible={this.props.modalsVisible[this.props.language]}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                >
                <Form>
                    <Form.Item
                    validateStatus={nameError ? "error" : ""}
                    help={nameError || ""}
                    label='Name'
                    >
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Enter organization name" }]
                    })(<Input />)}
                    </Form.Item>
                    <Form.Item
                    validateStatus={descError ? "error" : ""}
                    help={descError || ""}
                    label='Description'
                    >
                    {getFieldDecorator("description", {
                        rules: [
                        { required: true, message: "Enter organization description" }
                        ]
                    })(
                        <TextArea
                        autosize={{ minRows: 2, maxRows: 6 }}
                        
                        />
                    )}
                    </Form.Item>
                    <Form.Item
                    validateStatus={hoursError ? "error" : ""}
                    help={hoursError || ""}
                    label='Hours'
                    >
                    {getFieldDecorator("hours", {
                        rules: [{ required: true, message: "Enter hours" }]
                    })(<Input />)}
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        )
    }
}

const WrappedServiceModal = Form.create()(ServiceModal);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(WrappedServiceModal);
