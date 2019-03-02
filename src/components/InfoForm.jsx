import React from "react";
import StepFormComponent from "./StepFormComponent";
import { Upload, Icon, Modal, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { withFirebase } from "./Firebase";

const initial = "";

function errorMessage(title, content) {
  Modal.error({ title, content, centered: true });
}

class InfoForm extends StepFormComponent {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: this.props.formData.fileList ? this.props.formData.fileList : []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log("file", file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    console.log("filelist", fileList);
    this.props.formData.fileList = [...fileList];
    this.setState({ fileList: this.props.formData.fileList });
  };

  handleRemove = file => {
    if (file.originFileObj && file.originFileObj.status == "error") return true;
    const filename = file.uid + "-" + file.name;
    this.props.formData.images = this.props.formData.images.filter(
      image => image !== filename
    );
    this.props.firebase
      .imageUploads()
      .child(filename)
      .delete()
      .then(function() {
        return true;
      })
      .catch(function(error) {
        errorMessage("Error Removing image:", error.message);
        return false;
      });
  };

  firebaseUpload = file => {
    if (file.size > 2000000) {
      // Image > 2mb.
      file.status = "error";
      errorMessage(
        "Image upload error:",
        "Cannot upload an image over 2mb in size"
      );
      return false;
    }
    const filename = file.uid + "-" + file.name;
    this.props.formData.images.push(filename);
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
          file.url = downloadURL;
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

  checkImages = (rule, value, callback) => {
    console.log(this.props.formData.images);
    if (this.props.formData.images.length < 1) {
      callback("Please upload at least one image.");
    } else {
      callback();
    }
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
    const descError =
      isFieldTouched("description") && getFieldError("description");
    const hoursError = isFieldTouched("hours") && getFieldError("hours");
    const phoneError = isFieldTouched("phone") && getFieldError("phone");
    const emailError = isFieldTouched("email") && getFieldError("email");
    const imageError = this.props.formData.images.length > 0;

    const formItemLayout = {
      labelCol: { offset: 5, span: 6 },
      wrapperCol: { span: 6 }
    };

    return (
      <div>
        <Form.Item
          {...formItemLayout}
          validateStatus={orgNameError ? "error" : ""}
          help={orgNameError || ""}
          label='Organization Name'
        >
          {getFieldDecorator("orgName", {
            rules: [{ required: true, message: "Enter organization name" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          validateStatus={descError ? "error" : ""}
          {...formItemLayout}
          help={descError || ""}
          label='Description'
        >
          {getFieldDecorator("description", {
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
          label='Phone Number'
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
          label='Upload Images'
          required={true}
        >
          <div className='clearfix'>
            {getFieldDecorator("image", {
              rules: [{ validator: this.checkImages }]
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
          validateStatus={emailError ? "error" : ""}
          help={emailError || ""}
          label='Email'
        >
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "Enter email" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={hoursError ? "error" : ""}
          help={hoursError || ""}
          label='Hours'
        >
          {getFieldDecorator("hours", {
            rules: [{ required: true, message: "Enter hours" }]
          })(<Input style={{ width: 240 }} />)}
        </Form.Item>
        <Form.Item
          label='Any special notes regarding availability?'
          {...formItemLayout}
        >
          {getFieldDecorator("availabilityNote", { initialValue: initial })(
            <Input style={{ width: 240 }} />
          )}
        </Form.Item>
      </div>
    );
  }
}

export default withFirebase(InfoForm);
