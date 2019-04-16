import React, { Component } from "react";
import { Form, Row, Steps, Button, Spin, Modal } from "antd";
import LanguageForm from "../components/LanguageForm";
import InfoForm from "../components/InfoForm";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import SocialForm from "../components/SocialForm";
import CategoriesForm from "../components/CategoriesForm";
import PropTypes from "prop-types";

import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";
import strings from "../constants/localization";

const Step = Steps.Step;

/**
 * @param {*} fieldsError
 * @returns A filtered list of all fields that have errors.
 * @public
 */
function hasErrors(fieldsError) {
  // console.log(
  //   'Errors: ',
  //   Object.eys(fieldsError).some(field => fieldsError[field])
  // );
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * Creates an antd Modal (Error type) with an error message.
 *
 * @param {string} title
 * @param {string} content
 * @public
 */
function errorMessage(title, content) {
  Modal.error({
    title,
    content,
    centered: true
  });
}

const languageFields = new Set([
  "orgName",
  "description",
  "hours",
  "availabilityNote"
]);
let currLanguage = {};
const emptyFormData = { images: [], tags: [] };
let camp = "";
// let formData = { ...emptyFormData };

/**
 * The main page for an organization to update their information. The information
 * is entered in antd Steps, each of which is a
 * [StepFormComponent](/#/Components?id=stepformcomponent). In the first step,
 * the user chooses a language to upload the information. If they have not uploaded
 * information before, all step will be shown, otherwise only steps that have newLang
 * will be shown, since some information does not need to be entered for each language.
 *
 * The steps are wrapped by an antd Form object which keeps track of the data input
 * during each step. This data is uploaded to firebase when the user clicks done. A
 * user cannot click next to proceed to the next step until all required information
 * is filled out in the current step.
 */
export class UpdateAccountPage extends Component {
  getFilledLanguages = () => {
    return this.state.filledLanguages;
  };

  constructor(props) {
    super(props);

    let uid =
      props.location.state && props.location.state.id
        ? props.location.state.id
        : props.firebase.auth.currentUser.uid;

    this.state = {
      uid,
      currentStep: 0,
      isAnotherLang: false,
      allSteps: [],
      isLoadingData: true,
      isLoadingLang: true,
      filledLanguages: null,
      formData: { ...emptyFormData },
      disabledNext: false
      // steps: steps
    };
  }

  componentDidMount() {
    this.props.form.resetFields();
    let allSteps = [
      {
        title: strings.LANGUAGE,
        content: (
          <LanguageForm
            formData={this.state.formData}
            formObject={this.props.form}
            getFilledLanguages={this.getFilledLanguages}
          />
        ), // contents will be components with the forms
        newLang: true // if this page is necessary for setting 2nd language
      },
      {
        title: strings.INFO,
        content: (
          <InfoForm
            formData={this.state.formData}
            formObject={this.props.form}
            disableNext={this.disableNext}
          />
        ),
        newLang: true
      },
      {
        title: strings.SOCIALS,
        content: (
          <SocialForm
            formData={this.state.formData}
            formObject={this.props.form}
          />
        )
      },
      {
        title: strings.CATEGORIES,
        content: (
          <CategoriesForm
            formData={this.state.formData}
            formObject={this.props.form}
          />
        )
      },
      {
        title: strings.FINISHED,
        content: (
          <div style={{ paddingTop: "60px" }}>
            {strings.UPDATE_ACCOUNT_FINISHED_MESSAGE}
          </div>
        ),
        newLang: true
      }
    ];
    this.setState({ allSteps });
    this.props.firebase
      .provider(this.state.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          const {
            language,
            fileList,
            orgName,
            description,
            hours,
            availabilityNote,
            ...rest
          } = data;

          if (data.images && data.images.length > 0) {
            let formData = this.state.formData;
            formData.fileList = [];
            data.images.forEach(img => {
              this.props.firebase
                .imageUploads()
                .child(img)
                .getDownloadURL()
                .then(url => {
                  //rc-upload-1551154525622-2
                  let fileUid = img.slice(0, 25);
                  let fileName = img.slice(26);
                  let newFile = {
                    uid: fileUid,
                    name: fileName,
                    status: "done",
                    url: url
                  };
                  formData.fileList.push(newFile);
                  this.setState({ formData });
                })
                .catch(error => {
                  // Broken link, remove the image from the list
                  const index = data.images.indexOf(img);
                  if (index !== -1) data.images.splice(index, 1);
                });
            });
          }

          this.prepareForm(rest);
          this.autofillEmailField();
          this.breakTags();
          this.setState({ isLoadingData: false });

          this.props.firebase
            .provider(this.state.uid)
            .collection("languages")
            .get()
            .then(snapshot => {
              let langs = {};
              snapshot.forEach(doc => (langs[doc.id] = doc.data()));
              this.setState({ filledLanguages: langs, isLoadingLang: false });
            });
        } else {
          this.setState({ isLoadingData: false, isLoadingLang: false });
        }
      })
      .catch(err => {
        errorMessage(
          "Error Loading Data",
          "There was an error loading your data. Please contact the system administrator."
        );
      });
  }

  /**
   * Sets the state of the next button.
   *
   * @param {bool} value
   * @public
   */
  disableNext = value => {
    this.setState({ disabledNext: value });
  };

  /**
   * Moves to the next step.
   * @public
   */
  next() {
    const current = this.state.currentStep + 1;
    this.setState({ currentStep: current });
  }

  /**
   * Moves back to the previous step.
   * @public
   */
  prev() {
    const current = this.state.currentStep - 1;
    this.setState({ currentStep: current });
  }

  /**
   * Combines the tags from the form of checkboxes to a map of arrays to upload to firebase
   *
   * @param {Object} rest
   * @public
   */
  consolidateTags = rest => {
    let formData = this.state.formData;
    formData.tags = {};
    Object.keys(formData)
      .filter(key => key.slice(-4) === "Tags")
      .forEach(fullTag => {
        delete rest[fullTag];
        let tag = fullTag.slice(0, -4);
        formData.tags[tag] = formData[fullTag];
      });
    this.setState({ formData });
  };

  /**
   * Breaks the tags from the map of arrays in firebase into the checkboxes of the form data.
   *
   * @public
   */
  breakTags = () => {
    let formData = this.state.formData;
    Object.keys(formData.tags).forEach(cat => {
      if (formData.tags[cat] != null) {
        formData[cat + "Tags"] = [...formData.tags[cat]];
      }
    });
    delete formData.tags;
    this.setState({ formData });
  };

  /**
   * Pushes all data that _isn't_ language-specific from the formdata into firebase
   * @public
   */
  submitCompletedNonLang = () => {
    const {
      language,
      image,
      fileList,
      orgName,
      description,
      hours,
      availabilityNote,
      ...rest
    } = this.state.formData;
    this.consolidateTags(rest);
    this.props.firebase
      .provider(this.state.uid)
      .set({ ...rest, camp }, { merge: true });
  };

  /**
   * Pushes all data that _is_ language-specific from the formdata into firebase
   * @public
   */
  submitCompletedLang = () => {
    this.props.firebase
      .providerLanguage(this.state.uid, this.state.formData.language)
      .set({ ...currLanguage }, { merge: true });
  };

  /**
   * Submits inputted data, clears the language-specific fields in the formdata, and returns to step one.
   * @public
   */
  addLang() {
    if (!this.isAnotherLang) {
      this.submitCompletedNonLang();
    }
    this.submitCompletedLang();
    this.props.form.resetFields();
    this.setState({
      currentStep: 0,
      isAnotherLang: true,
      allSteps: this.state.allSteps.filter(s => s.newLang)
    });
  }

  /**
   * Fills the email input box of the form with the email of the account.
   * @public
   */
  autofillEmailField = () => {
    let formData = this.state.formData;
    if (!formData.hasOwnProperty("email")) {
      formData["email"] = this.props.firebase.auth.currentUser.email;
      this.setState({ formData });
    }
  };

  /**
   * Copies the data from the document returned by firestore into the fields of the formdata.
   * @public
   */
  prepareForm = values => {
    let formData = this.state.formData;
    for (let v in values) {
      if (languageFields.has(v)) {
        currLanguage[v] = values[v];
      }
      formData[v] = values[v];
    }
    this.setState({ formData });
  };

  /**
   * Clears the language-specific fields in the formdata.
   * @public
   */
  setTranslatableFieldsBlank = () => {
    let formData = this.state.formData;
    languageFields.forEach(field => {
      formData[field] = "";
    });
    this.setState({ formData });
  };

  /**
   * Validates and submits the inputted form data to firebase.
   * @public
   */
  handleSubmit = role => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.prepareForm(values);
      }
      if (this.state.currentStep < this.state.allSteps.length - 1) {
        if (this.state.currentStep === 0) {
          if (
            this.state.filledLanguages &&
            this.state.filledLanguages[this.state.formData.language]
          ) {
            this.prepareForm(
              this.state.filledLanguages[this.state.formData.language]
            );
          } else {
            // Old language data needs to be cleaned out here for new languages
            this.setTranslatableFieldsBlank();
          }
        } else if (this.state.currentStep === this.state.allSteps.length - 2) {
          if (!this.isAnotherLang) {
            this.submitCompletedNonLang();
          }
          this.submitCompletedLang();
        }
        this.next();
      } else {
        this.setState({
          currentStep: 0,
          isAnotherLang: true,
          allSteps: this.state.allSteps.filter(s => s.newLang)
        });
      }
    });
  };

  render() {
    const { currentStep: current } = this.state;
    const { getFieldsError } = this.props.form;
    console.log(this.state.disabledNext);
    return (
      <AuthUserContext.Consumer>
        {authUser => {
          const { uid } = this.state;
          camp = authUser.camp;
          if (!uid || uid === authUser.uid || authUser.role === ROLES.ADMIN) {
            return (
              <Form onSubmit={this.handleSubmit}>
                <Spin
                  spinning={
                    this.state.isLoadingData || this.state.isLoadingLang
                  }
                >
                  <Row style={{ margin: 20 }}>
                    <Steps current={current}>
                      {this.state.allSteps.map(item => (
                        <Step key={item.title} title={item.title} />
                      ))}
                    </Steps>
                  </Row>
                  <div className='steps-content'>
                    {!this.state.isLoadingData &&
                      !this.state.isLoadingLang &&
                      this.state.allSteps[current].content}
                  </div>
                  <div className='steps-action'>
                    {current > 0 && (
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => this.prev()}
                      >
                        {strings.PREVIOUS}
                      </Button>
                    )}
                    {current < this.state.allSteps.length - 1 && (
                      <Button
                        disabled={
                          this.state.disabledNext || hasErrors(getFieldsError())
                        }
                        type='primary'
                        onClick={() => this.handleSubmit(authUser.role)}
                      >
                        {strings.NEXT}
                      </Button>
                    )}
                    {current === this.state.allSteps.length - 1 && (
                      <Button
                        type='primary'
                        onClick={() => this.handleSubmit(authUser.role)}
                      >
                        {strings.DONE}
                      </Button>
                    )}
                  </div>
                </Spin>
              </Form>
            );
          } else {
            this.props.history.push(ROUTES.UPDATE_ACC);
          }
        }}
      </AuthUserContext.Consumer>
    );
  }
}

UpdateAccountPage.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  form: PropTypes.object,
  /** React-Router's history to redirect users. */
  history: PropTypes.object
};

const WrappedUpdateAccountPage = Form.create({ name: "update_account" })(
  UpdateAccountPage
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WrappedUpdateAccountPage);
