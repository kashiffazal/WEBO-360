import React from 'react';
import { Row, Col } from 'antd';

const first_col =
{
  title: 'Account Name',
  dataIndex: 'account_name',
  key: 'account_name',
  width: '20.5%',
  sorter: (a, b) => { return a.account_name.localeCompare(b.account_name) }
};


const columns = [
  //SendGrid
  [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '67.5%',
      // sorter: (a, b) => a.description.length - b.description.length,
      sorter: (a, b) => { a = a.description || ''; b = b.description || ''; return a.localeCompare(b); },
      render: (text, row) => { return (<div>{text ? text : '-'}</div>) }
    },
    // {
    //   title: 'API Key',
    //   dataIndex: 'api_key',
    //   key: 'api_key',
    //   width: '46%',
    //   sorter: (a, b) => { return a.api_key.localeCompare(b.api_key) }
    // },
  ],
  //Mail Gun
  [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '42.5%',
      // sorter: (a, b) => a.description.length - b.description.length,
      sorter: (a, b) => { a = a.description || ''; b = b.description || ''; return a.localeCompare(b); },
      render: (text, row) => { return (<div>{text ? text : '-'}</div>) }
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      width: '25%',
      sorter: (a, b) => { return a.domain.localeCompare(b.domain) }
    },
    // {
    //   title: 'API Key',
    //   dataIndex: 'api_key',
    //   key: 'api_key',
    //   sorter: (a, b) => { return a.api_key.localeCompare(b.api_key) }
    // }
  ],
  //Elastic Email
  [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '67.5%',
      // sorter: (a, b) => a.description.length - b.description.length,
      sorter: (a, b) => { a = a.description || ''; b = b.description || ''; return a.localeCompare(b); },
      render: (text, row) => { return (<div>{text ? text : '-'}</div>) }
    },
    // {
    //   title: 'API Key',
    //   dataIndex: 'api_key',
    //   key: 'api_key',
    //   sorter: (a, b) => { return a.api_key.localeCompare(b.api_key) }
    // }
  ],
  //MailJet Email
  [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '67.5%',
      // sorter: (a, b) => a.description.length - b.description.length,
      sorter: (a, b) => { a = a.description || ''; b = b.description || ''; return a.localeCompare(b); },
      render: (text, row) => { return (<div>{text ? text : '-'}</div>) }
    },
    // {
    //   title: 'API Key',
    //   dataIndex: 'api_key',
    //   key: 'api_key',
    //   sorter: (a, b) => { return a.api_key.localeCompare(b.api_key) }
    // }
  ],
  //Postmark Email
  [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '67.5%',
      // sorter: (a, b) => a.description.length - b.description.length,
      sorter: (a, b) => { a = a.description || ''; b = b.description || ''; return a.localeCompare(b); },
      render: (text, row) => { return (<div>{text ? text : '-'}</div>) }
    },
    // {
    //   title: 'API Key',
    //   dataIndex: 'api_key',
    //   key: 'api_key',
    //   sorter: (a, b) => { return a.api_key.localeCompare(b.api_key) }
    // }
  ]
];
//Add account_name into all
columns.forEach((item, i) => { columns[i].unshift(first_col) })



const expendData = [
  //SendGrid
  {
    expend: (data) => {
      return (
        <React.Fragment>
          <Row>
            <Col lg={5} md={5} sm={24} xs={24}><b>API Key: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.api_key}</Col>
          </Row>
          <Row className="m-t-5">
            <Col lg={5} md={5} sm={24} xs={24}><b>Link URL: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.link_domain_path}</Col>
          </Row>
        </React.Fragment>
      )//End return
    }//End function
  },
  //MailGun
  {
    expend: (data) => {
      return (
        <React.Fragment>
          <Row>
            <Col lg={5} md={5} sm={24} xs={24}><b>API Key: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.api_key}</Col>
          </Row>
          <Row className="m-t-5">
            <Col lg={5} md={5} sm={24} xs={24}><b>Link URL: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.link_domain_path}</Col>
          </Row>
        </React.Fragment>
      )//End return
    }//End function
  },
  //Elastic Email
  {
    expend: (data) => {
      return (
        <React.Fragment>
          <Row>
            <Col lg={5} md={5} sm={24} xs={24}><b>API Key: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.api_key}</Col>
          </Row>
          <Row className="m-t-5">
            <Col lg={5} md={5} sm={24} xs={24}><b>Link URL: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.link_domain_path}</Col>
          </Row>
        </React.Fragment>
      )//End return
    }//End function
  },
  //MailJet Email
  {
    expend: (data) => {
      return (
        <React.Fragment>
          <Row>
            <Col lg={5} md={5} sm={24} xs={24}><b>API Key: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.api_key}</Col>
          </Row>
          <Row>
            <Col lg={5} md={5} sm={24} xs={24}><b>Secret Key: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.secret_key}</Col>
          </Row>
          <Row className="m-t-5">
            <Col lg={5} md={5} sm={24} xs={24}><b>Link URL: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.link_domain_path}</Col>
          </Row>
        </React.Fragment>
      )//End return
    }//End function
  },
  //Postmark Email
  {
    expend: (data) => {
      return (
        <React.Fragment>
          <Row>
            <Col lg={5} md={5} sm={24} xs={24}><b>API Key: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.api_key}</Col>
          </Row>
          <Row className="m-t-5">
            <Col lg={5} md={5} sm={24} xs={24}><b>Link URL: </b></Col>
            <Col lg={19} md={19} sm={24} xs={24}>{data.link_domain_path}</Col>
          </Row>
        </React.Fragment>
      )//End return
    }//End function
  }
];


const data = { columns: columns, expendData: expendData }

export default data;