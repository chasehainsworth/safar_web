import React, { Component } from "react";
import { Button, Tabs, Form } from "antd";
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

    addBlank = () => {
        this.props.firebase
            .services()
            .add({ provider: this.state.uid })
            .then( doc => {
                const panes = this.state.panes;
                const activeKey = `${this.tabIndex++}`;
                let service = {id: doc.id };
                panes.push({ title: 'New Resource', content: <ServiceTable service={service} />, key: activeKey});
                this.setState({panes, activeKey});
            });
    }

    addFilled = service => {
        const panes = this.state.panes;
        const activeKey = `${this.tabIndex++}`;
        panes.push({ title: 'Resource', content: <ServiceTable service={service} />, key: activeKey});
        this.setState({panes, activeKey});
    }

    render() {
        return (
            <div>
                <div style={{ margin: 16 }}>
                    <Button onClick={this.addBlank}>Add New Resource</Button> 
                </div>
                <Tabs
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
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