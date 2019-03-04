import React from "react";
import { Upload, Modal, Icon, Button } from "antd";
import { withFirebase } from "./Firebase";

function errorMessage(title, content) {
  Modal.error({ title, content, centered: true });
}

class CustomUpload extends Upload {
  constructor(props) {
    super(props);

    this.state = {
      fileList: this.props.formData.fileList ? this.props.formData.fileList : []
    };
  }

  onProgress = (e, file) => {
    this.refs.uploadRef.onProgress(e, file);
  };

  handleChange = ({ e, fileList, file }) => {
    this.props.formData.fileList = [...fileList];
    this.props.formObject.setFieldsValue({
      images: this.props.formData.images
    });
    this.props.formObject.validateFields({ fieldNames: ["images"] });
    this.setState({ fileList: this.props.formData.fileList });
  };

  handleRemove = file => {
    if (file.originFileObj && file.originFileObj.status === "error")
      return true;
    const filename = file.uid + "-" + file.name;

    this.props.formData.images = this.props.formData.images.filter(
      image => image !== filename
    );

    let del = this.props.firebase
      .imageUploads()
      .child(filename)
      .delete();

    del
      .then(() => {
        this.setState(state => {
          const index = state.fileList.indexOf(filename);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      })
      .catch(error => {
        errorMessage("Error Removing image:", error.message);
      });

    // TODO: Duplicating work in onChange, but Upload.onChange ignoring promise?
    this.props.formObject.setFieldsValue({
      images: this.props.formData.images
    });
    this.props.formObject.validateFields({ fieldNames: ["images"] });
    return del;
  };

  firebaseUpload = file => {
    if (file.size > 2000000) {
      // Image > 2mb. TODO: Stop import into browser freeze.
      file.status = "error";
      errorMessage(
        "Image upload error:",
        "Cannot upload an image over 2mb in size"
      );
      return false;
    }

    file.status = "uploading";

    const filename = file.uid + "-" + file.name;
    this.props.formData.images.push(filename);
    let uploadTask = this.props.firebase
      .imageUploads()
      .child(filename)
      .put(file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        const p = Math.floor(progress);

        this.onProgress({ percent: p }, file);
      },
      error => {
        // Handle unsuccessful uploads
        file.status = "error";
        file.response = error;

        let newFL = this.state.fileList;
        const idx = newFL.findIndex(x => x.uid === file.uid);
        newFL[idx].status = "error";
        newFL[idx]["response"] = error.message;

        this.refs.uploadRef.onChange({ file: file, fileList: newFL });
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          //console.log("File available at", downloadURL);
          file.url = downloadURL;
          file.status = "done";

          let newFL = this.state.fileList;
          const idx = newFL.findIndex(x => x.uid === file.uid);
          newFL[idx].status = "done";

          this.refs.uploadRef.onChange({ file: file, fileList: newFL });
        });
      }
    );

    // For updating image filename without Submit button
    if (this.props.text) {
      this.props.firebase
        .service(this.props.serviceId)
        .set({ images: [filename] }, { merge: true })
        .catch(e => console.log(e));
    }

    return false;
  };

  render() {
    const { fileList } = this.state;
    const textUploadButton = (
      <div>
        <Button>
          <Icon type='upload' /> Upload Image
        </Button>
      </div>
    );
    const picUploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    );

    let uploadButton = this.props.text ? textUploadButton : picUploadButton;
    let listType = this.props.text ? "text" : "picture-card";

    return (
      <Upload
        ref='uploadRef'
        accept='image/*'
        action=''
        listType={listType}
        fileList={fileList}
        onPreview={this.props.onPreview}
        onChange={this.handleChange}
        beforeUpload={this.firebaseUpload}
        onRemove={this.handleRemove}
      >
        {fileList.length >= this.props.maxUploads ? null : uploadButton}
      </Upload>
    );
  }
}

export default withFirebase(CustomUpload);
