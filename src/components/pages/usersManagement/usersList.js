import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Menu, Dropdown, Spin, Icon, Modal } from 'antd';
import DataTable from '../../externalComponents/andt-data-table-component';
import SideNavigation from '../../mutual/sideNavigation';
import Services from '../../services';
import "./styles.css";

class UsersList extends Component {
  constructor(props) {
    super(props)
    this.state = { getDataLoader: false, listData: [], modalVisible: false, userViewData: [] };
  }//End constructor

  getData = () => {
    this.setState({ getDataLoader: true });
    Services.http('get', 'usersManagement/get/usersList.php').then(res => {
      this.setState({ getDataLoader: false });
      if (!res) { return false; }
      //console.log(res);
      this.setState({ listData: res.data });
    });
  }//End function

  componentDidMount() {
    this.getData();
  }//End componentDidMount




  render() {
    const menu = (
      <Menu className="list-dropdown">
        <Menu.Item key="0"><button className="btnToAnchor btaColor w-full" onClick={() => this.setState({ modalVisible: true })}><Icon type="eye" /> View Details</button></Menu.Item>
        {Services.accessControl(8) && <Menu.Item key="1" ubac_id={8}><NavLink exact to={`/app/createUser/${this.state.userViewData.id}`}><Icon type="edit" /> Edit User</NavLink></Menu.Item>}
      </Menu>
    );
    const columns = [
      {
        title: 'Sr',
        dataIndex: 'key',
        sorter: (a, b) => a.key - b.key,
      },
      {
        title: 'Full Name',
        dataIndex: 'first_name',
        sorter: (a, b) => a.first_name.length - b.first_name.length,
        render: (text, row) =>
          <a className="dis-block" onClick={() => this.setState({ userViewData: row, modalVisible: true })}>{row.first_name} {row.last_name}</a>
      }, {
        title: 'Company Name',
        dataIndex: 'company_name',
        sorter: (a, b) => a.company_name.length - b.company_name.length,
      }, {
        title: 'Contact Number',
        dataIndex: 'contact_number',
        sorter: (a, b) => a.contact_number - b.contact_number,
        render: (text) =>
          <div>
            {text ? text : '-'}
          </div>
      }, {
        title: 'Email Address',
        dataIndex: 'email',
        sorter: (a, b) => a.email.length - b.email.length,
      }, {
        title: 'Role',
        dataIndex: 'role_name',
        sorter: (a, b) => a.role_name.length - b.role_name.length,
      }, {
        title: 'Action',
        dataIndex: 'status',
        render: (record, row) =>
          <div>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button size="small" onClick={() => this.setState({ userViewData: row })}><Icon type="table" /> <i className="fa fa-caret-down p-l-3"></i></Button>
            </Dropdown>
          </div>

      }];

    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <h3 className="pageTitle">Users List</h3>
            <p className="fs-14">Use lists to organize separate groups of subscribers e.g. customers and employees. Correctly managing your lists and using segments will allow you to get the most out of your email marketing as campaigns, segments, subscriber data and engagement are not shared across lists.</p>
            <Spin tip="Loading..." spinning={this.state.getDataLoader}>
              <DataTable
                columns={columns}
                dataSource={this.state.listData}
                showSizeChanger={true}
                filter="true"
                filterCol={["key", "first_name", "company_name", "contact_number", "role_name"]}
                pagination={{ itemDetails: true }}
              />
            </Spin>
          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <SideNavigation btn="umcu" title="Related & Other Links" links="umcu,umcr,ac,ms" />
          </Col>
        </Row>


        <Modal
          width={950}
          maskClosable={false}
          title={this.state.userViewData.first_name + " " + this.state.userViewData.last_name}
          visible={this.state.modalVisible}
          onOk={() => this.setState({ modalVisible: false })}
          onCancel={() => this.setState({ modalVisible: false })}
          footer={[
            <Button key={1} onClick={() => this.setState({ modalVisible: false })}>Close</Button>,
          ]}
        >
          <div className="userViewModal">
            <Row gutter={20}>
              <Col lg={6} md={6} sm={6} xs={24} className="m-b-10">
                {this.state.userViewData.profileImage ?
                  <img src={window.domainPath + "/uploaded_files/user_profile/" + this.state.userViewData.profileImage} width="100%" alt="" />
                  :
                  <img src={require("./avatar.png")} width="100%" alt="" />
                }
              </Col>
              <Col lg={18} md={18} sm={18} xs={24}>
                <Row gutter={20}>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Full Name:</label>
                    <span className="viewField">{this.state.userViewData.first_name} {this.state.userViewData.last_name}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Company Name:</label>
                    <span className="viewField">{this.state.userViewData.company_name}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Email Address:</label>
                    <span className="viewField">{this.state.userViewData.email}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Role:</label>
                    <span className="viewField">{this.state.userViewData.role_name ? this.state.userViewData.role_name : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>ESPS Server:</label>
                    <span className="viewField">{this.state.userViewData.esps_server_name ? this.state.userViewData.esps_server_name : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>ESPS Account Name:</label>
                    <span className="viewField">{this.state.userViewData.esps_account_name ? this.state.userViewData.esps_account_name : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Username:</label>
                    <span className="viewField">{this.state.userViewData.username}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Gender:</label>
                    <span className="viewField">{this.state.userViewData.gender ? this.state.userViewData.gender : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Contact Number:</label>
                    <span className="viewField">{this.state.userViewData.contact_number ? this.state.userViewData.contact_number : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Country:</label>
                    <span className="viewField">{this.state.userViewData.country ? this.state.userViewData.country : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>City:</label>
                    <span className="viewField">{this.state.userViewData.city ? this.state.userViewData.city : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Address:</label>
                    <span className="viewField">{this.state.userViewData.address ? this.state.userViewData.address : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Reply To Name:</label>
                    <span className="viewField">{this.state.userViewData.replayToName ? this.state.userViewData.replayToName : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Reply To Email:</label>
                    <span className="viewField">{this.state.userViewData.replayToEmail ? this.state.userViewData.replayToEmail : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Confirmation Email:</label>
                    <span className="viewField">{this.state.userViewData.confirmationEmail ? this.state.userViewData.confirmationEmail : '-'}</span>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={12} className="m-b-10">
                    <label>Test Email:</label>
                    <span className="viewField">{this.state.userViewData.testEmail ? this.state.userViewData.testEmail : '-'}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Modal>


      </div>
    );
  }
}

export default UsersList;