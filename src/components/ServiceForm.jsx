import React, { Component } from "react";
import { Table, Upload, Modal, Button } from "antd";

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
        <a href="#">Edit {record.name}</a>
    )
}]

class ServiceForm extends Component {
    constructor(props) {
        super(props);
        console.log(props.service);
        // let data = props.service.map(service => {
        // //    let  
        // });
    }

    render() {
        return (
            <div>
                <Table columns={columns} /> 
            </div>
        );
    }
}

export default ServiceForm;