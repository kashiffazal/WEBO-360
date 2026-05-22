/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { withRouter } from "react-router";

class CountryAndLinks extends Component {

	state = {
		click_data: {},
		link_list: {},
		countries_data: {}
	}//End state

	_render_list_tabale = (data) => {
		return data.map((item, i) => {
			return (
				<tr key={i}>
					<td width="80%">
						<a href={item.link} target="_blank" className="linkShort">{item.link}</a>
					</td>
					<td width="20%" align="center">{item.clicks}</td>
				</tr>
			);
		});
	}//End function

	_render_top_countries = (data) => {
		return data.map((item, i) => {
			return (
				<tr key={i}>
					<td width="60%">{item.country}</td>
					<td width="20%" align="center">{item.click}</td>
					<td width="20%" align="center">{item.open}</td>
				</tr>
			);
		});
	}//End function


	_redirect_to_popular_link = () => {
		this.props.history.push('/app/campaigns/reports/linkActivity/' + this.props.match.params.campaignData);
	}//End function


	render() {
		return (
			<div>
				<Row gutter={20}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<div className="sectionTitle">
							<table border="0" width="100%">
								<tbody>
									<tr>
										<td width="80%">Most popular links (<a href="javascript:void(0)" onClick={() => this._redirect_to_popular_link()}>full report</a>)</td>
										<td width="20%" align="center">CLICKS</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="sectionContent">
							<table border="0" width="100%">
								<tbody>
									{this._render_list_tabale(this.state.link_list)}
								</tbody>
							</table>
						</div>
					</Col>
					{/*<Col lg={12} md={12} sm={24} xs={24}>
						<div className="sectionTitle">
							<table border="0" width="100%">
								<tbody>
									<tr>
										<td width="60%">Top countries  </td>
										<td width="20%" align="center">CLICKS</td>
										<td width="20%" align="center">OPENS</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="sectionContent">
							<table border="0" width="100%">
								<tbody>
									{this._render_top_countries(this.state.countries_data)}
								</tbody>
							</table>
						</div>
					</Col>*/}
				</Row>
			</div>
		);//End return
	}//End render
	componentWillMount() {
		let click_data = this.props.data.popular_links;
		let countries_data = this.props.data.top_countries;
		if (click_data.link_list) {
			this.setState({
				click_data: click_data,
				link_list: click_data.link_list,
				countries_data: countries_data
			});

		}//End if condition
	}//End componentWillMount
}//End class

export default withRouter(CountryAndLinks);