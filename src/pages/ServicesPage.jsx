import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Tabs, Form, Icon } from "antd";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import ServiceTable from "../components/ServiceTable";

import strings from "../constants/localization";
import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";

const TabPane = Tabs.TabPane;

/**
 * The page for an organization to view and update their services. Each service
 * is associated with an antd Tab, which contains a [ServiceTable](/#/Components?id=servicetable).
 * New tabs can be added by clicking the "Add New Service" button. All existing services
 * will be loaded from firebase when the components loads. 
 */
export class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.org = {};
    this.tabIndex = -1;
    const panes = [];
    const uid =
      props.location.state && props.location.state.id
        ? props.location.state.id
        : props.firebase.auth.currentUser.uid;
    this.state = {
      activeKey: "-1",
      panes,
      uid,
      loadingLangs: true
    };
  }

  componentDidMount() {
    this.props.firebase
      .provider(this.state.uid)
      .get()
      .then(doc => {
        doc.ref
          .collection("languages")
          .get()
          .then(orgLangSnapshot => {
            let langs = {};
            orgLangSnapshot.forEach(orgLangDoc => {
              let langData = orgLangDoc.data();
              langs[orgLangDoc.id] = langData;
            });
            this.org["langs"] = langs;
          })
        });
    this.props.firebase
      .services()
      .where("provider", "==", this.state.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let service = {
            images: doc.data().images,
            hours: doc.data().hours,
            id: doc.id
          };
          this.props.firebase
            .service(service.id)
            .collection("languages")
            .get()
            .then(serviceLangSnapshot => {
              let langs = [];
              serviceLangSnapshot.forEach(serviceLangDoc => {
                let langData = serviceLangDoc.data();
                langData["language"] = serviceLangDoc.id;
                langs.push(langData);
              });
              service["langs"] = langs;
            })
            .then(() => {
              this.addFilled(service);
            });
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * Sets the state of the activeKey. This changes the tab in view.
   *
   * @param {string} activeKey
   * @public
   */
  onChange = activeKey => {
    this.setState({ activeKey });
  };

  /**
   * Refreshes the title of a tab. 
   *
   * @param {string} targetKey
   * @param {string} langs
   * @public
   */
  updateTitle = (targetKey, langs) => {
    const panes = this.state.panes;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        pane.title = this.findServiceName(langs);
      }
    });
    this.setState({panes});
  }

  /**
   * Removes a service. Works by finding the index of tab prior to this one, 
   * deleting the service from firebase, and setting the activeKey as the prior tab.
   *
   * @param {string} targetKey
   * @public
   */
  remove = targetKey => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
        // this.props.firebase.service(pane.key).collection("languages").delete();
        this.props.firebase.service(pane.key).delete();
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  /**
   * Adds a blank service. Creates a document in firebase and associates the 
   * [ServiceTable](/#/Components?id=servicetable) with the document id.
   *
   * @public
   */
  addBlank = () => {
    this.props.firebase
      .services()
      .add({ provider: this.state.uid })
      .then(doc => {
        const panes = this.state.panes;
        const activeKey = doc.id;
        let service = { id: doc.id };
        panes.push({
          title: strings.NEW_SERVICE,
          content: (
            <ServiceTable
              service={service}
              org={this.org}
              serviceKey={activeKey}
              remove={this.remove}
              updateTitle={this.updateTitle}
            />
          ),
          key: activeKey
        });
        this.setState({ panes, activeKey });
      });
  };

  /**
   * Finds the service name. Prefers English, but will choose the first language's version otherwise.
   * Returns default string "Service" if no languages exist. 
   *
   * @param {array} langs
   * @returns {string}
   * @public
   */
  findServiceName = langs => {
    if (!langs || langs.length === 0) {
      return strings.SERVICE;
    } else {
      for (let lang in langs) {
        if (lang.language === "English") {
          return lang.name;
        }
      }
    }
    return langs[0].name;
  };

  /**
   * Adds an existing service retrieved from firebase to a tab.
   *
   * @param {object} service
   * @public
   */
  addFilled = service => {
    const panes = this.state.panes;
    const activeKey = service.id;
    const serviceName = this.findServiceName(service.langs);
    panes.push({
      title: serviceName,
      content: (
        <ServiceTable
          service={service}
          org={this.org}
          serviceKey={activeKey}
          remove={this.remove}
          updateTitle={this.updateTitle}
        />
      ),
      key: activeKey
    });
    this.setState({ panes, activeKey });
  };

  render() {
    const newServiceButton = (
      <div style={{ marginRight: 33 }}>
        <Button type='primary' onClick={this.addBlank}>
          <Icon type='plus' />
          {strings.ADD_NEW_SERVICE}
        </Button>
      </div>
    );

    return (
      <AuthUserContext.Consumer>
        {authUser => {
          const { uid } = this.state;
          if (!uid || uid === authUser.uid || authUser.role === ROLES.ADMIN) {
            return (
              <div className='card-container'>
                <Tabs
                  onChange={this.onChange}
                  activeKey={this.state.activeKey}
                  tabBarExtraContent={newServiceButton}
                  type='card'
                >
                  {this.state.panes.map(pane => {
                    return (
                      <TabPane tab={pane.title} key={pane.key}>
                        {pane.content}
                      </TabPane>
                    );
                  })}
                </Tabs>
              </div>
            );
          } else {
              this.props.history.push(ROUTES.SERVICES);
          }
        }
      }
    </AuthUserContext.Consumer>
    );
  }
}

ServicesPage.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object,
  /** React-Router's history to redirect users. */
  history: PropTypes.object,
  /** React-Routers location to keep track of page moves. */
  location: PropTypes.object
}

const WrappedServicesPage = Form.create({ name: "services" })(ServicesPage);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WrappedServicesPage);
