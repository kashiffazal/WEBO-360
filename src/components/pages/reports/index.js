import React, { Component } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import Services from '../../services';
import SideNavigation from '../../mutual/sideNavigation';
import Header from './index_partials/0_header_page';
import HeaderChart from './index_partials/1_header_chart';
import LineChart from './index_partials/2_lineChart';
import PieChart from './index_partials/3_pieChart';
import CountryAndLinks from './index_partials/4_country_and_links';

class CampaignReports extends Component {
	constructor(props) {
		super(props)
		this.state = {
			campaignInitialValues: {},
			campaignData: {},
			loader: false,
		}//End state object
	}//End constructor

	getData = () => {
		this.setState({ loader: true });
		let state_id = this.state.campaignInitialValues[0];
		Services.http('get', 'reporting/chart/index.php?id=' + state_id + '&type=1').then(res => {
			this.setState({ loader: false });
			if (!res) { window.history.go(-1); return false; }
			//console.log(res);
			this.setState({ campaignData: res });
		});
	}//End function

	render() {
		const st = this.state;
		return (
			<div className="container">
				<Spin spinning={st.loader}>
					{st.loader ? <div className="h-300 flex-c-m"><Empty description="Loading data, Please wait..." /></div> :
						<React.Fragment>
							<Row gutter={40}>
								<Col lg={19} md={24} sm={24} xs={24}>
									<Header data={st.campaignInitialValues} />
									<div className="reportContainer">
										{st.campaignData.xAxis &&
											<span>
												<HeaderChart data={st.campaignInitialValues} listArr={st.campaignData.pieGraph.campaign_details.list_names}/>
												<LineChart data={st.campaignData} />
												<PieChart data={st.campaignData.pieGraph} campaign_id={this.state.campaignInitialValues[0]} />
												<CountryAndLinks data={st.campaignData.pieGraph} />
											</span>
										}
									</div>
								</Col>
								<Col lg={5} md={24} sm={24} xs={24}>
									<SideNavigation title="You might also want to..." btn="cc" links="ac,ms,smtp,um" />
								</Col>
							</Row>
						</React.Fragment>
					}
				</Spin>
			</div>
		);//End return
	}//End render

	componentWillMount() {
		let campaignInitialValues = Services.loadArrLocalStorage(this.props.match.params.campaignData);
		this.setState({ campaignInitialValues }, () => { this.getData(); });
	}//End componentDidMount

}//End class

export default CampaignReports;