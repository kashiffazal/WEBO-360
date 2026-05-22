import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import Services from '../../services'
import './styles.css';

const FormItem = Form.Item;

class SessionExpiredLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: false };
  }//End constructor

	submitForm = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) { return false; }
			this.setState({loader : true});
      Services.http('post','login/index.php',values).then(res => {
				this.setState({loader : false});
        if(res){
					Services.setUserData(res.data);
					window.sessionExpire = false;
					window.location.reload();
        }//End if condition
      });
		});//End form properties
	}//End function

	render() {
		const { getFieldDecorator } = this.props.form;
		const data = this.props;
		return (
			<div className="l_c">
				{data.show &&
					<div className="container">

						<Form className="form form-style-1" onSubmit={this.submitForm}>
							<div className="content">
								<h1 className="m-0">Session expire</h1>
								<p className="m-0">Your session has expired. Please login again to continue working.</p>
							</div>
							<FormItem label="Username" hasFeedback>{getFieldDecorator('username', {rules: [{required: true, message: 'Please input your username'}],})(<Input placeholder="Please type username"/>)}</FormItem>	
							<FormItem label="Password" hasFeedback>{getFieldDecorator('password', {rules: [{required: true, message: 'Please input your password'}],})(<Input placeholder="Please type password" type="password"/>)}</FormItem>
							<hr className="hr"/><br/>
							<div className="text-right">
								<Button className="abtn-primary w-full" type="primary" size="large" htmlType="submit" loading={this.state.loader}>Login</Button>
							</div>
						</Form>

					</div>
				}
			</div>
		);//End return
	}//End render
}//End class

export default Form.create()(SessionExpiredLoginScreen);