import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Form, Select, Tabs, Row } from "antd";
import CheckboxGroup from "antd/lib/checkbox/Group";

const TabPane = Tabs.TabPane;
const categories = ["Health", "Education", "Legal"];
const tags = {
  "Health": ["Men", "Women", "Children"],
  "Education": ["Language", "Computer", "Entertainment", "Higher Education"]
};

class CategoriesForm extends StepFormComponent {
  state = { categories: [], tags: [] }

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
      <div>
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
        <Tabs defaultActiveKey="1" tabPosition="left" style={{ width: 400 }}>
          {
            this.state.categories.filter(cat => cat in tags).map((cat, index) => {
                return (
                  <TabPane tab={cat} key={index}>
                    <Form.Item>
                      {getFieldDecorator(cat + "Tags")(
                        <CheckboxGroup options={tags[cat]} /> 
                      )}
                    </Form.Item>
                  </TabPane>
                )
            })
          }
        </Tabs> 
      </div>
    );
  }
}

export default CategoriesForm;
