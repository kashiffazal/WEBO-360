/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button } from 'antd';
import { AntInput } from '../../externalComponents/antd-fields';
import SendGridForm from './partialModal/sendgrid_form';
import MailGunForm from './partialModal/mailgun_form';
import MailJetForm from './partialModal/mailjet_form';
import SendTestFields from './partialModal/send_test_fields';
import ElasticEmailForm from './partialModal/elasticEmail_form';
import PostmarkForm from './partialModal/postmark_form';
import Services from '../../services';

class ESPSModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordShow: false,
      loader: false,
      esps_server_list: [{ key: 1 }],
      esps_selected: null,
      allowTestOnSubmit: false,
      showTestEmailContainer: false,
      testEmailData: '',
      emailSendStatus: false,
      espsFormValuesHold: {}
    }//End states
  }//End constructor


  submitModal = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return; }
      if (this.state.allowTestOnSubmit) {
        this.setState({
          espsFormValuesHold: values,
          showTestEmailContainer: true
        });
        return false;
      }//End if condition
      //Getting ESPS Server account table
      values.esps_table_name = Services.getObjectFromArr(this.state.esps_selected, 'id', this.state.esps_server_list).table_name;
      this.setState({ loader: true });
      Services.http('post', 'esps/post/index.php', values).then(res => {
        //console.log(res.data);
        this.setState({ loader: false });
        if (!res) { return false; }
        if (this.props.callBack) { this.props.callBack(); }//End if condition
        this.props.onCancel();
      });
      //console.log('Received values of form: ', values);
    });
  }//End function

  render() {
    const { visible } = this.props;
    const fp = this.props.form;
    const st = this.state;
    return (
      <Modal
        maskClosable={false}
        centered
        visible={(visible)}
        okText="Submit"
        onCancel={() => this.props.onCancel(false)}//End onCancel
        title="Add New Delivery Server"
        className="hide-modal-footer"
      >

        <Form onSubmit={this.submitModal}>
          <AntInput name="id" className="dis-none-imp" formProps={fp} noRequired={true} />

          <Row gutter={16} className="m-b-10">
            <Col lg={12} md={12} sm={24} xs={24}>
              <AntInput filter={true} type="select" label="Select ESPS Server" name="esps_server_id" formProps={fp} options={st.esps_server_list} setValueLabel={['id', 'server_name']}
                onChange={() => setTimeout(() => { this.setState({ esps_selected: fp.getFieldValue('esps_server_id') }) }, 10)}
              />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <AntInput name="account_name" label="Account Name" formProps={fp} placeholder="Type account name" />
            </Col>
          </Row>

          {st.esps_selected === '1' && <SendGridForm formProps={fp} />}
          {st.esps_selected === '2' && <MailGunForm formProps={fp} />}
          {st.esps_selected === '3' && <ElasticEmailForm formProps={fp} />}
          {st.esps_selected === '4' && <MailJetForm formProps={fp} />}
          {st.esps_selected === '5' && <PostmarkForm formProps={fp} />}
          

          <div className="m--24 m-t-24 p-24 p-t-15 p-b-15 b-t-1 b-c-gray">
            {!st.showTestEmailContainer &&
              <div className="text-right">
                {st.emailSendStatus && <p className="fs-11 m-t-10 float-l" style={{ 'color': 'green' }}>Test email has been succsccfully sent!</p>}
                <Button htmlType="submit" onClick={() => this.setState({ allowTestOnSubmit: true })}> Test Email </Button>
                &nbsp;&nbsp;&nbsp;
								<Button htmlType="submit" type="primary" loading={this.state.loader}>Submit</Button>
              </div>
            }
          </div>
        </Form>

        {st.showTestEmailContainer && <SendTestFields formProps={fp} formValues={st.espsFormValuesHold} skipTest={() => this.setState({ showTestEmailContainer: false, allowTestOnSubmit: false })} testEmailData={st.testEmailData} emailStatus={() => this.setState({ emailSendStatus: true })} />}

      </Modal>
    );//End return
  }//End render
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      if (this.props.data) {
        this.setState({ esps_selected: this.props.data.esps_server_id }, () => {
          this.props.form.setFieldsValue(this.props.data);
        });
      } else {
        this.props.form.resetFields();
      }//End if condition
    }//End if condition
  }//End componentDidUpdate

  componentDidMount() {
    //Getting ESPS Server List
    if (!this.props.esps_server_list) {
      Services.http("get", 'esps/get/server_list_test_email.php').then(res => {
        if (!res) { return false; }
        this.setState({ esps_server_list: res.data, testEmailData: res.test_data });
      });
    } else {
      this.setState({ esps_server_list: this.props.esps_server_list });
    }//End if condition
    //Getting Test Email
    //Services.http("get", 'esps/get/getTestEmail.php').then(res => { if (!res) { return false; } this.setState({ testEmailData: res.data }); });
  }//End componentDidMount
}//End class

export default Form.create()(ESPSModal);