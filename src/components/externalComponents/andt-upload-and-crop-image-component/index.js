/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Modal } from 'antd';
import DropzoneWithCrop from './dropzoneWithCrop';
import './styles.css';

class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, imgSrc: null}
    }//End constructor


    setImage = (fileRef) => {
        this.setState({ visible: false,imgSrc: URL.createObjectURL(fileRef)})
        this.props.onChange(fileRef);
    }//End function


    render(){
        return(
            <div className="c_k_upload_0">
                <a href="javascript:void(0)" className="uploadImageAnchorLink" onClick={() => this.setState({visible: true})}>
                    <img 
                        className="canvasPreview profilePreview"
                        style={{border:'none', 'width': '212px','height': '236px'}}
                        src={this.state.imgSrc ? this.state.imgSrc : this.props.loadImage ? (this.props.loadImage.image ? this.props.loadImage.path+this.props.loadImage.image : this.state.imgSrc) : this.state.imgSrc}
                        alt=""
                    />
                    <div className="uploadImageInputfile"></div>
                </a>
                <Modal
                    maskClosable={false}
                    className="uploadImageModal"
                    centered
                    onCancel={() =>this.setState({ visible: false })}
                    visible={this.state.visible}
                    title={this.props.title}
                    width={1000}
                >
                    <DropzoneWithCrop closeModal={() =>this.setState({ visible: false })} setImage={(fileRef) => this.setImage(fileRef)} {...this.props}/>
                </Modal>
            </div>
        );
    }
}
export default UploadImage;