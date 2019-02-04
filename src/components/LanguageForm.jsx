import React, { Component } from "react";
import StepFormComponent from "./StepFormComponent";
import { Form, Select } from "antd";

const languages = ["English", "Farsi", "Arabic", "French"];

class LanguageForm extends StepFormComponent {
  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.getFormObject();

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
            <Select
              placeholder={!this.props.formData["Language"] && "Language"}
              style={{ width: 120 }}
            >
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
