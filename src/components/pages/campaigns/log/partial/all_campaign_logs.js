import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Empty, Button } from 'antd';
import Draft from '../draft';
import Sent from '../sent';
import Scheduled from '../scheduled';
import SideNavigation from '../../../../mutual/sideNavigation';
import AccessControl from '../../../../externalComponents/user-base-access-control';
import CampaignServices from '../../campaign_services';
import Services from '../../../../services';
import ScreenLoader from '../../../../externalComponents/screen-loader';

class AllCampaignLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      data: null,
      archiveCount: 0
    };
  }//End constructor

  scheduleToDraft = (id) => {
    let data = this.state.data;

    var dataIndex = data.schedule.findIndex(x => x.id === id);
    let holdData = { ...data.schedule[dataIndex] };
    delete data.schedule[dataIndex];
    data.schedule = data.schedule.filter(function (val) { return val });
    if (!data.draft) { data.draft = [] };
    data.draft.push(holdData);
    console.log(data);
    this.setState({ data: data });
  }//End function

  render() {
    const st = this.state;
    const readonly = this.props.readonly;//true means for overview page and false means for campaign page
    return (
      <div className="container">
        {st.loader ?
          <ScreenLoader active={st.loader} />
          :
          (!st.data) ?
            <Empty
              image={`${process.env.PUBLIC_URL}/image/empty.png`}
              imageStyle={{ height: 150 }}
              description={
                <span>
                  <span className="fs-28 p-b-15 dis-block">Welcome</span>
                Get started by creating your first email campaign. We'll walk you through the entire process.
              </span>
              }>
              {Services.accessControl(17) &&
                <Button onClick={() => { CampaignServices.localStorageEncode({}); this.props.history.push('/app/createCampaign/step1'); }} type="primary" size="large">Create your first campaign</Button>
              }
            </Empty> :
            <Row gutter={40}>
              <Col lg={19} md={24} sm={24} xs={24}>
                <AccessControl>
                  <Scheduled ubac_id={24} readonly={readonly} data={st.data.schedule} unscheduleUpdate={(id) => this.scheduleToDraft(id)} templatePreview={(id) => CampaignServices.openPreview(id)} />
                  <Draft ubac_id={21} readonly={readonly} data={st.data.draft} templatePreview={(id) => CampaignServices.openPreview(id)} />
                  <Sent ubac_id={20} readonly={readonly} data={st.data.sent} templatePreview={(id) => CampaignServices.openPreview(id)} archiveCount={st.archiveCount} />
                  <br />
                </AccessControl>
              </Col>
              <Col lg={5} md={24} sm={24} xs={24}>
                <SideNavigation title="You might also want to..." btn="cc" links="ms" />
                {/* ac,ms,smtp,um */}
              </Col>
            </Row>
        }
      </div>
    )//End return statement
  }//End render
  componentDidMount() {
    this.setState({ loader: true });
    Services.http('get', 'campaign/get/getCampaignLog.php').then(res => {
      //console.log(res.data);
      this.setState({ loader: false });
      if (!res) { return false; }
      this.setState({ data: res.data, archiveCount: res.archiveCount })
    });
  }//End componentDidMount

}//End component

export default withRouter(AllCampaignLogs);