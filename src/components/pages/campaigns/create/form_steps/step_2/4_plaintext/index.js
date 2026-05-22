import React, { Component } from 'react';
import { Row, Col, Button, Icon, Spin } from 'antd';
import CampaignServices from '../../../../campaign_services';
import Header from '../../../header';
import '../../../../styles.css';
import HTMLEditor from '../../../../../../externalComponents/andt-text-html-editor';
import Services from '../../../../../../services';

class Plaintext extends Component {
	constructor(props) {
		super(props);
		this.state = { getHTMLLoader: false, plainTextValue: '', loader: false, renderLoader: false }
	}//End constructor


	getPlainTextFromHTML = () => {
		let id = CampaignServices.localStorageDecode().cid;
		if (!id || id === '0') { return false }//End if condition

		this.setState({ getHTMLLoader: true });
		Services.http('get', 'campaign/get/create_form/step_2/get_plaintext_from_html.php?id=' + id).then(res => {
			this.setState({ getHTMLLoader: false });
			if (!res) { return false; }
			this.setState({ plainTextValue: res.data })
		});
	}//End function


	createPlainText = (value) => {
		let id = CampaignServices.localStorageDecode().cid;
		if (!id || id === '0') { return false }//End if condition

		let postData = {};
		postData.plainText = value;
		postData.id = id;

		this.setState({ loader: true });
		Services.http('post', 'campaign/post/step_2/paintext.php', postData).then(res => {
			this.setState({ loader: false });
			if (!res) { return false; }
			CampaignServices.localStorageDecode().snp ?
				this.props.history.push('/app/createCampaign/step3/snapshot') :
				this.props.history.push('/app/createCampaign/step3/');
		});
	}//End function



	render() {
		return (
			<div className="c_c_container">
				<Header title="Choose a starting point" desc={CampaignServices.localStorageDecode().cn} stepNumber={2} />
				<Row gutter={20}>
					<Col lg={5} md={1} sm={24} xs={24}></Col>
					<Col lg={14} md={22} sm={24} xs={24}>
						<h3 className="fs-18 fw-bold m-b-3">Plain text email</h3>
						<p className="text-gray-1">
							Enter the plain text version below or <u><a disabled={this.state.renderLoader} onClick={() => this.getPlainTextFromHTML()}>import it from your HTML</a></u> as a starting point.
							{this.state.getHTMLLoader && <span>&nbsp;&nbsp;&nbsp;<img src={`${process.env.PUBLIC_URL}/image/h-loader_2.gif`} width="80px" alt="" /></span>}
						</p>
						<Spin spinning={this.state.loader || this.state.renderLoader} tip="Loading, Please wait...">
							<br />
							<HTMLEditor
								get="code-editor"
								value={this.state.plainTextValue}
								onChange={(value) => this.setState({ plainTextValue: value })}
							/>
							<br />
						</Spin>
						<hr className="hr-dashed" />
						<br />
						<Row gutter={30} className="btn_container">
							<Col lg={7} md={8} sm={24} xs={24}>
								{CampaignServices.localStorageDecode().snp ?
									<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')} disabled={this.state.renderLoader}> <Icon type="left" />Back </Button> :
									<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step2/template')} disabled={this.state.renderLoader}> <Icon type="left" />Previous </Button>
								}{/** End snapshop edit condition*/}
							</Col>
							<Col lg={10} md={8} sm={24} xs={24}>
								<div>{this.state.fileMissingError}</div>
							</Col>
							<Col lg={7} md={8} sm={24} xs={24}>
								<Button onClick={() => this.createPlainText(this.state.plainTextValue)} className="w-full" size="large" type="primary" loading={this.state.loader} disabled={this.state.renderLoader}>
									{CampaignServices.localStorageDecode().snp ? 'Save' :
										<span>Next {this.state.loader ? '' : <Icon type="right" />}</span>
									}{/** End snapshop edit condition*/}
								</Button>
							</Col>
						</Row>


					</Col>
					<Col lg={5} md={1} sm={24} xs={24}></Col>
				</Row>
			</div>
		);//End return
	}//End render

	componentDidMount() {
		let id = CampaignServices.localStorageDecode().cid;
		if (!id || id === '0') { return false }//End if condition

		this.setState({ renderLoader: true });
		Services.http('get', 'campaign/get/create_form/step_2/get_plaintext.php?id=' + id).then(res => {
			this.setState({ renderLoader: false });
			if (!res) { return false; }
			this.setState({ plainTextValue: res.data })
		});
	}//End componentDidMount
}//End class

export default Plaintext;