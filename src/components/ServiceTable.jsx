import React, { Component } from "react";
import { Table, Modal, Form, Button, Menu, Dropdown, Icon, Row, Col } from "antd";
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
        this.props.form.validateFields();
    }

    // Firebase Image Uploading
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        // TODO: Remove thumburl and preview from URL
        //  console.log("file", file);
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
        });
    };

    checkImages = (rule, value, callback) => {
        if (formData.images.length < 1) {
        callback("Please upload at least one image.");
        } else {
        callback();
        }
    };

    handleSubmit = () => {
        console.log(this.props.service.id);
        this.props.firebase
            .service(this.props.service.id)
            .set({ images: formData.images }, { merge: true })
            .catch(e => console.log(e));
    }

    updateFromChild = (visible, dataSource) => {
        this.setState({visible, dataSource, newLanguage: ''});
    }

    // Used in columns to pull up modal
    setVisible = (lang, value) => {
        let visible = this.state.visible;
        visible[lang] = value;
        this.setState({ visible });
    }
    
    // Used by Add New Language dropdown to pull up modal
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
        const imageError = formData.images.length > 0;
        const { previewVisible, previewImage } = this.state;
        const { getFieldDecorator, getFieldError } = this.props.form;
        return (
            <div>
                <Table columns={this.state.columns} dataSource={Object.values(this.state.dataSource)} /> 
                {
                    Object.keys(this.state.modalsVisible).map( (language, index) => {
                        return (
                            <div>
                                <WrappedServiceModal 
                                    language={language}
                                    modalsVisible={this.state.modalsVisible}
                                    data={this.state.dataSource} 
                                    serviceUid={this.props.service.id}
                                    updateParent={this.updateFromChild} 
                                />
                            </div>
                        )
                    })
                }  
                <Row>
                    <Col offset={3} span={3}>
                        <Form>
                            <Form.Item
                            validateStatus={imageError ? "error" : ""}
                            help={imageError || ""}
                            label='Upload Image'
                            required={true}
                            >
                                <div className='clearfix'>
                                    {getFieldDecorator("images", {
                                    rules: [{ validator: this.checkImages }]
                                    })(
                                    <CustomUpload 
                                        onPreview={this.handlePreview} 
                                        maxUploads={1} 
                                        formData={formData}
                                        formObject={this.props.form}
                                    />)}
                                    <Modal
                                        visible={previewVisible}
                                        footer={null}
                                        onCancel={this.handleCancel}
                                    >
                                    <img alt='example' style={{ width: "100%" }} src={previewImage} />
                                    </Modal>
                                </div>
                            </Form.Item>
                            {/* <Form.Item
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
                            </Form.Item> */}
                            <Button 
                                onClick={this.handleSubmit}
                                type='primary' 
                                disabled={getFieldError("images")}>
                                Submit Image
                            </Button>
                        </Form>
                    </Col>
                    <Col span={3}>
                        <Dropdown overlay={menu}>
                            <Button>
                                Add New Language <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </Col>
                </Row>

                
                {this.state.newLanguage.length > 0 && (
                    <WrappedServiceModal 
                        language={this.state.newLanguage}
                        modalsVisible={this.state.modalsVisible}
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