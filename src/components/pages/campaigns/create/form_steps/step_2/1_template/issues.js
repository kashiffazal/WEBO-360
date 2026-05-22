import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Row, Col, Radio, Button, Icon } from 'antd';
import CampaignServices from '../../../../campaign_services';

const RadioGroup = Radio.Group;

class Issues extends Component {

	state = { radioValue: null }

	takeAction = () => {
		let action = this.state.radioValue;
		if (action === 0) {
			//this.props.submit_unsubscribe_tag(this.props.previewHtml);
			CampaignServices.localStorageDecode().snp ? 
			this.props.history.push('/app/createCampaign/step3/snapshot') : 
			this.props.history.push('/app/createCampaign/step2/plaintext');
		}//End if condition
		if (action === 1) {
			//let campaign_id = CampaignServices.localStorageDecode().cid;
			//let htmlData = CampaignServices.openPreview(CampaignServices.localStorageDecode().cid,'addsubscribehtml');
			this.props.submit_unsubscribe_tag();//Means add unsubscribe in template
		}//End if condition
		if (action === 2) {
			this.props.history.push('/app/createCampaign/step2/');
		}//End if condition
		if (action === 3) {
			this.props.history.push('/app/createCampaign/step2/edithtml');
		}//End if condition
	}//End function

	_goBack = () => {
		let chtml = localStorage.getItem('chtml');
		if(chtml){
			localStorage.removeItem('chtml');
			this.props.history.push('/app/createCampaign/step2/editor');
		}else{
			this.props.history.push('/app/createCampaign/step2')
		}//End if condition
	}//End function

	render() {
		const radioStyle = { display: 'block', height: '30px', lineHeight: '30px' };
		const problems = this.props.data;
		const problemsLength = Object.keys(problems).length;
		const campaign_id = CampaignServices.localStorageDecode().cid;
		return (	
			<div>
				{problemsLength >= 1 &&
					<span>
						<h2>We noticed the following issues you might want to fix...</h2>
						<div className="problems_container">
							<Row>
								<Col lg={8} md={8} sm={12} xs={12}><b>Problem</b></Col>
								<Col lg={16} md={16} sm={12} xs={12}><b>Solution</b></Col>
							</Row>
							{
								problems.script &&
								<Row>
									<Col lg={8} md={8} sm={24} xs={24}>
										<span className="pro_label">JavaScript detected</span>
									</Col>
									<Col lg={16} md={16} sm={24} xs={24}>
										<p>Almost every popular email client and spam filter does not support JavaScript. Your campaign will either be filtered as spam, or will display a security warning to your recipients. We <strong>recommend removing all JavaScript code</strong> from your campaign and then re-import it.</p>
									</Col>
								</Row>
							}
							{
								problems.unsubscribe &&
								<Row>
									<Col lg={8} md={8} sm={24} xs={24}>
										<span className="pro_label">No unsubscribe link</span>
									</Col>
									<Col lg={16} md={16} sm={24} xs={24}>
										<p>We require a single-click unsubscribe link in every campaign you send. To add an unsubscribe link, you can...</p>
										<p><strong>Do it yourself</strong> - by adding the tags <code>&lt;unsubscribe&gt;</code> and <code>&lt;/unsubscribe&gt;</code> around the words you want to become an unsubscribe link, and then re-import your campaign.</p>
										<p><strong>Let us do it automatically</strong> - We can add an unsubscribe link to the bottom of your email automatically. It might not match your design perfectly (<a onClick={() => CampaignServices.openPreview(campaign_id, 'view_unsubscribe_tag')}>here's a preview</a> of how it will look), so for the best results we recommend the first option.</p>
									</Col>
								</Row>
							}
						</div>
					</span>
				}{/* End problem condition*/}

				<h2 className="p-t-30 p-b-10">What would you like to do?</h2>
				<RadioGroup onChange={(e) => this.setState({ radioValue: e.target.value })} value={this.state.radioValue}>
					{problemsLength === 0 && <Radio style={radioStyle} value={0}>Continue, I'm happy with the preview</Radio>}
					{
						problems.unsubscribe && problems.script ?
							<Radio style={radioStyle} value={1}>Add an unsubscribe link for me and ignore the other issues</Radio> :
							<span>
								{problems.unsubscribe ? <Radio style={radioStyle} value={1}>Add an unsubscribe link for me and continue</Radio> : ''}
								{problems.script ? <Radio style={radioStyle} value={0}>Ignore any issues and continue</Radio> : ''}
							</span>
					}
					<Radio style={radioStyle} value={2}>Re-import the campaign</Radio>
					<Radio style={radioStyle} value={3}>Edit the HTML</Radio>
				</RadioGroup>

				<br /><hr className="hr-dashed" /><br />
				<Row gutter={20} className="btn_container">
					<Col lg={6} md={7} sm={24} xs={24}>
						{!CampaignServices.localStorageDecode().snp &&
							<Button className="w-full" size="large" type="primary" onClick={() => this._goBack()}> <Icon type="left" />Previous </Button>
						}{/** End snapshop edit condition*/}
					</Col>
					<Col lg={12} md={10} sm={24} xs={24}></Col>
					<Col lg={6} md={7} sm={24} xs={24}>
						<Button type="primary" disabled={this.state.radioValue === null} className="w-full" size="large" onClick={() => this.takeAction()}>
							{CampaignServices.localStorageDecode().snp ? 'Save' : 'Next'}{/** End snapshop edit condition*/}
						</Button>
					</Col>
				</Row>

			</div>
		);//End return
	}//End render

	// componentWillReceiveProps(nextProps){
	// 	const pLength = Object.keys(nextProps.data).length;
	// 	//if(pLength === 0){this.setState({radioValue : 0});}//End if condition
	// }//End componentDidMount

}//End class

export default withRouter(Issues);