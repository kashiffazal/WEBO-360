import React, { Component } from 'react';
import { AntInput } from '../../../externalComponents/antd-fields';
import { Form, Row, Col, Button } from 'antd';
import Services from '../../../services';

class SendTestFields extends Component {
  state = {
    testSendLoader: false,
  }
  sendTest = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return; }

      this.setState({ testSendLoader: true });
      values.espsDetails = this.props.formValues;
      Services.http('post', 'esps_test/index.php', values).then(res => {
        //console.log(res);
        this.setState({ testSendLoader: false });
        if (!res) { return false; }
        this.props.skipTest();
        this.props.emailStatus();
      });
    });

  }//End function


  render() {
    const fp = this.props.form
    const st = this.state;
    const pr = this.props;
    return (
      <Form onSubmit={this.sendTest}>
        <h4 style={{ marginTop: '-41px', display: 'block', background: '#fff', width: 'fit-content', padding: '0px 5px' }}>Test Email</h4>

        <Row gutter={16} className="m-b-10 m-t-18">
          <Col lg={12} md={12} sm={24} xs={24}>
            <AntInput name="from_name" label="Sender/From Name" formProps={fp} placeholder="Please add Sender/From name" value={pr.testEmailData.from_name}/>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <AntInput name="from_email" label="Sender/From Email" type="email" formProps={fp} placeholder="Please add Sender/From email" value={pr.testEmailData.from_email}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={12} md={24} sm={24} xs={24}>
            <AntInput name="to_email" label="Send To" type="email" formProps={fp} placeholder="Please type email address" value={pr.testEmailData.to_email} />
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Button htmlType="submit" loading={st.testSendLoader} className="w-full m-t-25" type="primary"> Send </Button>
          </Col>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Button disabled={this.state.testSendLoader} className="w-full m-t-25" onClick={() => pr.skipTest()}> Skip Test </Button>
          </Col>
        </Row>
      </Form>
    );//Ebnd return
  }//End render
}//End class

export default Form.create()(SendTestFields);