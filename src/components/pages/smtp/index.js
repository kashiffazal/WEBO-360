import React, { Component } from 'react';
import {  Row, Col, Button, Popconfirm, Spin, Icon } from 'antd';
import SMTPModal from './add_SMTP_modal';
import DataTable from '../../externalComponents/andt-data-table-component';
import AccessControl from '../../externalComponents/user-base-access-control';
import SideNavigation from '../../mutual/sideNavigation';
import Services from '../../services';

class SMTP_setting extends Component {
  constructor(props) {
    super(props)
    this.state = { loader: false, smtpData: [], visibleModal: false, deleteSMTPLoader: {} };
    window.smtpFilterListName = null;
  }//End constructor

  getSMTP_data = () => {
    Services.http("get","smtp/get/index.php?id=all").then(res => {
      this.setState({ loader: false, smtpData: res.data });
    });
  }//End function


  open_SMTP_edit_modal = (row) => {
    const rowData = {
      id : row.id,
      name : row.name,
      SMTPSecure : row.SMTPSecure,
      host : row.host,
      port : row.port,
      custom_header_email : row.custom_header_email,
      username : row.username,
      password : row.password,
      fromName : row.fromName,
      fromEmail : row.fromEmail
    };
    ///delete rowData.key;
    this.setState({data : rowData}, () => {
      this.setState({ visibleModal: true, data : rowData });
    });
  }//End function



  deleteSMTP = (id) => {
    this.setState({ deleteSMTPLoader: { 'id': id } });
    Services.http('get','smtp/post/delete_smtp.php?id=' + id).then(res => {
      this.setState({ deleteSMTPLoader: { 'id': false } });
      if(!res){return false;}
      this.getSMTP_data();
    });
  }//End function

  componentDidMount() { this.setState({ loader: true }, () => { this.getSMTP_data(); }); }//End componentDidMount


  render() {

    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.length - b.name.length },
      { title: 'From Name', dataIndex: 'fromName', key: 'fromName', sorter: (a, b) => a.fromName.length - b.fromName.length },
      { title: 'From Email', dataIndex: 'fromEmail', key: 'fromEmail', sorter: (a, b) => a.fromEmail.length - b.fromEmail.length },
      {
        title: 'Action', render: (text, row) => {
          return (
            <div>
              {
                this.state.deleteSMTPLoader.id === row.id ?
                  <span><img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{ 'width': '10px' }} alt="" /> <span className='fs-10'>Deleting...</span></span> :
                  <span>
                    {Services.accessControl(3) && <span><a ubac_id={3} onClick={() => this.open_SMTP_edit_modal(row)}>Edit</a> &nbsp;&nbsp;|&nbsp;&nbsp;</span>}
                    {Services.accessControl(4) && <Popconfirm title="Are you sure to delete this SMTP?" onConfirm={() => this.deleteSMTP(row.id)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>}
                  </span>
              }
            </div>
          )
        }
      }
    ];

    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <h3 className="pageTitle"><Icon type="mail" /> SMTP Settings</h3>
            <p className="fs-14">Use lists to organize separate groups of subscribers e.g. customers and employees. Correctly managing your lists and using segments will allow you to get the most out of your email marketing as campaigns, segments, subscriber data and engagement are not shared across lists.</p>
            <Spin spinning={this.state.loader}>
              <DataTable 
                columns={columns}
                dataSource={this.state.smtpData}
                rowSelection={false}
                filter="true"
                filterCol={["name", "From_Name", "From_Email"]}
                showSizeChanger={true}
                pagination={{itemDetails : true}}
                expandedRowRender={record => {
                    return (
                      <div>
                        <span className="fs-14"> Details:-</span>
                        <hr className="hr-dashed" />
                        <Row>
                          <Col lg={4} md={8} sm={24} xs={24}><b>Username: </b></Col>
                          <Col lg={8} md={16} sm={24} xs={24}>{record.username}</Col>
                          <Col lg={3} md={8} sm={24} xs={24}><b>Password</b></Col>
                          <Col lg={9} md={16} sm={24} xs={24}>{record.password}</Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={8} sm={24} xs={24}><b>Host</b></Col>
                          <Col lg={8} md={16} sm={24} xs={24}>{record.host}</Col>
                          <Col lg={3} md={8} sm={24} xs={24}><b>Port</b></Col>
                          <Col lg={9} md={16} sm={24} xs={24}>{record.port}</Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={8} sm={24} xs={24}><b>Custom Header Email</b></Col>
                          <Col lg={8} md={16} sm={24} xs={24}>{record.custom_header_email}</Col>
                          <Col lg={3} md={8} sm={24} xs={24}><b>SMTP Secure</b></Col>
                          <Col lg={9} md={16} sm={24} xs={24}>{record.SMTPSecure}</Col>
                        </Row>
                      </div>
                    )//End return
                  }}
              />
            </Spin>

          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <AccessControl>
              <Button ubac_id={2} onClick={() => {this.setState({ visibleModal: true, data : null })}} type="primary" size="large" className="w-full m-b-20">Add new SMTP details</Button>
            </AccessControl>
            <SMTPModal
              visible={this.state.visibleModal}
              onCancel={(status) => this.setState({ visibleModal: status })}
              callBack={this.getSMTP_data}
              data={this.state.data}
            />
            <SideNavigation title="You might also want to..." links="ac,ms,smtp,um"/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SMTP_setting;
