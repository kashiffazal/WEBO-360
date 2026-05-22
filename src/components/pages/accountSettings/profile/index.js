import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button, Spin } from 'antd';
import UploadImage from '../../../externalComponents/andt-upload-and-crop-image-component'
import {connect} from 'react-redux';
import mapStateToProps from '../../../../store/mapStateToProps';
import mapDispatchToState from '../../../../store/action';
import Services from '../../../services';

const FormItem = Form.Item;
const Option = Select.Option;

class Profile extends Component {

    constructor(props){
        super(props);
        this.state = {loader : false, getLoader: false, profileImage : null, db_profile_img : null}
    }//End constructor
    
    submitForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({loader : true});
                let postObj = Services.post_obj(values,this.state.profileImage,'user_profile_image');
                Services.http('post','accountSettings/profile/post.php',postObj).then(res => {
                    this.setState({loader : false});
                    if(!res){return false;}
                    Services.setUserData(res.data);
                    this.props.changeStateToReducer('profile_data',res.data);
                });
            }//End if condition
        });//End form properties
    }//End function

    componentDidMount(){
        if(this.props.store_values.profile_data){
            this.props.form.setFieldsValue(this.props.store_values.profile_data);
            this.setState({db_profile_img : this.props.store_values.profileImage});
        }else{
        this.setState({getLoader : true});
            Services.http('get','accountSettings/profile/get.php').then(res => {
                this.setState({getLoader : false}, () => {
                    if(!res){return false;}
                    let data = res.data;
                    if(data.db_image){ this.setState({ db_profile_img: data.db_image }); }//End if condition
                    //Save profile image in store values before remove
                    this.props.changeStateToReducer('profileImage',data["db_image"]);
                    //Delete db_image from response in order to avoid console error
                    delete data.db_image;
                    //Save profile data in store value
                    this.props.changeStateToReducer('profile_data',data);
                    this.props.form.setFieldsValue(data);
                });
            });
        }//End if condition
    }//componentWillMount

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form className="formStyle_1 container_2" onSubmit={this.submitForm}>
                    <Spin spinning={this.state.getLoader}>
                        <React.Fragment>
                            <Row gutter={40}>
                                <Col lg={6} md={24} sm={24} xs={24}>
                                    <UploadImage 
                                        title="Upload a new image"
                                        inputFile={true}
                                        onChange={(imageFile) => this.setState({profileImage : imageFile})}
                                        imageMaxSize={100000000}
                                        acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
                                        loadImage={{ path: "", image: this.state.db_profile_img }}
                                    />
                                </Col>
                                <Col lg={18} md={24} sm={24} xs={24}>

                                    <Row gutter={20}>
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="First name">{getFieldDecorator('first_name', {rules: [{required: true, message: 'Please input first name'}],})(<Input placeholder="Please type first name"/>)}</FormItem>
                                        </Col>
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="Last name">{getFieldDecorator('last_name', {rules: [{required: true, message: 'Please input last name'}],})(<Input placeholder="Please type last name"/>)}</FormItem>
                                        </Col>
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="Gender">{getFieldDecorator('gender',{rules: [{required: false, message: 'Please select gender'}]})(
                                                <Select>
                                                    <Option value="">-Select-</Option>
                                                    <Option value="male">Male</Option>
                                                    <Option value="female">Female</Option>
                                                </Select>
                                            )}</FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={20} className="m-t-15">
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="Contact Number">{getFieldDecorator('contact_number', {rules: [{required: false, message: 'Please input contact number'}],})(<Input placeholder="Please type contact number"/>)}</FormItem>
                                        </Col>
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="Email">{getFieldDecorator('email', {rules: [{type: 'email', message: 'The input is not valid E-mail!'},{required: false, message: 'Please input email'}],})(<Input placeholder="Please type your email"/>)}</FormItem>
                                        </Col>
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="Country">{getFieldDecorator('country', {rules: [{required: false, message: 'Please input your country'}],})(<Input placeholder="Please type your country"/>)}</FormItem>
                                        </Col>
                                    </Row>

                                    <Row gutter={20} className="m-t-15">
                                        <Col lg={8} md={8} sm={24} xs={24}>
                                            <FormItem label="City/Town">{getFieldDecorator('city', {rules: [{required: false, message: 'Please input your city or town'}],})(<Input placeholder="Please type your city/town"/>)}</FormItem>
                                        </Col>
                                        <Col lg={16} md={16} sm={24} xs={24}>
                                            <FormItem label="Address">{getFieldDecorator('address', {rules: [{required: false, message: 'Please input your address'}],})(<Input placeholder="Please type your address"/>)}</FormItem>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>
                            <br/>
                            <hr className="hr-dashed"/>
                            <br/>
                            <div className="text-right">
                                <Button size="large" type="primary" htmlType="submit" loading={this.state.loader}>Save Profile</Button>
                            </div>
                        </React.Fragment>
                    </Spin>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps,mapDispatchToState)(Form.create()(Profile));