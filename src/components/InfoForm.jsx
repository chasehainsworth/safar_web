import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Upload, Icon, Modal, Row, Col, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withFirebase } from "./Firebase";

const initial = "";

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

  checkPhoneNumber = (rule, value, callback) => {
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
    const hoursError = isFieldTouched("hours") && getFieldError("hours");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");
    const emailError = isFieldTouched("email") && getFieldError("email");
    const imageError = isFieldTouched("image") && getFieldError("image");

    const formItemLayout = {
        labelCol: { offset: 5, span: 6 },
        wrapperCol: { span: 6 },
      };
    
    return (
      <div>
            <Form.Item
              {...formItemLayout}
              validateStatus={orgNameError ? "error" : ""}
              help={orgNameError || ""}
              label="Organization Name"
            >
              {getFieldDecorator("orgName", {
                rules: [{ required: true, message: "Enter organization name" }]
              })(<Input style={{ width: 240 }} />)}
            </Form.Item>
            <Form.Item
              validateStatus={descError ? "error" : ""}
              {...formItemLayout}
              help={descError || ""}
              label="Description"
            >
              {getFieldDecorator("desc", {
                rules: [
                  { required: true, message: "Enter organization description" }
                ]
              })(
                <TextArea
                  autosize={{ minRows: 2, maxRows: 4 }}
                  style={{ width: 240 }}
                />
              )}
            </Form.Item>
            <Form.Item
              validateStatus={phoneError ? "error" : ""}
              help={phoneError || ""}
              label="Phone Number"
              {...formItemLayout}
            >
              {getFieldDecorator("phone", {
                initialValue: "+30",
                rules: [
                  { required: true, message: "Enter phone number" },
                  { min: 9 },
                  { validator: this.checkPhoneNumber }
                ]
              })(<Input style={{ width: 240 }} />)}
            </Form.Item>
        <Form.Item
        validateStatus={imageError ? "error" : ""}
        help={imageError || ""}
        {...formItemLayout}
        label="Upload Images">
            <div>
                {getFieldDecorator("image", {
                    rules: [
                    { required: true, message: "Enter organization image" }
                    ]
                })(
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
                )}
                <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
                >
                <img alt='example' style={{ width: "100%" }} src={previewImage} />
                </Modal>
            </div>
        </Form.Item>
        <Form.Item
            {...formItemLayout}
            validateStatus = {emailError ? "error" : ""}
            help = {emailError || ""}
            label="Email">
                {getFieldDecorator("email", {
                rules: [{ required: true, message: "Enter email"}]
                })(
                <Input style={{width: 240}} />
                )}
        </Form.Item>
        <Form.Item
            {...formItemLayout}
            validateStatus = {hoursError ? "error" : ""}
            help = {hoursError || ""}
            label="Hours">
                {getFieldDecorator("hours", {
                rules: [{ required: true, message: "Enter hours"}]
                })(
                <Input style={{width: 240}} />
                )}
        </Form.Item>
        <Form.Item 
        label="Any special notes regarding availability?" 
        {...formItemLayout}>
            {getFieldDecorator("availabilityNote")(
                <Input style={{ width: 240 }} />
            )}
        </Form.Item>
      </div>
    );
  }
}

export default withFirebase(InfoForm);
