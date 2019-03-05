import React, { Component } from "react";
import { Button, Tabs, Form, Icon } from "antd";
import { withAuthorization } from "../components/Firebase";
import ServiceTable from "../components/ServiceTable";

import strings from "../constants/localization";

const TabPane = Tabs.TabPane;

class ServicesPage extends Component {
  constructor(props) {
    super(props);
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
      .services()
      .where("provider", "==", this.state.uid)
      .get()
      .then(collectionSnapshot => {
        collectionSnapshot.forEach(docSnapshot => {
          let service = {
            images: docSnapshot.data().images,
            id: docSnapshot.id
          };
          this.props.firebase
            .service(service.id)
            .collection("languages")
            .get()
            .then(langSnapshot => {
              let langs = [];
              langSnapshot.forEach(lang => {
                let langData = lang.data();
                langData["language"] = lang.id;
                langs.push(langData);
              });
              service["langs"] = langs;
            })
            .then(() => {
              this.addFilled(service);
            });
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onChange = activeKey => {
    this.setState({ activeKey });
  };

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
          title: strings.NEW_SERVICES,
          content: (
            <ServiceTable
              service={service}
              serviceKey={activeKey}
              remove={this.remove}
            />
          ),
          key: activeKey
        });
        this.setState({ panes, activeKey });
      });
  };

  findServiceName = service => {
    console.log(service);
    if (!service.langs || service.langs.length === 0) {
      return strings.SERVICE;
    } else {
      for (let lang in service.langs) {
        // TODO: Make default be localized language
        if (lang.language === "English") {
          return lang.name;
        }
      }
    }
    return service.langs[0].name;
  };

  addFilled = service => {
    const panes = this.state.panes;
    const activeKey = service.id;
    const serviceName = this.findServiceName(service);
    panes.push({
      title: serviceName,
      content: (
        <ServiceTable
          service={service}
          serviceKey={activeKey}
          remove={this.remove}
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
  }
}

const WrappedServicesPage = Form.create({ name: "services" })(ServicesPage);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WrappedServicesPage);
