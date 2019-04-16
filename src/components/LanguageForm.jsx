import React from "react";
import PropTypes from "prop-types";
import StepFormComponent from "./StepFormComponent";
import { Form, Select, Icon } from "antd";

import strings from "../constants/localization";

const languages = ["English", "Farsi", "Arabic", "French"];

/**
 * Form with a required language select dropdown. When a language is already complete, it will have a checkbox next to its name.
 * English, Farsi, Arabic, and French are the hardcoded choices.
 */
class LanguageForm extends StepFormComponent {
  state = {
    filledLanguages: null
  };

  /**
   * Sets the state of filledLanguages state variable.
   * @public
   */
  updateFilledLanguages = () => {
    this.setState({ filledLanguages: this.props.getFilledLanguages() });
  };

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
                  {this.state.filledLanguages &&
                    this.state.filledLanguages[l] && <Icon type='check' />}{" "}
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

LanguageForm.propTypes = {
  /** *Inherited:* Form data retrieved from Firebase or entered by user */
  formData: PropTypes.object,
  /** *Inherited:* Antd form object */
  formObject: PropTypes.object,
  /** Function to retrieve filled languages array from parent state */
  getFilledLanguages: PropTypes.func
}

export default LanguageForm;
