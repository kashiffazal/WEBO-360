import React, {Component} from 'react';
import AllCampaignLogs from '../campaigns/log/partial/all_campaign_logs';

class Overview extends Component{
   render(){
      return (
          <div>
            <AllCampaignLogs refresh={0} readonly={true}/>
          </div>
      )//End Return statement
  }//end End Render
}//End class

export default Overview;
