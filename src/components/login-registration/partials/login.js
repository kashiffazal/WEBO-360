/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Button, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import mapStateToProps from '../../../store/mapStateToProps';
import Services from '../../services';

const FormItem = Form.Item;

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: false, forgetPassword : false };
  }//End constructor

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({ loader: true });
        Services.http('post','login/index.php',values).then(res => {
          this.setState({ loader: false });
          if(res){
            if(res.unverified){
              Services.saveArrLocalStorage(res.unverifiedUserData,"/unverified");
            }else{
              Services.setUserData(res.data);
              this.props.history.push(process.env.PUBLIC_URL + '/app/overview');
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
    return (
      <span>
        {props.dataType === 'content' ? 
          <div>
            <h1>Welcome Back.</h1>
            <p>To keep connected with us please login with your personal info. We makes it super easy to send emails that show off your products.</p>
          </div>
          :
          <span>
            <div className="form-pad">
              <div className="form-content">
                <h1>Sign In</h1>
                <p>Sign in to continue to our application.</p>
              </div>
              <Form className="form" onSubmit={this.handleSubmit}>
                <FormItem label="Username">{getFieldDecorator('username', {rules: [{required: true, message: 'Please input username'}],})(
                  <Input size="large" placeholder="Please type username" suffix={<Icon type="user"/>}/>
                )}</FormItem>
                <FormItem label="Password">{getFieldDecorator('password', {rules: [{required: true, message: 'Please input password'}],})(
                  <Input size="large" type="password" placeholder="Please type password" suffix={<Icon type="lock" />}/>
                )}</FormItem>
                <Button size="large" className="submitBtn" htmlType="submit" type="primary" loading={this.state.loader}>
                  {this.state.loader ? 'Login' : <div className="flex-c"><Icon type="login" className="fs-18" /> &nbsp;&nbsp;Login</div>}
                </Button>
                <a href="javascript:void(0)" onClick={() => props.changeForm('forgetPassword')} className="forget_password_link">Forgot Password?</a>
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

export default connect(mapStateToProps)(Form.create()(withRouter(LoginForm)));