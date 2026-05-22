import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Icon, Spin } from 'antd';
import CampaignServices from '../../../campaign_services';
import Header from '../../header';
import Services from '../../../../../services';
import '../../../styles.css';




const FormItem = Form.Item;

class CreateCampaignStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      nextBtnLoader: false,

      renderLoader: false,
      campaign_name: null,
      last_subject_loader: null,
      last_subject: null,
      subject_line: '',
      showReplayToField: false,
      replayData: null
    };
  }//End constructor


  submitForm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return false }//End if condition

      values.id = CampaignServices.localStorageDecode().cid;
      values.resend = CampaignServices.localStorageDecode().campaignResend;
      //console.log(values);

      this.setState({ nextBtnLoader: true });
      Services.http('post', 'campaign/post/step_1/index.php', values).then(res => {
        this.setState({ nextBtnLoader: false });
        if (!res) { return false; }
        //Save important data in session for use after reload browser
        CampaignServices.localStorageEncode({ cid: res.id, cn: values.campaign_name });//Reset object
        CampaignServices.localStorageDecode().snp ?
          this.props.history.push('/app/createCampaign/step3/snapshot') :
          this.props.history.push('/app/createCampaign/step2')
      });

    });//End form properties
  }//End fucntion

  addToSubjectLine = (value) => {
    value = this.state.subject_line + ' ' + value;
    this.props.form.setFieldsValue({ subject_line: value });
    this.setState({ subject_line: value });
  }//End function

  // setSubjectIfEmpty = () => {
  //   if (!this.state.subject_line) {
  //     this.props.form.setFieldsValue({ subject_line: this.state.campaign_name });
  //     this.setState({ subject_line: this.state.campaign_name });
  //   }//End if condition
  // }//End function

  showReplayTo = () => {
    this.setState({ showReplayToField: true }, () => {
      this.props.form.setFieldsValue({
        replayToName: this.state.replayData.replayToName,
        replayToEmail: this.state.replayData.replayToEmail
      })
    });
  }//End function


  render() {
    const { getFieldDecorator } = this.props.form;
    const st = this.state;
    return (

      <div className="c_c_container">
        <Spin spinning={st.nextBtnLoader || st.loader}>

          <Header
            title="Define the campaign and sender details"
            desc="Create your new campaign"
            stepNumber={1}
          />

          <Form className="step_1" onSubmit={this.submitForm}>
            <Row gutter={20}>
              <Col lg={5} md={3} sm={24} xs={24}></Col>
              <Col lg={14} md={18} sm={24} xs={24}>

                <h2>Name this campaign</h2>
                <p>The campaign name is shown in your reports and your email archive.</p>
                <div className="box-wrap">
                  {/* onBlur={() => this.setSubjectIfEmpty()} */}
                  <FormItem>{getFieldDecorator('campaign_name', { rules: [{ required: true, message: 'Please input campaign name' }], })(<Input onChange={(ev) => this.setState({ campaign_name: ev.target.value })} placeholder="Please type campaign name" />)}</FormItem>
                </div>
                <br />

                <h2>Write a subject line</h2>
                {st.last_subject_loader ? <p className="m-b-7"><img src={`${process.env.PUBLIC_URL}/image/h-loader_2.gif`} width="50px" alt="" /></p> :
                  st.last_subject ? <p>The subject of your last campaign was: <span className="last_subject">{st.last_subject}</span>.</p> :
                    <p>Input subject line for this campaign.</p>
                }
                <div className="box-wrap">
                  <div className="subject_line_container">
                    <Row gutter={10} type="flex" justify="space-around" align="middle">
                      <Col lg={18} md={12} sm={12} xs={24}>
                        <FormItem>{getFieldDecorator('subject_line', { rules: [{ required: true, message: 'Please input subject line' }], })(<Input onChange={(ev) => this.setState({ subject_line: ev.target.value })} placeholder="Please type campaign name" />)}</FormItem>
                      </Col>
                      <Col lg={6} md={12} sm={12} xs={24}>
                        <select defaultValue="" className="select_box" onChange={(ev) => this.addToSubjectLine(ev.target.value)}>
                          <option value="" style={{ 'color': '#bcbcbc' }} disabled="disabled">Insert personalization</option>
                          <option value="[Insert first name]">Insert first name</option>
                          <option value="[Insert last name]">Insert last name</option>
                          <option value="[Insert full name]">Insert full name</option>
                        </select>
                      </Col>
                    </Row>
                  </div>
                </div>
                <br />

                <h2>Who is it from?</h2>
                <p>This will display in the From field. You can use {!st.showReplayToField && <span><button className="btnToAnchor" onClick={() => this.showReplayTo()}>a different reply-to address</button> and </span>}personalized From details.</p>
                <div className="box-wrap">
                  <Row gutter={10}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                      <FormItem>{getFieldDecorator('fromName', { rules: [{ required: true, message: 'Please input From Name' }], })(<Input placeholder="Type from name" />)}</FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                      <FormItem>{getFieldDecorator('fromEmail', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: true, message: 'Please input From E-mail' }], })(<Input placeholder="Type from email" />)}</FormItem>
                    </Col>
                  </Row>
                </div>
                <br />

                {st.showReplayToField &&
                  <React.Fragment>
                    <h2>Replies should be sent to</h2>
                    <p>Enter a valid email address that replies will be sent to.</p>
                    <div className="box-wrap">
                      <Row gutter={10}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                          <FormItem>{getFieldDecorator('replayToName', { rules: [{ required: true, message: 'Please input Reply-To name' }], })(<Input placeholder="Type reply-to name" />)}</FormItem>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                          <FormItem>{getFieldDecorator('replayToEmail', { rules: [{ required: true, message: 'Please input Reply-To email' }], })(<Input placeholder="Type from reply-to email" />)}</FormItem>
                        </Col>
                      </Row>
                    </div>
                  </React.Fragment>
                }

                <br /><hr className="hr-dashed" /><br />
                <Row gutter={30}>
                  <Col lg={9} md={11} sm={10} xs={24}>
                    {CampaignServices.localStorageDecode().snp &&
                      <Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')}> <Icon type="left" />Back to snapshot </Button>
                    }{/** End snapshop edit condition*/}
                  </Col>
                  <Col lg={10} md={6} sm={4} xs={24}></Col>
                  <Col lg={5} md={7} sm={10} xs={24}>
                    <Button className="w-full" type="primary" size="large" htmlType="submit" loading={st.nextBtnLoader}>
                      {CampaignServices.localStorageDecode().snp ? 'Save' :
                        <span>Next{st.nextBtnLoader ? '' : <Icon type="right" />}</span>
                      }{/** End snapshop edit condition*/}
                    </Button>
                  </Col>
                </Row>

              </Col>
              <Col lg={5} md={3} sm={24} xs={24}></Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );//End return
  }//End render
  componentDidMount() {
    //Getting campaign data by id
    var id = CampaignServices.localStorageDecode().cid;
    if (!id || id === '0') { id = ''; }
    this.setState({ loader: true });
    Services.http('get', 'campaign/get/create_form/step_1/index.php?id=' + id).then(res => {
      res = res.data;

      if (CampaignServices.localStorageDecode().campaignResend) {
        res.campaign_name = res.campaign_name + " - Copy";
        this.setState({ subject_line: res.subject_line })
      }//End if condition

      //console.log(res);

      this.setState({
        loader: false,
        last_subject: res.last_subject,
        replayData: { replayToName: res.replayToName, replayToEmail: res.replayToEmail }
      }, () => {
        //Open reply-t- section if needed
        if (res.replayToName || res.replayToEmail) {
          if ((res.replayToName !== res.fromName) || (res.replayToEmail !== res.fromEmail)) {
            this.showReplayTo();
          }//End if condition
        }//End if condition
      })
      delete res.replayToName;
      delete res.replayToEmail;
      //Save html tags into local storage in order to get directly other then hit API
      //Mostly use in preview function in campaign services 
      Services.saveArrLocalStorage(res.tags, false, window.htmlTagsLocalStorage);
      delete res.last_subject;
      delete res.tags;
      this.props.form.setFieldsValue(res);
    });
  }//End componentDidMount
}//End class
export default Form.create()(CreateCampaignStep1);