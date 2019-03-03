import React, { Component } from "react";
import { Table, Modal, Form, Button, Menu, Dropdown, Icon } from "antd";
import WrappedServiceModal from "./ServiceModal";
import CustomUpload from "./CustomUpload";
import { withFirebase } from "./Firebase/FirebaseContext"

let formData = { images: [] };
const languages = ["English", "Farsi", "Arabic", "French"];

class ServiceTable extends Component {
    constructor(props) {
        super(props);
        let dataSource = {};
        let modalsVisible = {}
        if(props.service['langs']) {
            props.service['langs'].forEach( (lang, index) => {
                dataSource[lang.language] = {
                    key: index, 
                    language: lang.language,
                    name: lang.name,
                    description: lang.description,
                    hours: lang.hours 
                }

                modalsVisible[lang.language] = false;
            });
        }

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
            modalsVisible,
            previewVisible: false,
            previewImage: "",
            newLanguage: ""
        }
    }

    componentDidMount() {
        let images = this.props.service.images;
        if (images && images.length > 0) {
            images.forEach(img => {
                formData.fileList = [];
                this.props.firebase
                .imageUploads()
                .child(img)
                .getDownloadURL()
                .then(url => {
                    //rc-upload-1551154525622-2
                    let fileUid = img.slice(0, 25);
                    let fileName = img.slice(26);
                    let newFile = {
                    uid: fileUid,
                    name: fileName,
                    status: "done",
                    url: url
                    };
                    formData.fileList.push(newFile);
            })
            .catch(error => {
                // Broken link, remove the image
                const index = images.indexOf(img);
                if (index !== -1) images.splice(index, 1);
            });
            })
        }
        this.props.form.setFieldsValue({ ...formData });
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        // TODO: Remove thumburl and preview from URL
        //  console.log("file", file);
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
        });
    };

    updateFromChild = (visible, dataSource) => {
        this.setState({visible, dataSource, newLanguage: ''});
    }

    setVisible = (lang, value) => {
        let visible = this.state.visible;
        visible[lang] = value;
        this.setState({ visible });
    }
    
    handleMenuClick = e => {
       let newLanguage = e.key;
       let modalsVisible = this.state.modalsVisible;
       modalsVisible[newLanguage] = true;
       this.setState({ newLanguage, modalsVisible });
    }

    render() {
        let menu = ( 
            <Menu onClick={this.handleMenuClick}>
            {
                languages
                    .filter(lang => !Object.keys(this.state.dataSource).includes(lang))
                    .map( lang => {
                        return <Menu.Item key={lang}>{lang}</Menu.Item>
                    })
            }
            </Menu>
        )
        
        console.log(menu);

        const { previewVisible, previewImage } = this.state;
        return (
            <div>
                <Table columns={this.state.columns} dataSource={Object.values(this.state.dataSource)} /> 
                {
                    Object.keys(this.state.modalsVisible).map( (language, index) => {
                        return (
                            <div>
                                <WrappedServiceModal 
                                    // index={index}
                                    language={language}
                                    modalsVisible={this.state.modalsVisible}
                                    // onCancel={this.setVisible}
                                    data={this.state.dataSource} 
                                    serviceUid={this.props.service.id}
                                    updateParent={this.updateFromChild} 
                                />
                            </div>
                        )
                    })
                }  
                <Form>
                    <Form.Item
                    label='Upload Image'
                    >
                    <div className='clearfix'>
                        <CustomUpload 
                        onPreview={this.handlePreview} 
                        formData={formData}
                        formObject={this.props.form}
                        maxUploads={1} 
                        />
                        <Modal
                        visible={previewVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                        >
                        <img alt='example' style={{ width: "100%" }} src={previewImage} />
                        </Modal>
                    </div>
                    </Form.Item>
                </Form>

                <Dropdown overlay={menu}>
                    <Button>
                        Add New Language <Icon type="down" />
                    </Button>
                </Dropdown>
                
                {this.state.newLanguage.length > 0 && (
                    <WrappedServiceModal 
                        language={this.state.newLanguage}
                        modalsVisible={this.state.modalsVisible}
                        // onCancel={this.setVisible}
                        data={this.state.dataSource} 
                        serviceUid={this.props.service.id}
                        updateParent={this.updateFromChild} 
                    />
                )}
            </div>
        );
    }
}

const WrappedServiceTable = Form.create()(ServiceTable);
export default withFirebase(WrappedServiceTable);