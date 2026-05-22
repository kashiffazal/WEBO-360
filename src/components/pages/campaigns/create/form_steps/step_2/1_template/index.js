import React, { Component } from 'react';
import { Row, Col, Spin } from 'antd';
import CampaignServices from '../../../../campaign_services';
import Services from '../../../../../../services';
import Header from '../../../header';
import Issues from './issues';
import TestEmailForm from '../../../test_email_form';
import '../../../../styles.css';

class TemplateDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			renderLoader: false,
			//preview: null,
			problems: {},
			showTestEmailField: false,
			smtp_data: {}
		};
	}//End constructor

	submit_unsubscribe_tag = () => {
		const id = CampaignServices.localStorageDecode().cid;
		if (!id || id === '0') { return false; }
		this.setState({ renderLoader: true });
		Services.http('post', 'campaign/post/step_2/editHTML.php', {
			//html: htmlData,
			id: id,
			add_unsubscribe_tag: true,
		}).then(res => {
			this.setState({ renderLoader: false });
			if (!res) { return false; }
			CampaignServices.localStorageDecode().snp ?
				this.props.history.push('/app/createCampaign/step3/snapshot') :
				this.props.history.push('/app/createCampaign/step2/plaintext');
		});
	}//End function



	render() {
		const campaign_id = CampaignServices.localStorageDecode().cid;
		return (
			<div className="c_c_container">
				<Header title="Choose a starting point" desc={CampaignServices.localStorageDecode().cn} stepNumber={2} />
				<Spin spinning={this.state.renderLoader} tip="Loading, Please wait..." >

					<Row gutter={20}>
						<Col lg={5} md={24} sm={24} xs={24}></Col>
						<Col lg={14} md={24} sm={24} xs={24}>

							<div className="successBig fs-16">
								<span className="heading fw-bold p-r-10">Your campaign was successfully imported.</span>
								<span className="regular"> <a onClick={() => { CampaignServices.openPreview(campaign_id) }}>Preview it</a> {Services.accessControl(25) && <span>or <a onClick={() => this.setState({ showTestEmailField: !this.state.showTestEmailField })}>send a test email</a>.</span>}</span>
							</div>

							{this.state.showTestEmailField &&
								<div>
									<h2>Send an email test to...</h2>
									<p>Send up to 5 addresses at once by separating them with a comma.</p>
									<div className="testEmailContainer">
										<TestEmailForm testSuccess={() => this.setState({ showTestEmailField: false })} emailText={true} />
									</div>
									<br />
								</div>
							}

							<Issues
								data={this.state.problems}
								//previewHtml={this.state.preview}
								btnLoader={this.state.btnLoader}
								submit_unsubscribe_tag={() => this.submit_unsubscribe_tag()}
							/>

						</Col>
						<Col lg={5} md={24} sm={24} xs={24}></Col>
					</Row>
				</Spin>
			</div>
		);//End return
	}//End render

	componentWillMount() {
		const id = CampaignServices.localStorageDecode().cid;
		if (!id || id === '0') { return false; }
		this.setState({ renderLoader: true });
		Services.http('get', 'campaign/get/create_form/step_2/get_template.php?id=' + id).then(res => {
			this.setState({ renderLoader: false });
			if (!res) { return false; }
			//console.log(res);
			this.setState({
				renderLoader: false,
				problems: res.problems,
				//preview : res.html,
				smtp_data: res.smtp
			});
		});
	}//End componentWillMount

}//End class


export default TemplateDetails;