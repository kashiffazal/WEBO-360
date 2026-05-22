import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './styles.css';

import { base64StringtoFile, extractImageFileExtensionFromBase64, image64toCanvasRef } from './ResuableUtils';
class DropzoneWithCrop extends Component {
    constructor(props) {
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
        this.fileInputRef = React.createRef();
        this.state = {
            imgSrc: null,
            crop: {
                aspect: 1 / 1.1
            }
        }
    }//End constructor

    /** Drop File with validation on size and type*/
    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > this.props.imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false
            }//End if condition 
            const acceptedFileTypesArray = this.props.acceptedFileTypes.split(",").map((item) => { return item.trim() });
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert("This file is not allowed. Only images are allowed.");
                return false
            }//End if condition
            return true
        }//End if condition
    }//End condition

    handleDrop = (files, rejectedFiles) => {
        //console.log(files);
        //console.log(rejectedFiles);
        if (rejectedFiles && rejectedFiles.length > 0) { this.verifyFile(rejectedFiles) }//End if condition
        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }//End if condition
        }//End if condition
    }//End function
    /** End Drop File with validation*/

    /** Crop Functions */
    handleOnCropComplete = (crop, pixelCrop) => {
        const canvasRef = this.imagePreviewCanvasRef.current
        const { imgSrc } = this.state
        image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
    }//End fucntion
    /** End Crop Functions */

    /** Upload file with input field*/
    handleFileSelect = event => {
        // console.log(event)
        const files = event.target.files
        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }//End if condition
        }//End if condition
    }//End function
    /** End Upload file with input field*/

    handleDownloadClick = (event) => {
        event.preventDefault()
        const { imgSrc } = this.state
        if (imgSrc) {
            if(!this.imagePreviewCanvasRef.current.attributes.width || this.imagePreviewCanvasRef.current.width <= 0){
                alert("Please select specific area to set image");
                return false;
            };
            const canvasRef = this.imagePreviewCanvasRef.current
            const { imgSrcExt } = this.state
            const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)
            const myFilename = "previewFile." + imgSrcExt
            // file to be uploaded
            const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)

            this.props.setImage(myNewCroppedFile);
            //console.log(myNewCroppedFile);
            // download file
            //downloadBase64File(imageData64, myFilename);
            //this.handleClearToDefault()
        }//End if condition
    }//End function

    handleClearToDefault = event => {
        if (event) event.preventDefault()
        const canvas = this.imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 1 / 1.2
            }
        })
        if(this.props.inputFile){this.fileInputRef.current.value = null}
    }//End function




    render() {
        const { imgSrc } = this.state;
        return (
            <div className="c_k_upload_0" style={{'margin':'-24px'}}>

                {imgSrc != null ?
                    <div style={{'padding':'24px'}}>
                        <Row gutter={30}>
                            <Col lg={6} md={6} sm={6} xs={24}>
                                <canvas className="canvasPreview" ref={this.imagePreviewCanvasRef}></canvas>
                                {   
                                    this.props.inputFile && 
                                    <div className="uploadImageInputfile">
                                        <button className="btn">Upload another image</button>
                                        <input ref={this.fileInputRef} type='file' accept={this.props.acceptedFileTypes} multiple={false} onChange={this.handleFileSelect} />
                                    </div>
                                }
                            </Col>
                            <Col lg={18} md={18} sm={18} xs={24}>
                                
                                <div className="dropzoneBoxContainer">
                                    <ReactCrop
                                        src={imgSrc}
                                        crop={this.state.crop}
                                        //onImageLoaded={(image) => console.log(image)}
                                        onComplete={this.handleOnCropComplete}
                                        onChange={(crop) => this.setState({ crop })} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                : 
                    <div className="dropzoneBoxContainer">
                        <Dropzone className="dropzoneBox" onDrop={this.handleDrop} accept={this.props.acceptedFileTypes} multiple={false} maxSize={this.props.imageMaxSize}>
                            <div className="dragDropContainer">
                                <div className="dropBoxInnerText"></div>
                                <div className="dropBoxInnerTextSecond"></div>
                            </div>
                        </Dropzone>
                    </div>
                }
                
                <div className="uploadImageModalFooter">
                    <Button size="large" className="uploadImageModalFooterBtn" disabled={imgSrc === null} onClick={this.handleClearToDefault}>Remove Image</Button>&nbsp;&nbsp;&nbsp;
                    <Button size="large" className="uploadImageModalFooterBtn" disabled={imgSrc === null} onClick={this.handleDownloadClick} type="primary">Set Image</Button>&nbsp;&nbsp;&nbsp;
                    <Button size="large" className="uploadImageModalFooterBtn" onClick={this.props.closeModal} type="primary ghost">Cancel</Button>
                </div>

                
            </div>
        );
    }
}

export default DropzoneWithCrop;