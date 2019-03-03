import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withAuthorization } from "../components/Firebase";

class ServiceModalForm extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.form.setFieldsValue({ ...this.props.data[this.props.language] });
    }
    
    onOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.firebase
                .serviceLanguage(this.props.serviceUid, this.props.language)
                .set({ ...values }, { merge: true })
                .then( () => {
                    let visible = this.props.visible;
                    visible[this.props.language] = false;
                    let langData = values;
                    langData["language"] = this.props.language;
                    let data = this.props.data;
                    data[this.props.language] = langData;
                    this.props.updateServiceTable(visible, data);
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

        console.log(this.props.visible);
        return (
            <div>
                <Modal
                    key={this.props.index}
                    title={this.props.title}
                    visible={this.props.visible[this.props.language]}
                    onOk={this.onOk}
                    onCancel={() => this.props.onCancel(this.props.language, false)}
                >
                <Form>
                    <Form.Item
                    validateStatus={nameError ? "error" : ""}
                    help={nameError || ""}
                    label='Name'
                    >
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Enter organization name" }]
                    })(<Input style={{ width: 240 }} />)}
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
                        autosize={{ minRows: 2, maxRows: 4 }}
                        style={{ width: 240 }}
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
                    })(<Input style={{ width: 240 }} />)}
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        )
    }
}

const WrappedServiceModalForm = Form.create()(ServiceModalForm);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(WrappedServiceModalForm);
