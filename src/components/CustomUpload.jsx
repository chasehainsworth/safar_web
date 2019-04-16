import React from "react";
import { Upload, Modal, Icon, Button } from "antd";
import { withFirebase } from "./Firebase";
import PropTypes from "prop-types";

import strings from "../constants/localization";

/**
 * Creates an antd Modal (Error type) with an error message.
 *
 * @param {string} title
 * @param {string} content
 * @public
 */
function errorMessage(title, content) {
  Modal.error({ title, content, centered: true });
}

/**
 * An extension of antd's Upload component to use uploading into Firebase storage.
 * <br>
 * _Uses deprecated ref parameter to access parent methods!_
 */
class CustomUpload extends Upload {
  constructor(props) {
    super(props);

    this.state = {
      fileList: this.props.formData.fileList ? this.props.formData.fileList : []
    };
  }

  /**
   * Updates the progress indicator of the wrapped Upload.
   *
   * @param {event} e
   * @param {file} file
   * @public
   */
  onProgress = (e, file) => {
    this.refs.uploadRef.onProgress(e, file);
  };

  /**
   * Updates the list of images in the formData when the upload is completed.
   *
   * @param {Object: {event, array, file}}
   * @public
   */
  handleChange = ({ e, fileList, file }) => {
    this.props.formData.fileList = [...fileList];
    this.props.formObject.setFieldsValue({
      images: this.props.formData.images
    });
    this.props.formObject.validateFields({ fieldNames: ["images"] });
    this.setState({ fileList: this.props.formData.fileList });
  };

  /**
   * Deletes an upload from firebase storage and removes it from the form list if successful.
   * <br>
   * Always returns false by antd's Upload design.
   *
   * @param {file} file
   * @returns false
   *
   * @public
   */
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

  /**
   * Uploads a file to firebase storage and adds it to the form list if successful.
   *
   * @param {file} file
   */
  firebaseUpload = file => {
    if (this.props.disableNext) this.props.disableNext(true);
    if (file.size > 2000000) {
      // Image > 2mb. TODO: Stop import into browser freeze.
      file.status = "error";
      errorMessage(
        "Image upload error:",
        "Cannot upload an image over 2mb in size"
      );
      if (this.props.disableNext) this.props.disableNext(false);
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
        if (this.props.disableNext) this.props.disableNext(false);
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
          if (this.props.disableNext) this.props.disableNext(false);
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
          <Icon type='upload' /> {strings.UPLOAD_IMAGE}
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

CustomUpload.propTypes = {
  /** Form data retrieved from Firebase or entered by user */
  formData: PropTypes.object,
  /** Antd form object */
  formObject: PropTypes.object,
  /** Limits the number of possible uploads. */
  maxUploads: PropTypes.number,
  /** A method to call when the image is clicked to preview it in a lightbox. */
  onPreview: PropTypes.object,
  /** Whether the CustomUpload shows the name of the uploaded image or a preview. */
  text: PropTypes.bool,
  /** The name of the service to connect the uploaded image to. */
  serviceId: PropTypes.string,
  /** A method from the parent to disable the next button until the upload is finished. */
  disableNext: PropTypes.object
};

export default withFirebase(CustomUpload);
