import React, { Component } from 'react';
import { Menu, Row, Col, Icon } from 'antd';
import Profile from './profile';
//import CampaignEmails from './campaignEmails';
import ResetPassword from './resetPassword';
//import ConfirmationEmailTemplate from './confirmationEmailTemplate';
//import TestEmailTemplate from './testEmailTemplate';
import Services from '../../services';

import './styles.css';
const MenuItemGroup = Menu.ItemGroup;

class AccountSettings extends Component{

  constructor(props){
    super(props);
    this.state = {
      sectionKey : '1',
      sectionName: 'Edit Profile',
      defaultKey : '1'
    }
  }//End constructor

  handleClick = (e,manualObj = false) => {
    //console.log('click ', e);
    if(manualObj){
      this.setState({sectionKey: manualObj.key, sectionName: manualObj.name, defaultKey : manualObj.key})
    }else{
      this.setState({sectionKey: e.key, sectionName: e.item.props.children})
    }//End if condition
  }//End function

  render() {
    return (
      <div>
        <Row gutter={30}>
          <Col lg={6} md={24} sm={24} xs={24}>
            <Menu onClick={this.handleClick} defaultSelectedKeys={[this.state.defaultKey]} defaultOpenKeys={['g1']} mode="inline">
              <MenuItemGroup key="g1" title="Settings">
                {Services.accessControl(27) && <Menu.Item key="1">Edit Profile</Menu.Item>}
                {/* {Services.accessControl(29) && <Menu.Item key="2">Edit Campaign Emails</Menu.Item>} */}
                {Services.accessControl(28) && <Menu.Item key="3">Reset Password</Menu.Item>}
                {/* {Services.accessControl(30) && <Menu.Item key="4">Confirmation Email Template</Menu.Item>} */}
                {/* {Services.accessControl(31) && <Menu.Item key="5">Test Email Template</Menu.Item>} */}
              </MenuItemGroup>
            </Menu>
          </Col>
          <Col lg={18} md={24} sm={24} xs={24}>
            <h1><Icon type="setting" className="fs-26"/> Settings <span className="sectionName">> {this.state.sectionName}</span></h1>
            {this.state.sectionKey === '1' && <Profile/>}
            {/* {this.state.sectionKey === '2' && <CampaignEmails/>} */}
            {this.state.sectionKey === '3' && <ResetPassword/>}
            {/* {this.state.sectionKey === '4' && <ConfirmationEmailTemplate/>} */}
            {/* {this.state.sectionKey === '5' && <TestEmailTemplate/>} */}
          </Col>
        </Row>
      </div>
    );//End return
  }//End render
  componentWillMount(){
    if(!Services.accessControl(27)){
      this.handleClick(false,{key : '2', name : 'Edit Campaign Emails', defaultKey : '2'});
    }
    if(!Services.accessControl(29)){
      this.handleClick(false,{key : '3', name : 'Reset Password', defaultKey : '3'});
    }
    if(!Services.accessControl(28)){
      this.handleClick(false,{key : '4', name : 'Confirmation Email Template', defaultKey : '4'});
    }
    if(!Services.accessControl(30)){
      this.handleClick(false,{key : '5', name : 'Test Email Template', defaultKey : '5'});
    }
    if(!Services.accessControl(31)){
      this.handleClick(false,{key : '1', name : 'Access Denied!', defaultKey : '1'});
    }
  }//End componentDidMount
}//End component

export default AccountSettings;
