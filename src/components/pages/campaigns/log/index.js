import React, { Component } from 'react';
import AllCampaignLogs from './partial/all_campaign_logs';

class CampaignLog extends Component {
  state = {loader : false}
  render() {
    return (
      <div className="container">
        <AllCampaignLogs readonly={false} />
      </div>
    )//End return statement
  }//End render
}//End component

export default CampaignLog;
