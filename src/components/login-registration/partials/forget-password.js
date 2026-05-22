/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import mapStateToProps from '../../../store/mapStateToProps';
import Services from '../../services';

const FormItem = Form.Item;

class ForgetPassword extends Component {
	
	state = { loader: false};

	handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err){return false}//End if condition
			this.setState({loader : true});
      Services.http('post','login/forget-password.php',values).then(res => {
        this.setState({loader : false});
      });
		});//End form properties
	}//End handleSubmit


	render() {
    const store_value = this.props.store_values.application_data;
    const { getFieldDecorator } = this.props.form;
    const props = this.props;
		return (
			<span>
        {props.dataType === 'content' ? 
          <div>
            <h1>Lost Password?</h1>
            <p>No problem, we will fix it. Just type your email and we will send password recovery instruction to your email. Follow easy steps to get back to your account.</p>
          </div>
          :
          <span>
            <div className="form-pad">
              <div className="form-content">
                <h1>Forget Password</h1>
                <p>Please provide registered email address to receive your password.</p>
              </div>
              <Form className="form" onSubmit={this.handleSubmit}>
                <FormItem label="Email">{getFieldDecorator('email', {rules: [{type: 'email', message: 'The input is not valid E-mail!'},{required: true, message: 'Please input your email'}],})(
                  <Input size="large" placeholder="Please type email address" suffix={<Icon type="mail"/>}/>
                )}</FormItem>
                <Button size="large" className="submitBtn" htmlType="submit" type="primary" loading={this.state.loader}>
                  {this.state.loader ? 'Send Password' : <div className="flex-c"><Icon type="inbox" className="fs-20" /> &nbsp;&nbsp;Send Password</div>}
                </Button>
                <a href="javascript:void(0)" onClick={() => props.changeForm('loginForm')} className="forget_password_link">Back to login form?</a>
              </Form>
              <div className="form-content">
                <p className="app_label">&copy; {Services.getCurrentYear()} {store_value.app_name}</p>
              </div>
            </div>
            <div className="footer-signup-bar">
              Don't have a {store_value.app_name} account? <a href="javascript:void(0)" onClick={() => props.changeForm('registrationForm')}>Sign up</a>.
            </div>
          </span>
        }
    	</span>
		);
	}
}

export default connect(mapStateToProps)(Form.create()(ForgetPassword));