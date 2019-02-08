import React, { Component } from "react";
import { Tabs } from "antd";

const TabPane = Tabs.TabPane;

class ResourcesPage extends Component {

    state = {
        resources : [
            {
                name: "TAPUAT Center",
            },
            {
                name: "Gekko Kids"
            }
        ]
    }

    render() {
        return (
            <div>
                <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                >
                    {
                        this.state.resources.map((resource, index) => {
                            return (
                                <TabPane 
                                    tab={resource.name}
                                    key={index}
                                >
                                Content
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </div>
        );
    }
}

export default ResourcesPage;