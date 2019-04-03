import React, { Component } from "react";
import { Button, Tabs, Form, Icon } from "antd";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import ServiceTable from "../components/ServiceTable";

import strings from "../constants/localization";
import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";

const TabPane = Tabs.TabPane;

class ServicesPage extends Component {
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
              // langData["language"] = orgLangDoc.id;
              langs[orgLangDoc.id] = langData;
            });
            this.org["langs"] = langs;
          })
        });
        console.log(this.org);
    this.props.firebase
      .services()
      .where("provider", "==", this.state.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let service = {
            images: doc.data().images,
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

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  updateTitle = (targetKey, langs) => {
    const panes = this.state.panes;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        pane.title = this.findServiceName(langs);
      }
    });
    this.setState({panes});
  }

  remove = targetKey => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
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

  findServiceName = langs => {
    console.log(langs);
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

const WrappedServicesPage = Form.create({ name: "services" })(ServicesPage);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WrappedServicesPage);
