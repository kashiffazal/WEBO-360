/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button } from 'antd';
import Services from '../../services';

const FormItem = Form.Item;

class SMTPModal extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			passwordShow: false,
			loader:false,
			componentUpdate : true,

			testEmail : '',
			testEmailCheck : false,
			showTestEmailContainer : false,
			testSendLoader : false,
			emailSendStatus : false,
			smtpFormValuesHold : {}

		}//End states
		// preserve the initial state in a new object
		this.baseState = this.state;
	}//End constructor


	submitModal = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) { return; }
			if(this.state.testEmailCheck){
				this.setState({
					smtpFormValuesHold : values,
					showTestEmailContainer : true
				});
				return false;
			}//End if condition

			
			//console.log(values);
			//return false;
			this.setState({ loader: true });
			Services.http('post','smtp/post/index.php', values ).then(res => {
				//console.log(res.data);
				this.setState({ loader: false });
				if(!res){return false;}
				if(this.props.callBack){this.props.callBack();}//End if condition
				this.props.onCancel();
			});
			//console.log('Received values of form: ', values);
		});
	}//End function

	sendTest = () => {
		this.setState({testSendLoader : true});
		const postObj = {};
		postObj.email = this.state.testEmail;
		postObj.smtpDetails = this.state.smtpFormValuesHold;
		Services.http('post','smtp/post/send_test_email.php',postObj).then(res => {
			//console.log(res);
			this.setState({testSendLoader : false});
			if(!res){return false;}
			this.setState({
				emailSendStatus : true,
				showTestEmailContainer : false,
				testEmailCheck : false,
				smtpFormValuesHold : {},
			});
		});        
	}//End function

	closeModal = () => {
		const testEmailHold = this.state.testEmail;
		this.setState(this.baseState,() => {
			this.setState({testEmail : testEmailHold});
			this.props.onCancel(false);
		});
	}//End function



	render() {
		const { visible } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal 
				maskClosable={false}
				centered
				visible={(visible)}
				okText="Submit"
				onCancel={() => this.closeModal()}//End onCancel
				title="Add new SMTP detail"
				className="hide-modal-footer"
				>

				<Form onSubmit={this.submitModal}>
					<div style={{ 'display': 'none' }}><FormItem label="3rd Party Name">{getFieldDecorator('id')(<Input />)}</FormItem></div>
					<FormItem label="3rd Party Name">{getFieldDecorator('name', { rules: [{ required: true, message: 'Please add SMTP name' }] })(<Input placeholder="e.g. My new server" />)}</FormItem>
					<Row gutter={16} className="m-t-10">
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="SMTP Secure (Optional)">{getFieldDecorator('SMTPSecure')(<Input placeholder="e.g. tls" />)}</FormItem>
						</Col>
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="Host">{getFieldDecorator('host', { rules: [{ required: true, message: 'Please add server host' }] })(<Input placeholder="e.g. contect.demo.com / localhost" />)}</FormItem>
						</Col>
					</Row>
					<Row gutter={16} className="m-t-10">
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="Port">{getFieldDecorator('port', { rules: [{ required: true, message: 'Please add port number' }] })(<Input placeholder="e.g. 357" />)}</FormItem>
						</Col>
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="Custom Header Email">{getFieldDecorator('custom_header_email', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: false, message: 'Please input confirmation E-mail' }] })(<Input placeholder="new@demo.com" />)}</FormItem>
						</Col>
					</Row>
					<Row gutter={16} className="m-t-10">
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="Username">{getFieldDecorator('username', { rules: [{ required: true, message: 'Please add server username' }] })(<Input placeholder="cPanel username" />)}</FormItem>
						</Col>
						<Col lg={12} md={12} sm={24} xs={24}>
							<label className="ant-form-item-required" title="Password">
								Password &nbsp;&nbsp;
								<a href="javascript:void(0)" onClick={() => this.setState({ passwordShow: !this.state.passwordShow })}>{this.state.passwordShow ? <span className="fa fa-eye"></span> : <span className="fa fa-eye-slash"></span>}</a>
							</label>
							<FormItem>{getFieldDecorator('password', { rules: [{ required: true, message: 'Please add server password' }] })(<Input type={this.state.passwordShow ? 'text' : 'password'} placeholder="cPanel password" />)}</FormItem>
						</Col>
					</Row>
					<Row gutter={16} className="m-t-10">
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="Sender / From Name">{getFieldDecorator('fromName', { rules: [{ required: true, message: 'Please add from name' }] })(<Input placeholder="Sender Name" />)}</FormItem>
						</Col>
						<Col lg={12} md={12} sm={24} xs={24}>
							<FormItem label="Sender / From Email">{getFieldDecorator('fromEmail', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: true, message: 'Please add from email' }] })(<Input placeholder="Sender Email" />)}</FormItem>
						</Col>
					</Row>


					<div className="text-right m--24 m-t-10 p-17 p-t-10 b-t-1 b-c-gray">
						{this.state.showTestEmailContainer ? 
							<Row gutter={16}>
								<Col lg={12} md={24} sm={24} xs={24}>
									<Input type="email" disabled={this.state.testSendLoader} placeholder="Please type email address" onChange={(e) => this.setState({testEmail : e.target.value})} defaultValue={this.state.testEmail}/>
								</Col>
								<Col lg={6} md={12} sm={12} xs={24}>
									<Button loading={this.state.testSendLoader} className="w-full" onClick={() => this.sendTest()} type="primary"> Send </Button>
								</Col>
								<Col lg={6} md={12} sm={12} xs={24}>
									<Button disabled={this.state.testSendLoader} className="w-full" onClick={() => this.setState({showTestEmailContainer : false, testEmailCheck : false})}> Skip test </Button>
								</Col>
							</Row>
							:
							<span>
								{this.state.emailSendStatus && <p className="fs-11 m-t-10 float-l" style={{'coolor':'green'}}>Test email has been succsccfully sent!</p>}
								<Button onClick={() => this.closeModal()}> Cancel </Button>
								&nbsp;&nbsp;&nbsp;
								<Button htmlType="submit" onClick={() => this.setState({testEmailCheck : true})}> Test Email </Button>
								&nbsp;&nbsp;&nbsp;
								<Button htmlType="submit" type="primary" loading={this.state.loader}>Submit</Button>
							</span>
						}
					</div>


				</Form>
			</Modal> 
		);//End return
	}//End render
	componentDidUpdate(prevProps){
		if(!prevProps.visible && this.props.visible){
			if(this.props.data){
				this.props.form.setFieldsValue(this.props.data);
			}else{
				this.props.form.resetFields();
			}//End if condition
		}//End if condition
	}//End componentDidUpdate

	componentDidMount(){
    Services.http("get",'smtp/get/getTestEmail.php').then(res => {
      if(!res){return false;}
			this.setState({testEmail : res.email});
    });
	}//End componentDidMount
}//End class

export default Form.create()(SMTPModal);