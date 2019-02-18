import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Form, Select } from "antd";

const categories = ["Health", "Education", "Legal"];

class CategoriesForm extends StepFormComponent {
  state = { categories: [] };

  handleCatChange(values) {
    this.setState({ categories: [...values] });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.getFormObject();

    const noCatError =
      isFieldTouched("categories") && getFieldError("categories");
    return (
      <Form.Item
        validateStatus={noCatError ? "error" : ""}
        help={noCatError || ""}
      >
        {getFieldDecorator("categories", {
          rules: [{ required: true }]
        })(
          <Select
            mode='multiple'
            style={{ width: 300 }}
            placeholder='Choose Categories'
            onChange={this.handleCatChange.bind(this)}
          >
            {categories.map(cat => (
              <Select.Option key={cat}>{cat}</Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }
}

export default CategoriesForm;
