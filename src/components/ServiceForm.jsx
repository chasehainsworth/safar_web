import React, { Component } from "react";
import { Table, Upload, Modal, Button } from "antd";
import WrappedServiceModalForm from "./ServiceModalForm";

class ServiceForm extends Component {
    constructor(props) {
        super(props);
        let dataSource = {};
        let visible = {};
        props.service['langs'].forEach( (lang, index) => {
            dataSource[lang.language] = {
                key: index, 
                language: lang.language,
                name: lang.name,
                description: lang.description,
                hours: lang.hours 
            }

            visible[lang.language] = false;
        });

        const columns = [{
            title: 'Language',
            dataIndex: 'language',
            key: 'language',

        }, {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        }, {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours'
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => this.setVisible(record.language, true) }>Edit {record.language}</a>
                </div>
            )
        }]

        this.state = {
            columns,
            dataSource,
            visible
        }
    }

    updateVisibleAndData = (visible, dataSource) => {
        this.setState({visible, dataSource});
    }

    setVisible = (lang, value) => {
        console.log(this.state.visible);
        console.log(lang);
        let visible = this.state.visible;
        visible[lang] = value;
        this.setState({ visible });
        console.log(this.state.visible)
    }
    
    render() {
        return (
            <div>
                <Table columns={this.state.columns} dataSource={Object.values(this.state.dataSource)} /> 
                {
                    Object.keys(this.state.visible).map( (language, index) => {
                        return (
                            <div>
                                <WrappedServiceModalForm 
                                    index={index}
                                    language={language}
                                    title={language}
                                    visible={this.state.visible}
                                    onCancel={this.setVisible}
                                    data={this.state.dataSource} 
                                    serviceUid={this.props.service.id}
                                    updateServiceTable={this.updateVisibleAndData} 
                                />
                            </div>
                        )
                    })
                }  
            </div>
        );
    }
}

export default ServiceForm;