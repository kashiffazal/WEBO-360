import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, Spin } from 'antd';
import Services from '../../../services';
import { connect } from 'react-redux';
import mapStateToProps from '../../../../store/mapStateToProps';
import mapDispatchToState from '../../../../store/action';


const FormItem = Form.Item;

class CampaignEmails extends Component {
    constructor(props) {
        super(props);
        this.state = { loader: false, getLoader: false }
    }//End constructor


    submitForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loader: true });
                Services.http('post', 'accountSettings/confirmationEmails/post.php', values).then(res => {
                    this.setState({ loader: false });
                    if (!res) { return false; }
                    this.props.changeStateToReducer('campaignProfileData', values);
                });
            }//End if condition
        });//End form properties
    }//End function



    componentDidMount() {
        if (this.props.store_values.campaignProfileData) {
            this.props.form.setFieldsValue(this.props.store_values.campaignProfileData);
        } else {
            this.setState({ getLoader: true });
            Services.http('get', 'accountSettings/confirmationEmails/get.php').then(res => {
                this.setState({ getLoader: false });
                if (!res) { return false; }
                //Save data in store value
                this.props.changeStateToReducer('campaignProfileData', res.data);
                this.props.form.setFieldsValue(res.data);
            });
        }//End if condition
    }//componentDidMount




    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form className="formStyle_1 container_2" onSubmit={this.submitForm}>
                    <Spin spinning={this.state.getLoader}>

                        <React.Fragment>
                            <Row gutter={40}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="From Name">{getFieldDecorator('fromName', { rules: [{ required: true, message: 'Please input from name' }], })(<Input placeholder="Please type from name" />)}</FormItem>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="From Email">{getFieldDecorator('fromEmail', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: false, message: 'Please input from email' }], })(<Input placeholder="Please type from email" />)}</FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40} className="m-t-15">
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="Reply-to Name">{getFieldDecorator('replayToName', { rules: [{ required: true, message: 'Please input reply to name' }], })(<Input placeholder="Please type reply to name" />)}</FormItem>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="Reply-to Email">{getFieldDecorator('replayToEmail', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: false, message: 'Please input reply to email' }], })(<Input placeholder="Please type reply to email" />)}</FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40} className="m-t-15">
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="Test Email">{getFieldDecorator('testEmail', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: false, message: 'Please input test email' }], })(<Input placeholder="Please type test email" />)}</FormItem>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="Confirmation Email">{getFieldDecorator('confirmationEmail', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: false, message: 'Please input confirmation email' }], })(<Input placeholder="Please type confirmation email" />)}</FormItem>
                                </Col>
                            </Row>
                            <br />
                            <hr className="hr-dashed" />
                            <br />
                            <div className="text-right">
                                <Button size="large" type="primary" htmlType="submit" loading={this.state.loader}>Save</Button>
                            </div>
                        </React.Fragment>
                    </Spin>

                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Form.create()(CampaignEmails));