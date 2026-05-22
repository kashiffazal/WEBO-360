import React, { Component } from 'react';
import { Upload, Progress } from 'antd';
import './styles.less';

const { Dragger } = Upload;

class UploadFile extends Component {
  state = {
    fileList: [],
    extensionError : false
  };

  checkFileTypes = (selectedFile) => {
    var fileTypeProvided = this.props.restrictExtension;
    if(fileTypeProvided){
      //Split all types into array
      fileTypeProvided = fileTypeProvided.split(',');
      fileTypeProvided.unshift("-");//For cover 0 index for indexOf method
      //Getting selected file type
      var selectedExtension = selectedFile.name.split('.').pop();
      return (fileTypeProvided.indexOf(selectedExtension) >= 0 ? true : false);
    }else{return true}//End if condition
  }//End function


  render() {
    const pr = this.props;
    const { fileList } = this.state;
    const props = {
      accept : pr.accept,
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          this.props.onChange(newFileList);
          return {fileList: newFileList};
        });
      },
      beforeUpload: file => {

        //Checking for provided types
        if(this.checkFileTypes(file)){
          this.setState({extensionError : false});
          var files = this.state.fileList;
          if(pr.multiple){
            files.push(file);
          }else{
            files = [file];
          }//End if condition
          this.setState({fileList : files}, () => {
            this.props.onChange(this.state.fileList);
          });
        }else{
          this.setState({extensionError : true},() => {
            props.onRemove(file);
            this.props.onChange(null);
          });
        }//End if condition
        return false;
      },
      fileList,
    };

    return (
      <div className="c_fileUploaderContainer">
        <div className={pr.loader ? "dragDropContainer fileNameAfterLoader "+pr.className : "dragDropContainer "+pr.className}>
          <Dragger {...props} disabled={pr.disabled ? true : false}>
            <div className="dragDropContentContainer">
              <div className="bg_img"></div>
              <div className="content">
                <h3>Click or, drag and drop a file containing them here</h3>
                <p className={fileList.length >= 1 ? "hidePara" : ""}>Select it from your computer instead...</p>
                {pr.loader && <Progress percent={pr.progress} size="small" status={pr.progress < 100 ? 'active' : 'success'}/>}
                {this.state.extensionError && <p className="extensionError">Required file format ({this.props.restrictExtension})</p>}
              </div>
            </div>
          </Dragger>
        </div>
      </div>
    );//End return
  }//End render
}//End class

export default UploadFile;