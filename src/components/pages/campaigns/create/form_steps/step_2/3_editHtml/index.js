import React, { Component } from 'react';
import { Row, Col, message, Button, Icon, Spin } from 'antd';
import Header from '../../../header';
import CampaignServices from '../../../../campaign_services';
import HTMLEditor from '../../../../../../externalComponents/andt-text-html-editor';
import '../../../../styles.css';
import Tags from '../mutual/tags';
import Services from '../../../../../../services';

class Edit_HTML extends Component {

	constructor(props) {
		super(props);
		this.state = { editorValue: '', tagList: [], renderLoader: false, loader: false };
	}//End constructor


	_handleEditor = (value) => {
		if (!value) { message.error("Please type some HTML"); return false; }

		let postData = {};
		postData.html = value;
		postData.id = CampaignServices.localStorageDecode().cid;

		this.setState({ loader: true });
		Services.http('post', 'campaign/post/step_2/editHTML.php', postData).then(res => {
			//console.log(res.data);
			this.setState({ loader: false });
			if (!res) { return false; }
			this.props.history.push('/app/createCampaign/step2/template');
		});
	}//End function



	render() {
		return (
			<div className="c_c_container">
				<Header title="Edit HTML template" desc={CampaignServices.localStorageDecode().cn} stepNumber={2} />
				<Row gutter={40}>
					<Col lg={19} md={17} sm={24} xs={24}>
						<Spin spinning={this.state.loader || this.state.renderLoader} tip="Loading data, Please wait...">
							<br />
							<HTMLEditor
								value={this.state.editorValue}
								//tabType="card"
								get="code-editor"
								tabNames={['Template Editor', 'HTML Editor']}
								onChange={(value) => {
									this.setState({ editorValue: value })
									//console.log(value);
								}}
							/>
						</Spin>
						<hr className="hr-dashed m-t-0 m-b-20" />
						<Row gutter={30} className="btn_container">
							<Col lg={5} md={7} sm={10} xs={24}>
								<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step2/template')} disabled={this.state.renderLoader}> <Icon type="left" />Previous </Button>
							</Col>
							<Col lg={14} md={10} sm={4} xs={24}></Col>
							<Col lg={5} md={7} sm={10} xs={24}>
								<Button onClick={() => this._handleEditor(this.state.editorValue)} className="w-full" type="primary" size="large" loading={this.state.loader} disabled={this.state.renderLoader}>
									<span>Next{this.state.loader ? '' : <Icon type="right" />}</span>
								</Button>
							</Col>
						</Row>
						<br />


					</Col>
					<Col lg={5} md={7} sm={24} xs={24}>
						<Tags />
						<hr className="hr-dashed" />
						<a disabled={this.state.renderLoader} onClick={() => CampaignServices.openPreview(this.state.editorValue, 'current_html_preview')}>Current HTML Preview</a>
					</Col>
				</Row>
			</div>
		);//End return
	}//End render

	componentDidMount() {
		//Getting Tags
		let tagList = Services.loadArrLocalStorage(window.htmlTagsLocalStorage);
		this.setState({ tagList });
		//Getting template for preview ---------------------------//
		this.setState({ renderLoader: true }, () => {
			CampaignServices.renderTemplate().then(res => {
				//console.log(res);
				this.setState({ renderLoader: false, editorValue: res });
			}).catch(error => { console.log(error); this.setState({ renderLoader: false }); });
		});
		/** -------------------------------------------------------*/
	}//End componentDidMount

}//Enc class

export default Edit_HTML;