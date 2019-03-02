import React, { Component } from "react";
import { Table, Upload, Modal, Button } from "antd";
import WrappedServiceModalForm from "./ServiceModalForm";

class ServiceForm extends Component {
    constructor(props) {
        super(props);
        let dataSource = [];
        let visible = [];
        props.service['langs'].forEach( (lang, index) => {
            dataSource.push({ 
                key: index, 
                language: lang.language,
                name: lang.name,
                description: lang.description,
                hours: lang.hours 
            })
            visible.push(false);
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
                    <a onClick={() => this.setVisible(record.key, true) }>Edit {record.language}</a>
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

    setVisible = (key, value) => {
        let visible = [...this.state.visible];
        visible[key] = value;
        this.setState({ visible });
    }
    
    render() {
        return (
            <div>
                <Table columns={this.state.columns} dataSource={this.state.dataSource} /> 
                {
                    this.state.visible.map( (visible, index) => {
                        return (
                        // <Modal
                        //     key={index}
                        //     title={`Edit ${this.state.dataSource[index].language}`}
                        //     visible={visible}
                        //     onCancel={() => this.setVisible(index, false)}
                        // >
                        <WrappedServiceModalForm 
                            index={index}
                            title={`${this.state.dataSource[index].language}`}
                            visible={this.state.visible}
                            onCancel={this.setVisible}
                            data={this.state.dataSource} 
                            serviceUid={this.props.service.id}
                            updateServiceTable={this.updateVisibleAndData} 
                        />
                        // </Modal>
                        )
                    })
                }  
            </div>
        );
    }
}

export default ServiceForm;