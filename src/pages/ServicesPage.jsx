import React, { Component } from "react";
import { Button, Tabs } from "antd";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import ServiceForm from "../components/ServiceForm";

const TabPane = Tabs.TabPane;

class ServicesPage extends Component {

    constructor(props) {
        super(props);
        this.tabIndex = -1;
        const panes = [];
        const data = [];
        const uid = props.firebase.auth.currentUser.uid;
        console.log(uid);
        this.state = {
            activeKey: '-1',
            panes,
            data,
        };
    }

    componentDidMount = () => {
        this.props.firebase
            .services()
            .where("provider", "==", "Red Cross")
            .get()
            .then(snapshot => {
                snapshot.forEach(service => {
                    console.log(service);
                    const data = service.data();
                    let curr = { image: data.image }
                    this.props.firebase
                        .service(service.id)
                        .collection("languages")
                        .get()
                        .then(langSnapshot => {
                            let langs = {};
                            langSnapshot.forEach(lang => (langs[lang.id] = lang.data()));
                            curr['langs'] = langs;
                        })
                    this.setState({ data: [...this.state.data, curr]});
                    this.addFilled(curr);
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
        const panes = this.state.panes;
        const activeKey = `${this.tabIndex++}`;
        panes.push({ title: 'New Resource', content: <ServiceForm service={''} />, key: activeKey});
        this.setState({panes, activeKey});
    }

    addFilled = service => {
        const panes = this.state.panes;
        const activeKey = `${this.tabIndex++}`;
        panes.push({ title: 'Resource', content: <ServiceForm service={service} />, key: activeKey});
        console.log(panes);
        this.setState({panes, activeKey});
    }

    render() {
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ServicesPage);