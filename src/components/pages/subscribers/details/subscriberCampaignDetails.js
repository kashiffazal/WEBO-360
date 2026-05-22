import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Services from '../../../services';
import { withRouter } from "react-router";
import './styles.css';

class SubscriberCampaignDetails extends Component {

	redirectToReport = (rowData) => {
		Services.saveArrLocalStorage(
      [rowData.id,rowData.campaign_name,rowData.sent_date,(parseInt(rowData.recipientsCount,0) + parseInt(rowData.bounceCount,0))],
      "/app/campaigns/reports/charts"
		);
	}//End function

	detailsInList = (data) => {
		return data.map((item, key) => {
			//console.log(item);
			return (
				<span key={key}>
					<Row gutter={30}>
						<Col lg={12} md={12} sm={24} xs={24}>
							<b>Activity for {item.campaign_data.campaign_name}</b>
						</Col>
						<Col lg={12} md={12} sm={24} xs={24}>
							<div className="campaign_detail_link"> {item.campaign_data.leftTime} <a onClick={() => this.redirectToReport(item.campaign_data)} >(full results)</a></div>
						</Col>
					</Row>
					{this.campaignDetailList(item.data)}
					<br/><br/>
				</span>
			);
		});
	}//End function

	campaignDetailList = (data) => {
		return data.map((item, key) => {
			return (
				<span key={key}>
					<div className="last_activity">{item.date}</div>
					<ul className="p-0">
						{this.campaignInternalList(item.details)}
					</ul>
				</span>
			)
		})//End map
	}//End function

	campaignInternalList = (data) => {
		return data.map((item, key) => {
			return (
				<li className={`activity ${item.action}`} key={key}>
					{item.action === 'Clicked' && 
						<React.Fragment>
							<div>
								<strong>{item.action}</strong>
								<a className="truncate" target="_blank" rel="noopener noreferrer" href={item.click_url}>
									{item.click_url}
								</a>
							</div>
							<div>
								{item.location.city && <span title={item.location.city+", "+item.location.state+", "+item.location.country}>{item.location.city}</span>}
							</div>
						</React.Fragment>
					}

					{item.action === 'Opened' && 
						<div><strong>{item.action}</strong> your email</div>
					}

					{item.action === 'Unsubscribed' && 
						<div><strong>{item.action}</strong> by subscriber</div>
					}
					<div><small>{item.action_time}</small></div>
				</li>
			);
		});
	}//End function


	render() {
		const data = this.props.data;
		const percentage = this.props.percentage;
		//console.log(data);
		return (
			<div className="campaign_detail_container">

				<div className="stat Clicked">
					<p className="count">{percentage.clickPer}</p>
					<p className="msg"><b>precent</b> clicks in these emails</p>
				</div>
				<div className="stat Opened">
					<p className="count">{percentage.openPer}</p>
					<p className="msg"><b>percent</b> of these emails opened</p>
				</div>

				<br /><br />
				{this.detailsInList(data)}

				{/* <Row gutter={30}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<b>Activity for Demo campaign 1</b>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<div className="campaign_detail_link">Sent 54 Minutes Ago at 6:18 PM <a href="">(full results)</a></div>
					</Col>
				</Row>
				<div className="last_activity">43 Minutes Ago</div>
				<br /> */}


				{/* <ul className="p-0">
					<li className="activity clicks">
						<div>
							<strong>Clicked</strong>
							<a className="truncate" target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=google&amp;rlz=1C1CHZL_enPK819PK819&amp;oq=google&amp;aqs=chrome..69i57j69i60l2j69i65j69i60.711j0j7&amp;sourceid=chrome&amp;ie=UTF-8">https://www.google.com/search?q=google&amp;rlz=1C1CHZL_enPK819PK819&amp;oq=google&amp;aqs=chrome..69i57j69i60l2j69i65j69i60.711j0j7&amp;sourceid=chrome&amp;ie=UTF-8</a>
						</div>
						<div><span title="Karachi, sindh, Pakistan">Karachi</span></div>
						<div><small>6:28PM</small></div>
					</li>
					<li className="activity clicks">
						<div>
							<strong>Clicked</strong>
							<a className="truncate" target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=google&amp;rlz=1C1CHZL_enPK819PK819&amp;oq=google&amp;aqs=chrome..69i57j69i60l2j69i65j69i60.711j0j7&amp;sourceid=chrome&amp;ie=UTF-8">https://www.google.com/search?q=google&amp;rlz=1C1CHZL_enPK819PK819&amp;oq=google&amp;aqs=chrome..69i57j69i60l2j69i65j69i60.711j0j7&amp;sourceid=chrome&amp;ie=UTF-8</a>
						</div>
						<div><span title="Karachi, sindh, Pakistan">Karachi</span></div>
						<div><small>6:28PM</small></div>
					</li>
					<li className="activity opened">
						<div><strong>Opened</strong> your email</div>
						<div><small>6:28PM</small></div>
					</li>
					<li className="activity opened">
						<div><strong>Opened</strong> your email</div>
						<div><small>6:28PM</small></div>
					</li>
					<li className="activity clicks">
						<div>
							<strong>Clicked</strong>
							<a className="truncate" target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=google&amp;rlz=1C1CHZL_enPK819PK819&amp;oq=google&amp;aqs=chrome..69i57j69i60l2j69i65j69i60.711j0j7&amp;sourceid=chrome&amp;ie=UTF-8">https://www.google.com/search?q=google&amp;rlz=1C1CHZL_enPK819PK819&amp;oq=google&amp;aqs=chrome..69i57j69i60l2j69i65j69i60.711j0j7&amp;sourceid=chrome&amp;ie=UTF-8</a>
						</div>
						<div><span title="Karachi, sindh, Pakistan">Karachi</span></div>
						<div><small>6:28PM</small></div>
					</li>
					<li className="activity opened">
						<div><strong>Opened</strong> your email</div>
						<div><small>6:28PM</small></div>
					</li>
				</ul> */}






			</div>
		);//End return
	}//End render
}//End class

export default withRouter(SubscriberCampaignDetails);