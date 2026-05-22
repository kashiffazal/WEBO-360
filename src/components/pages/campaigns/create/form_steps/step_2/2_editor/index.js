import React, { Component } from 'react';
import { Row, Col, message, Button, Icon, Spin } from 'antd';
import Services from '../../../../../../services';
import Header from '../../../header';
import CampaignServices from '../../../../campaign_services';
import HTMLEditor from '../../../../../../externalComponents/andt-text-html-editor';
import '../../../../styles.css';
import MoteOptions from '../mutual/more_options';
import Tags from '../mutual/tags';

class CreateTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = { tabKey: '1', tagList: [], editorValue: '', loader: false, renderLoader: false }
  }//End constructor

  _handleEditor = (value) => {
    if (!value) { message.error("Please create template"); return false; }

    let postData = {};
    postData.html = value;
    postData.id = CampaignServices.localStorageDecode().cid;

    this.setState({ loader: true });
    Services.http('post', 'campaign/post/step_2/composeHTML.php', postData).then(res => {
      this.setState({ loader: false });
      if (!res) { return false; }
      this.props.history.push('/app/createCampaign/step2/template');
    });
  }//End function



  render() {
    return (
      <div className="c_c_container">
        <Header title="Create your own HTML template" desc={CampaignServices.localStorageDecode().cn} stepNumber={2} />
        <Row gutter={40}>
          <Col lg={5} md={5} sm={24} xs={24}>
            <MoteOptions useRecentTemplate={(html) => this.setState({ editorValue: html })} />
          </Col>
          <Col lg={14} md={19} sm={24} xs={24}>
            <Spin spinning={this.state.loader || this.state.renderLoader} tip={<span>Loading Template,<br />Please wait...</span>}>

              <HTMLEditor
                value={this.state.editorValue}
                tabType="card"
                // get="code-editor"
                tabNames={['Template Editor', 'HTML Editor']}
                tabChangeHandle={(tabKey) => this.setState({ tabKey })}
                onChange={(value) => this.setState({ editorValue: value })}
                tagConvert={this.state.tagList}
              />

              <br /><hr className="hr-dashed" /><br />
              <Row gutter={30} className="btn_container">
                <Col lg={5} md={7} sm={10} xs={24}>
                  {!CampaignServices.localStorageDecode().hted ?
                    <Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step2')}> <Icon type="left" />Previous </Button> :
                    <Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')}> <Icon type="left" />Back</Button>
                  }{/** End snapshop With Template Editor condition*/}
                </Col>
                <Col lg={14} md={10} sm={4} xs={24}></Col>
                <Col lg={5} md={7} sm={10} xs={24}>
                  <Button onClick={() => this._handleEditor(this.state.editorValue)} className="w-full" type="primary" size="large" loading={this.state.loader}>
                    {CampaignServices.localStorageDecode().hted ? 'Done' :
                      <span>Next{this.state.loader ? '' : <Icon type="right" />}</span>
                    }{/** End snapshop With Template Editor condition*/}
                  </Button>
                </Col>
              </Row>
              <br />
            </Spin>
          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <Tags type={this.state.tabKey} />
          </Col>
        </Row>

      </div>
    );//End return
  }//End render

  componentDidMount() {
    //Getting Tags
    let tagList = Services.loadArrLocalStorage(window.htmlTagsLocalStorage);
    this.setState({ tagList });
    //Getting template for preview ---------------------------//
    this.setState({ renderLoader: true }, () => {
      CampaignServices.renderTemplate().then(res => {
        //console.log(res);
        this.setState({ renderLoader: false, editorValue: res });
      }).catch(error => { console.log(error); this.setState({ renderLoader: false }); });
    });
    /** -------------------------------------------------------*/
  }//End componentDidMount
}//End class

export default CreateTemplate;