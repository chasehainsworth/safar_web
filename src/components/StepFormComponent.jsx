import { Component } from "react";

export class StepFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // To disabled next button at the beginning.
    this.props.formObject.setFieldsValue({ ...this.props.formData });
    this.props.formObject.validateFields();
  }

  getFormObject = () => this.props.formObject;
  getFormData = () => this.props.formData;
}

export default StepFormComponent;
