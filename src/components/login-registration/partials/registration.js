/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import mapStateToProps from '../../../store/mapStateToProps';
import Services from '../../services';

const FormItem = Form.Item;

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: false, forgetPassword : false, errorEmail : false };
  }//End constructor

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({ loader: true });
        Services.http('post','login/registration.php',values).then(res => {
          this.setState({ loader: false });
          if(res) {
            //console.log(res);
            if(res.emailError){
              this.setState({errorEmail : res.emailError});
            }else{
              Services.saveArrLocalStorage([values.full_name,values.email],"/confirmEmail");
            }//End if condition
          }//End if condition
        })//End http service
      }//End if condition
    });//End form properties
  }//End handleSubmit


  render() {
    const store_value = this.props.store_values.application_data;
    const { getFieldDecorator } = this.props.form;
    const props = this.props;
    const st = this.state;
    return (
      <span>
        {props.dataType === 'content' ? 
          <div>
            <h1>Send Stunning Emails</h1>
            <p>{store_value.app_name} makes it radically easy to send and measure the impact of your email marketing campaigns.</p>
          </div>
          :
          <span>
            <div className="form-pad">
              <div className="form-content">
                <h1>Sign Up</h1>
                <p>Start sending beautifully designed emails today.</p>
              </div>
              <Form className="form" onSubmit={this.handleSubmit}>
                <FormItem label="Full Name">{getFieldDecorator('full_name', {rules: [{required: true, message: 'Please input your name'}],})(
                  <Input size="large" placeholder="Please type name" suffix={<Icon type="user"/>}/>
                )}</FormItem>
                <FormItem label="Company Name">{getFieldDecorator('company_name', {rules: [{required: true, message: 'Please input company name'}],})(
                  <Input size="large" placeholder="Please type company name" suffix={<Icon type="cluster" />}/>
                )}</FormItem>
                <FormItem className={st.errorEmail ? "errorEmail" : ""} label={"Email" + (st.errorEmail ? ' ('+st.errorEmail+')' : '')}>{getFieldDecorator('email', {rules: [{type: 'email', message: 'The input is not valid E-mail!'},{required: true, message: 'Please input your email'}],})(
                  <Input size="large" className="kashif" placeholder="Please type email address" suffix={<Icon type="mail"/>}/>
                )}</FormItem>
                <FormItem label="Password">{getFieldDecorator('password', {rules: [{required: true, message: 'Please input password'}],})(
                  <Input size="large" type="password" placeholder="Please type password" suffix={<Icon type="lock" />}/>
                )}</FormItem>
                <Button size="large" className="submitBtn" style={{'width' : '100%', 'marginBottom' : '10%'}} htmlType="submit" type="primary" loading={this.state.loader}>
                  {this.state.loader ? 'Create Account' : <div className="flex-c"><Icon type="form" className="fs-18" /> &nbsp;&nbsp;Create Account</div>}
                </Button>
              </Form>
            </div>
            <div className="footer-signup-bar">
              Already have an account? <a href="javascript:void(0)" onClick={() => props.changeForm('loginForm')}>Log in</a>.
            </div>
          </span>
        }
      </span>
    );
  }
}

export default connect(mapStateToProps)(Form.create()(withRouter(RegistrationForm)));