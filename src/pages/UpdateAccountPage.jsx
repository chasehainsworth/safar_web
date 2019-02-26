import React, { Component } from "react";
import { Form, Row, Steps, Button } from "antd";
import LanguageForm from "../components/LanguageForm";
import InfoForm from "../components/InfoForm";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import SocialForm from "../components/SocialForm";
import CategoriesForm from "../components/CategoriesForm";

import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";

const Step = Steps.Step;

function hasErrors(fieldsError) {
  // console.log(
  //   "Errors: ",
  //   Object.keys(fieldsError).some(field => fieldsError[field])
  // );
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

let formData = {};

class UpdateAccountPage extends Component {
  steps = [
    {
      title: "Language",
      content: (
        <LanguageForm formData={formData} formObject={this.props.form} />
      ), // contents will be components with the forms
      newLang: true // if this page is necessary for setting 2nd language
    },
    {
      title: "Info",
      content: <InfoForm formData={formData} formObject={this.props.form} />,
      newLang: true
    },
    {
      title: "Socials",
      content: <SocialForm formData={formData} formObject={this.props.form} />
    },
    {
      title: "Categories",
      content: (
        <CategoriesForm formData={formData} formObject={this.props.form} />
      )
    },
    {
      title: "Finished",
      content: (
        <div style={{ paddingTop: "60px" }}>
          You're all done. Please try to fill out your information in as many
          languages as possible.
        </div>
      ),
      newLang: true
    }
  ];

  state = {
    currentStep: 0,
    isAnotherLang: false,
    allSteps: this.steps
  };

  next() {
    const current = this.state.currentStep + 1;
    this.setState({ currentStep: current });
  }

  prev() {
    const current = this.state.currentStep - 1;
    this.setState({ currentStep: current });
  }

  addLang() {
    // TODO: submit formData to db here
    console.log(formData);
    this.setState({
      currentStep: 0,
      isAnotherLang: true,
      allSteps: this.steps.filter(s => s.newLang)
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let v in values) {
          formData[v] = values[v];
        }
        if (this.state.currentStep < this.state.allSteps.length - 1) {
          this.next();
        } else {
          // TODO: currently submits data by each field name to
          //       a collection named by the user's uid.
          //       Assumes 1 user per provider. Could name by provider instead?
          console.log(formData);
          this.props.firebase
            .provider(this.props.firebase.auth.currentUser.uid)
            .set({ ...formData }, { merge: true });
          console.log(formData);
        }
      }
    });
  };

  render() {
    const { currentStep: current } = this.state;

    const { getFieldsError } = this.props.form;

    const uid = this.props.match.params.id;

    return (
      <AuthUserContext.Consumer>
        {authUser => {
          if (!uid || uid === authUser.uid || authUser.role === ROLES.ADMIN) {
            return (
              <Form onSubmit={this.handleSubmit}>
                <Row style={{ margin: 20 }}>
                  <Steps current={current}>
                    {this.state.allSteps.map(item => (
                      <Step key={item.title} title={item.title} />
                    ))}
                  </Steps>
                </Row>
                <div className='steps-content'>
                  {this.state.allSteps[current].content}
                </div>
                <div className='steps-action'>
                  {// TODO: this will disable next button if any form data not valid.
                  // change to each page.
                  // TODO: button enabled on second language pass.
                  current < this.state.allSteps.length - 1 && (
                    <Button
                      disabled={hasErrors(getFieldsError())}
                      type='primary'
                      htmlType='submit'
                    >
                      Next
                    </Button>
                  )}
                  {current === this.state.allSteps.length - 1 && (
                    <Button htmlType='submit' type='primary'>
                      Done
                    </Button>
                  )}
                  {current === this.state.allSteps.length - 1 && (
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => this.addLang()}
                      type='primary'
                    >
                      Add another language
                    </Button>
                  )}
                  {current > 0 && (
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => this.prev()}
                    >
                      Previous
                    </Button>
                  )}
                </div>
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

const WrappedUpdateAccountPage = Form.create({ name: "update_account" })(
  UpdateAccountPage
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WrappedUpdateAccountPage);
