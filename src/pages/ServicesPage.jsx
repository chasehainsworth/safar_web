import React, { Component } from "react";
import { Button, Tabs, Form, Icon } from "antd";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import ServiceTable from "../components/ServiceTable";

const TabPane = Tabs.TabPane;

class ServicesPage extends Component {

    constructor(props) {
        super(props);
        this.tabIndex = -1;
        const panes = [];
        const data = [];
        const uid = props.firebase.auth.currentUser.uid;
        this.state = {
            activeKey: '-1',
            panes,
            data,
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
                    let service = { images: docSnapshot.data().images, id: docSnapshot.id }
                    this.props.firebase
                        .service(service.id)
                        .collection("languages")
                        .get()
                        .then(langSnapshot => {
                            let langs = [];
                            langSnapshot.forEach(lang => {
                                let langData = lang.data();
                                langData['language'] = lang.id;
                                langs.push(langData);
                            });
                            service['langs'] = langs;
                        })
                        .then( () => {
                            this.setState({ data: [...this.state.data, service]});
                            this.addFilled(service);
                        })
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    onChange = activeKey => {
        this.setState({ activeKey });
    }

    remove = targetKey => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
            this.props.firebase
                .service(pane.key)
                .delete()
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
    }

    addBlank = () => {
        this.props.firebase
            .services()
            .add({ provider: this.state.uid })
            .then( doc => {
                const panes = this.state.panes;
                const activeKey = doc.id;
                let service = {id: doc.id };
                panes.push({ 
                    title: 'New Service', 
                    content: <ServiceTable service={service} serviceKey={activeKey} remove={this.remove} />, 
                    key: activeKey});
                this.setState({panes, activeKey});
            });
    }

    addFilled = service => {
        const panes = this.state.panes;
        const activeKey = service.id;
        panes.push({ title: 'Service', content: <ServiceTable service={service} serviceKey={activeKey} remove={this.remove} />, key: activeKey});
        this.setState({panes, activeKey});
    }

    render() {
        const newServiceButton = (
            <div style={{marginRight: 33}}>
                <Button type="primary" onClick={this.addBlank}><Icon type="plus" />Add New Service</Button>
            </div> )

        return (
            <div className="card-container">
                <Tabs
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    tabBarExtraContent={newServiceButton}
                    type="card"
                >
                    {
                        this.state.panes.map(pane => {
                            return (
                                <TabPane 
                                    tab={pane.title}
                                    key={pane.key}
                                >
                                {pane.content}
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </div>
        );
    }
}

const WrappedServicesPage = Form.create({ name: "services" })(
    ServicesPage
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WrappedServicesPage);