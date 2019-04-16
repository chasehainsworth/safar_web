import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Table,
  Modal,
  Form,
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Divider
} from "antd";
import WrappedServiceModal from "./ServiceModal";
import CustomUpload from "./CustomUpload";
import { withFirebase } from "./Firebase/FirebaseContext";
import strings from "../constants/localization";

let formData = { images: [] };
const languages = ["English", "Farsi", "Arabic", "French"];
const confirm = Modal.confirm;

/**
 * Contains buttons to upload an image or delete the service, and a dropdown to 
 * add a new language. Only languages which have not been added are displayed under the dropdown.
 * 
 * Beneath those is an antd Table. Each table row is a translation of the service name,
 * and service description. There are links to delete or edit a row, which will pull up a
 * [ServiceModal](/#/Components?id=servicemodal).
 * 
 * We currently have hardcoded languages of: English, Farsi, Arabic, and French.
 */
export class ServiceTable extends Component {
  constructor(props) {
    super(props);
    this.org = {};
    let dataSource = {};
    let modalsVisible = { "New Language": false };
    if (props.service["langs"]) {
      props.service["langs"].forEach((lang, index) => {
        dataSource[lang.language] = {
          key: index,
          language: lang.language,
          name: lang.name,
          description: lang.description,
          hours: lang.hours
        };
        modalsVisible[lang.language] = false;
      });
    }

    const columns = [
      {
        title: strings.LANGUAGE,
        dataIndex: "language",
        key: "language"
      },
      {
        title: strings.SERVICE_NAME,
        dataIndex: "name",
        key: "name"
      },
      {
        title: strings.SERVICE_DESCRIPTION,
        dataIndex: "description",
        key: "description"
      },
      {
        title: strings.SERVICE_HOURS,
        dataIndex: "hours",
        key: "hours"
      },
      {
        title: strings.ACTIONS,
        key: "actions",
        render: (text, record) => (
          <div>
            <button
              className='buttonLink'
              onClick={() => this.setEditLanguageVisible(record.language, true)}
            >
              {strings.EDIT}
            </button>
            <Divider type='vertical' />
            <button
              className='buttonLink'
              onClick={() => this.deleteLanguageConfirm(record.language)}
            >
              {strings.DELETE}
            </button>
          </div>
        )
      }
    ];

    this.state = {
      columns,
      dataSource,
      modalsVisible,
      newLanguage: null,
      isLoadingImage: true
    };
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
            formData.images = [fileName];
            this.setState({ isLoadingImage: false });
          })
          .catch(error => {
            // Broken link, remove the image
            const index = images.indexOf(img);
            if (index !== -1) images.splice(index, 1);
            this.setState({ isLoadingImage: false });
          });
      });
    } else {
      this.setState({ isLoadingImage: false });
    }
  }

  /**
   * Used by ServiceModal to update state. 
   * @param {object} modalsVisible 
   * @param {object} dataSource
  */
  updateFromChild = (modalsVisible, dataSource) => {
    this.setState({ modalsVisible, dataSource, newLanguage: "" });
    this.props.updateTitle(
      this.props.serviceKey,
      Object.values(this.state.dataSource)
    );
  };

  /**
   * Used by columns to pull up modal
   * @param {string} lang 
   * @param {string} value
  */
  setEditLanguageVisible = (lang, value) => {
    let modalsVisible = this.state.modalsVisible;
    modalsVisible[lang] = value;
    this.setState({ modalsVisible });
  };

  /**
   * Used by Add New Language dropdown to pull up modal
   * @param {object} e
  */
  setNewLanguageVisible = e => {
    let newLanguage = e.key;
    let modalsVisible = this.state.modalsVisible;
    modalsVisible["New Language"] = true;
    this.setState({ newLanguage, modalsVisible });
  };

  /**
   * Show a confirmation modal to delete the service. 
  */
  deleteServiceConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this service?",
      okText: "Yes",
      okType: "danger",
      onOk: () => this.props.remove(this.props.serviceKey)
    });
  };

  /**
   * Delete the translation from firebase.
   * @param {string} language 
  */
  deleteLanguageRecord = language => {
    this.props.firebase
      .serviceLanguage(this.props.service.id, language)
      .delete();

    let dataSource = this.state.dataSource;
    delete dataSource[language];
    this.setState({ dataSource });
  };

  /**
   * Show a confirmation modal to delete the language.
  */
  deleteLanguageConfirm = language => {
    confirm({
      title: `Are you sure you want to delete the ${language} record?`,
      okText: "Yes",
      okType: "danger",
      onOk: () => this.deleteLanguageRecord(language)
    });
  };

  render() {
    let menu = (
      <Menu onClick={this.setNewLanguageVisible}>
        {languages
          .filter(lang => !Object.keys(this.state.dataSource).includes(lang))
          .map(lang => {
            return <Menu.Item key={lang}>{lang}</Menu.Item>;
          })}
      </Menu>
    );
    const imageError = formData.images.length > 0;
    const { getFieldDecorator } = this.props.form;
    return this.state.isLoadingImage ? null : (
      <div>
        <Row type='flex' justify='start'>
          <Col>
            <Form layout='inline' style={{ margin: 10 }}>
              <Form.Item
                validateStatus={imageError ? "error" : ""}
                help={imageError || ""}
              >
                {getFieldDecorator("images")(
                  <CustomUpload
                    onPreview={this.handlePreview}
                    maxUploads={1}
                    formData={formData}
                    formObject={this.props.form}
                    text={true}
                    serviceId={this.props.serviceKey}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Dropdown overlay={menu}>
                  <Button>
                    {strings.ADD_NEW_LANGUAGE} <Icon type='down' />
                  </Button>
                </Dropdown>
              </Form.Item>
              <Form.Item>
                <Button type='danger' onClick={this.deleteServiceConfirm}>
                  {strings.DELETE_SERVICE}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Table
          columns={this.state.columns}
          dataSource={Object.values(this.state.dataSource)}
          pagination={false}
        />
        {Object.keys(this.state.modalsVisible).map(language => {
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
          );
        })}

        {this.state.newLanguage ? (
          <WrappedServiceModal
            language='New Language'
            modalsVisible={this.state.modalsVisible}
            data={this.state.dataSource}
            org={this.props.org}
            serviceUid={this.props.service.id}
            updateParent={this.updateFromChild}
            newLanguage={this.state.newLanguage}
          />
        ) : null}
      </div>
    );
  }
}

ServiceTable.propTypes = {
  /** The firebase instance */
  firebase: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object,
  /** Service data object */
  service: PropTypes.object,
  /** Document key of this service in the firebase Services collection */
  serviceKey: PropTypes.string,
  /** Function to remove service */
  remove: PropTypes.func,
  /** Function to update service tab title */
  updateTitle: PropTypes.func
  
}

const WrappedServiceTable = Form.create()(ServiceTable);
export default withFirebase(WrappedServiceTable);
