import React from "react";
import PropTypes from 'prop-types';
import StepFormComponent from "./StepFormComponent";
import { Form, Select, Row, Col, Checkbox, Divider } from "antd";
import CheckboxGroup from "antd/lib/checkbox/Group";

const categories = ["Health", "Education", "Entertainment", "Legal"];
const tags = {
  Health: [
    "Pregnancy",
    "Dental",
    "Emergency",
    "Shots/Vaccines",
    "Hospitals/Clinics",
    "General",
    "Specialized",
    "Hygiene"
  ],
  Education: [
    "Computer",
    "Language",
    "Child Education",
    "Adult Education",
    "Writing",
    "Health"
  ],
  Entertainment: ["Sports", "Art", "Community Center", "Cooking", "Music"],
  Legal: [
    "Children's Rights",
    "Domestic Violence",
    "Family",
    "Single Males",
    "Protection",
    "Asylum"
  ]
};
const initial = null;

/**
 * Form with a multi-select categories dropdown, with at least one required category. For each selected category, a row
 * will appear with checkboxes for each subcategory.
 * 
 * The hardcoded categories and subcategories are:
 * * Health: Pregnancy, Dental, Emergency, Shots/Vaccines, Hospitals/Clinics, General, Specialized, Hygiene
 * * Education: Computer, Language, Child Education, Adult Education, Writing, Health
 * * Legal: Sports, Art, Community Center, Cooking, Music
 * * Entertainment: Children's Rights, Domestic Violence, Family, Single Males, Protection, Asylum
 */
class CategoriesForm extends StepFormComponent {

  constructor(props) {
    super(props);

    this.state = {
      categories: props.formData.categories
        ? [...props.formData.categories]
        : [],
      tags: []
    };
  }

  /**
 * Sets categories in state to update rows displayed.
 *
 * @param {array} values
 * @public
 */
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
          labelCol={{span: 11, textAlign: "right"}}
          wrapperCol={{span: 5, offset: 1}}
          label="Choose Categories"
        >
          {getFieldDecorator("categories", {
            rules: [{ required: true, message: "Select 1 or more categories" }]
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
        {this.state.categories
          .map((cat, index) => {
            return (
              <Row>
                <Col span={6} style={{fontWeight: "bold"}}>
                  {cat}
                </Col>
                <Col span={18} style={{textAlign: "left"}}>
                  <Form.Item>
                    {getFieldDecorator(cat + "Tags", { initialValue: initial })(
                      <CheckboxGroup style={{width: "100%"}}>
                        {tags[cat].map(tag => <Col span={8}><Checkbox value={tag}>{tag}</Checkbox></Col>)}
                      </CheckboxGroup>
                    )}
                  </Form.Item>
                </Col>
                {index !== this.state.categories.length - 1 && (<Divider />) }
              </Row>

            );
          })}
      </div>
    );
  }
}

CategoriesForm.propTypes = {
  /** Form data retrieved from Firebase or entered by user */
  formData: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object
}

export default CategoriesForm;
