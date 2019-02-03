import React, { Component } from "react";
import { Form, Select } from "antd";

const languages = ["English", "Farsi", "Arabic", "French"];

let formObject = {};

class LanguageForm extends Component {
  constructor(props) {
    super(props);
    formObject = props.formObject;
    this.state = {};
  }

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = formObject;

    const noLangError = isFieldTouched("language") && getFieldError("language");
    return (
      <div>
        <Form.Item
          validateStatus={noLangError ? "error" : ""}
          help={noLangError || ""}
        >
          {getFieldDecorator("language", {
            rules: [{ required: true, message: "Please choose a language!" }]
          })(
            <Select placeholder='Language' style={{ width: 120 }}>
              {languages.map(l => (
                <Select.Option key={l} value={l}>
                  {l}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </div>
    );
  }
}

export default LanguageForm;
