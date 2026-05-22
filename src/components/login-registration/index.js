import React, { Component } from 'react';
import { Form, Row, Col } from 'antd';
import LoginForm from './partials/login';
import RegistrationForm from './partials/registration';
import ForgetPassword from './partials/forget-password';
import "./styles.css";

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      formObj : {
        loginForm : true,
        forgetPassword : false,
        registrationForm : false,
      }
    };
  }//End constructor

  changeForm = (formName) => {
    var formArr = this.state.formObj;
    formArr.loginForm = false;
    formArr.forgetPassword = false;
    formArr.registrationForm = false;
    formArr[formName] = true;
    this.setState({formObj : formArr});
  }//End function


  render() {
    const st = this.state.formObj;
    return (
      <React.Fragment>
        <div className="bg-image"></div>
        <div className="page-container">

          <div className="split_container">
            <Row>
              <Col lg={12} md={12} sm={24} xs={24}>
                <div className="form-container">
                  <div className="logo">
                    <img src={`${process.env.PUBLIC_URL}/image/logo.png`} alt="Logo" />
                  </div>
                  {st.loginForm && <LoginForm changeForm={(formName) => this.changeForm(formName)}/>}
                  {st.registrationForm && <RegistrationForm changeForm={(formName) => this.changeForm(formName)}/>}
                  {st.forgetPassword && <ForgetPassword changeForm={(formName) => this.changeForm(formName)}/>}
                </div>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24} className="login-content-container">
                <div className="login-content flex-m">
                  {st.loginForm && <LoginForm dataType="content"/>}
                  {st.registrationForm && <RegistrationForm dataType="content"/>}
                  {st.forgetPassword && <ForgetPassword dataType="content"/>}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );//End return
  }//End render
}//End class


export default Form.create()(Login);