import { Component } from "react";
import PropTypes from "prop-types";

/**
 * The base class for all Step Forms used on [UpdateAccountPage](#updateaccountpage).
 *
 * Keeps track of the overall form object and values between each step, and sets the
 * form items of the step when it is loaded on screen.
 */
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

  /**
   * Getter function
   *
   * @returns props.formObject
   * @public
   */
  getFormObject = () => this.props.formObject;

  /**
   * Getter function
   *
   * @returns props.formObject
   * @public
   */
  getFormData = () => this.props.formData;
}

StepFormComponent.propTypes = {
  /** Form data retrieved from Firebase or entered by user */
  formData: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object
};

/** @component */
export default StepFormComponent;
