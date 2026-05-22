import React, { Component } from 'react';
import { Popconfirm, Spin } from 'antd';
import Services from '../../../../../../services';
import CampaignServices from '../../../../campaign_services';
import '../../../../styles.css';
class MoreOptions extends Component {
	constructor(props) {
		super(props);
		this.state = { loader: false, recentTemplate: [] };
	}//End constructor


	render() {
		return (

			<div className="side_mutual">
				<h3>Recent Template</h3>
				<div className="recentTemplateArea">
					<Spin spinning={this.state.loader} tip={<span>Loading Recent Template,<br />Please wait...</span>}>
						<ul>
							{this.state.loader ?
								<div style={{ 'height': '200px' }}></div>
								: this.state.recentTemplate.map((item, i) => {
									return (
										<li key={i}>
											{item.campaign_name}
											<br /><a onClick={() => CampaignServices.openPreview(item.html, 'current_html_preview')}>View</a> | &nbsp;
											<Popconfirm placement="right" title="Are you sure to replace content in template editor?" onConfirm={() => this.props.useRecentTemplate(item.html)} okText="Yes" cancelText="No"><a>Use</a></Popconfirm>
										</li>
									)
								})}
						</ul>
					</Spin>
				</div>
			</div>

		);//End class
	}//End render

	componentDidMount() {
		//Getting Recent Sent Template
		this.setState({ loader: true }, () => {
			Services.http("get", "campaign/get/create_form/step_2/get_recent_template.php").then(res => {
				this.setState({ loader: false, recentTemplate: res.data });
			});
		});
	}//End componentDidMount

}//End class

export default MoreOptions;