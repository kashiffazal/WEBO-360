import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { Row, Col, Menu, Dropdown, Icon } from 'antd';
import { connect } from 'react-redux';
import mapStateToProps from '../../../store/mapStateToProps';
import mapDispatchToState from '../../../store/action';
import Services from '../../services';
import './header.css';

const { SubMenu } = Menu;

class SecondaryHeader extends Component {

  constructor(props) {
    super(props);
    this.state = { ud: Services.getUserData() }//End state
    this.domainPath = window.domainPath;
  }//end constructor

  signOut = () => {
    this.props.history.push(process.env.PUBLIC_URL + '/login');
    setTimeout(() => {
      localStorage.removeItem(window.appLocalStorage);
      this.props.changeStateToReducer('profile_data', null);
    }, 1000);
  }//End function

  render() {

    const menu = (
      <Menu className="secondary-header-drop-down">
        {Services.accessControl(26) &&
          <Menu.Item>
            <NavLink exact to="/app/accountSettings"><Icon type="setting" /> &nbsp; Account Settings</NavLink>
          </Menu.Item>
        }
        {Services.accessControl(1) &&
          <Menu.Item>
            <NavLink exact to="/app/DeliveryServers"><i className="fa fa-envelope"></i> &nbsp; Delivery Servers</NavLink>
          </Menu.Item>
        }
        {/* {Services.accessControl(1) &&
          <Menu.Item>
            <NavLink exact to="/app/smtpSettings"><i className="fa fa-envelope"></i> &nbsp; Manage SMTP</NavLink>
          </Menu.Item>
        } */}
        {Services.accessControl(5) &&
          <SubMenu className="sub_menu_icon" title={`Users Management`}>
            {Services.accessControl(6) &&
              <Menu.Item>
                <NavLink exact to="/app/createUser"><i className="fa fa-plus"></i> &nbsp; Create New User</NavLink>
              </Menu.Item>
            }
            {Services.accessControl(7) &&
              <Menu.Item>
                <NavLink exact to="/app/usersList"><i className="fa fa-list"></i> &nbsp; Users List</NavLink>
              </Menu.Item>
            }
            {Services.accessControl(9) &&
              <Menu.Item>
                <NavLink exact to="/app/usersRole"><i className="fa fa-unlock"></i> &nbsp; Users Role</NavLink>
              </Menu.Item>
            }
          </SubMenu>
        }
        {Services.accessControl(26) && <Menu.Divider />}
        <Menu.Item key="1" onClick={this.signOut}>
          <Icon type="logout" /> Sign out
        </Menu.Item>
      </Menu>
    );

    const ud = this.state.ud;
    const pd = this.props.store_values.profile_data;
    //Getting Profile image
    const profileImage = this.domainPath + '/uploaded_files/user_profile/' +
      (
        (pd && pd.profileImage) ? pd.profileImage :
          (ud.profileImage ? ud.profileImage : 'avatar.png')
      );

    return (
      <div className="secondaryHeader">
        <Row>
          <Col xs={12} sm={16} md={16} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logoContainer">
              <img src={`${process.env.PUBLIC_URL}/image/logo.png`} style={{ 'width': '130px' }} alt="" />
            </div>
            {/*<span className="logoLabel">WEBO 360 Mailer</span>
              <span className="status">Client</span> <i className="fa fa-angle-right"></i>
            <span className="tempCompanyName">Sawagat Corp.</span>
             <img src={`${process.env.PUBLIC_URL}/image/logo-inner.png`} style={{'width':'220px'}} alt="Logo"/> */}
          </Col>
          <Col xs={12} sm={8} md={8} className="text-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '55px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link fs-13" href="">
                <span className="p-r-10">
                  {pd ? pd.first_name : ud.first_name}
                </span>
                <img src={profileImage} className="wrap-pic-cir" style={{ 'width': '30px' }} alt="" />
                <i className="fa fa-caret-down p-l-10"></i>
              </a>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );//End return
  }//End render
}//End class

export default connect(mapStateToProps, mapDispatchToState)(withRouter(SecondaryHeader));
