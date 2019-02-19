import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Upload, Icon, Modal, Row, Col, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withFirebase } from "./Firebase";

class InfoForm extends StepFormComponent {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    this.props.formData.fileList = fileList;
    this.setState({ fileList });
  };

  handleRemove = file => {
    const filename = file.uid + "-" + file.name;
    this.props.firebase
      .imageUploads()
      .child(filename)
      .delete()
      .then(function() {
        return true;
      })
      .catch(function(error) {
        return false;
      });
  };

  firebaseUpload = file => {
    console.log(this);
    const filename = file.uid + "-" + file.name;
    let uploadTask = this.props.firebase
      .imageUploads()
      .child(filename)
      .put(file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        file.status = "uploading";
      },
      error => {
        // Handle unsuccessful uploads
        file.status = "error";
        file.response = error;
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log("File available at", downloadURL);
          this.props.formData.fileList = [
            ...this.props.formData.fileList,
            file
          ];
          console.log(this.props.formData);
          file.status = "done";
        });
      }
    );
    return false;
  };

  checkPassword = (rule, value, callback) => {
    if (value) {
      for (const i of value) {
        if (i === "(" || i === ")" || i === " " || i === "+" || i.match(/\d/)) {
          continue;
        } else {
          callback("Phone number must be in phone number format.");
          break;
        }
      }
    }
    callback();
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    );

    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.formObject;
    const orgNameError = isFieldTouched("orgName") && getFieldError("orgName");
    const descError = isFieldTouched("desc") && getFieldError("desc");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");

    return (
      <div>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Organization Name: </Col>
          <Col>
            <Form.Item
              validateStatus={orgNameError ? "error" : ""}
              help={orgNameError || ""}
            >
              {getFieldDecorator("orgName", {
                rules: [{ required: true, message: "Enter organization name" }]
              })(<Input style={{ width: 120 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Description: </Col>
          <Col>
            <Form.Item
              validateStatus={descError ? "error" : ""}
              help={descError || ""}
            >
              {getFieldDecorator("desc", {
                rules: [
                  { required: true, message: "Enter organization description" }
                ]
              })(
                <TextArea
                  autosize={{ minRows: 2, maxRows: 4 }}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Phone Number: </Col>
          <Col>
            <Form.Item
              validateStatus={phoneError ? "error" : ""}
              help={phoneError || ""}
            >
              {getFieldDecorator("phone", {
                initialValue: "+30",
                rules: [
                  { required: true, message: "Enter phone number" },
                  { min: 10 },
                  { validator: this.checkPassword }
                ]
              })(<Input style={{ width: 120 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <div>
          <Upload
            accept='image/*'
            action=''
            listType='picture-card'
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            beforeUpload={this.firebaseUpload}
            onRemove={this.handleRemove}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt='example' style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </div>
        <Row type='flex' justify='start' gutter={32} className='spaced'>
          <Col offset={10}>Hours: </Col>
          <Col>
            <Form.Item />
          </Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>Any special notes regarding availability?</Col>
        </Row>
        <Row type='flex' justify='start' gutter={32}>
          <Col offset={10}>
            <Form.Item>
              <Input style={{ width: 120 }} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withFirebase(InfoForm);
