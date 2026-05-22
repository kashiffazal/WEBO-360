/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Row, Col, Spin } from 'antd';
import Services from '../../services';
import SideNavigation from '../../mutual/sideNavigation';
import LinkHeader from './linkActivity_partials/1_header';
import ClickDetails from './linkActivity_partials/2_click_details';
import LinkList from './linkActivity_partials/3_link_list';

class LinkActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			campaignInitialValues: {},
			loader: false,
			links_data: {
				details: {},
			},
		}//End state
	}//End constructor

	getData = () => {
		this.setState({ loader: true });
		let state_id = this.state.campaignInitialValues[0];
		Services.http('get', 'reporting/popularLinks/index.php?id=' + state_id + '&type=1').then(res => {
			this.setState({ loader: false });
			this.setState({ links_data: res.popular_links });
		});
	}//End function

	render() {
		const campaignData = this.state.campaignInitialValues;
		return (
			<div className="container">
				<Row gutter={40}>
					<Col lg={19} md={24} sm={24} xs={24} className="reportContainer">
						<LinkHeader data={campaignData} />
						<h3 className="pageTitle m-0">Link Activity & Overlay</h3>
						<p className="m-0 fs-12"><span className="fs-14">{campaignData[1]}</span> - Sent on {campaignData[2].split(',')[0]} at {campaignData[2].split(',')[1]}</p>
						<hr className="hr-dashed" />
						<br />
						<Spin spinning={this.state.loader} tip="Loading Data, Please wait..." >
							<ClickDetails data={this.state.links_data.details} />
						</Spin>
						<LinkList data={this.state.links_data.link_list} campaign_id={campaignData[0]} />
					</Col>
					<Col lg={5} md={24} sm={24} xs={24}>
						<SideNavigation title="You might also want to..." btn="cc" links="ac,ms,smtp,um" />
					</Col>
				</Row>
			</div>
		);//End return
	}//End render
	componentWillMount() {
		let campaignInitialValues = Services.loadArrLocalStorage(this.props.match.params.campaignData);
		this.setState({ campaignInitialValues }, () => { this.getData(); });
		//let sessionValue = localStorage.getItem(this.props.match.params.campaignData);
		// if (!sessionValue) { alert("Incorrect URL"); this.props.history.goBack(); return; }//End function
		// let campaignInitialValues = Services.decode64(sessionValue).split('=>');
		// this.setState({ campaignInitialValues }, () => {this.getData();});
	}//End componentDidMount
}//End class

export default LinkActivity;