import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Form, Select, Icon } from "antd";

import strings from "../constants/localization";

const languages = ["English", "Farsi", "Arabic", "French"];

class LanguageForm extends StepFormComponent {
  state = {
    filledLanguages: null
  }

  updateFilledLanguages = () => {
    this.setState({filledLanguages: this.props.getFilledLanguages()});
  }
  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.getFormObject();

    const noLangError = isFieldTouched("language") && getFieldError("language");
    return (
      <div style={{ paddingTop: "60px" }}>
        <Form.Item
          validateStatus={noLangError ? "error" : ""}
          help={noLangError || ""}
        >
          {getFieldDecorator("language", {
            rules: [{ required: true }]
          })(
            <Select
              placeholder={!this.props.formData["Language"] && strings.LANGUAGE}
              style={{ width: 120 }}
              onFocus={this.updateFilledLanguages}
            >
              {languages.map(l => (
                <Select.Option key={l} value={l}>
                  {
                    this.state.filledLanguages &&
                    this.state.filledLanguages[l] && 
                    <Icon type="check" />
                  } {l}
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
