import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Input, Row, Col, Button } from 'antd';
import Services from '../../../services';

const FormItem = Form.Item;

class ResetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            confirmDirty: false,
            loader : false
        };
    }//End constructor

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }//End function

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('new_password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else { callback(); }
    }//End function

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) { form.validateFields(['confirm_password'], { force: true }); }
        callback();
    }//End function


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                this.setState({loader : true});
                Services.http('post',"accountSettings/resetPassword/index.php",values).then(res => {
                    this.setState({loader : false} , () => {
                        if(res.incorrectPassword){
                            this.setState({errorMsg : res.incorrectPassword});
                            return false;
                        }else{
                           this.props.form.resetFields();
                            this.setState({errorMsg : ''});
                            this.props.history.push(process.env.PUBLIC_URL+'/login');
                            localStorage.removeItem(window.appLocalStorage);
                        }//End if condition
                    });
                });

            }//End if condition
        });
    }//End function


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <hr className="hr-dashed"/>
                <br/>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col lg={2} md={2} sm={24} xs={24}></Col>
                        <Col lg={16} md={16} sm={24} xs={24}>

                            <Row>
                                <Col lg={8} md={8} sm={24} xs={24} className="resetPasswordFormLable requiredStarik">
                                    Current Password :
                                </Col>
                                <Col lg={16} md={16} sm={24} xs={24}>
                                    <FormItem>{getFieldDecorator('current_password', { rules: [{ required: true, message: 'Please input your current password!' }], })(<Input.Password placeholder="Please type current password" />)}</FormItem>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={8} md={8} sm={24} xs={24} className="resetPasswordFormLable requiredStarik">
                                    New Password :
                                </Col>
                                <Col lg={16} md={16} sm={24} xs={24}>
                                    <FormItem>{getFieldDecorator('new_password', { rules: [{ required: true, message: 'Please input new password!' }, { validator: this.validateToNextPassword }], })(<Input.Password placeholder="Please type new password" />)}</FormItem>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={8} md={8} sm={24} xs={24} className="resetPasswordFormLable requiredStarik">
                                    Confirm Password :
                                </Col>
                                <Col lg={16} md={16} sm={24} xs={24}>
                                    <FormItem>{getFieldDecorator('confirm_password', { rules: [{ required: true, message: 'Please confirm your password!' }, { validator: this.compareToFirstPassword }], })(<Input.Password onBlur={this.handleConfirmBlur} placeholder="Please type confirm password" />)}</FormItem>
                                </Col>
                            </Row>
                            <br />
                            <div className="text-right">
                                <span className="resetPasswordError">{this.state.errorMsg}</span><Button type="primary" htmlType="submit">Reset Password</Button>
                            </div>

                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}></Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(withRouter(ResetPassword));