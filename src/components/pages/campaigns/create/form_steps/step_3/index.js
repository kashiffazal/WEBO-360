import React, { Component } from 'react';
import { Form, Button, Icon, Row, Col, Spin } from 'antd';
import Header from '../../header';
import CampaignServices from '../../../campaign_services';
import '../../../styles.css';
import SubscriberList from './partials/0_subscriberList';
import Services from '../../../../../services';

class CreateCampaignStep3 extends Component {

	constructor(props) {
		super(props);
		this.state = { loader: false, getLoader: false, listData: [], totalEmails: 0, totalUniqueEmails: 0, selectedList: null };
	}//End constructor


	submitForm = () => {
		let postVar = {};
		postVar.id = CampaignServices.localStorageDecode().cid;
		postVar.list_ref_id = this.state.selectedList;

		this.setState({ getLoader: true });
		Services.http('post', 'campaign/post/step_3/index.php', postVar).then(res => {
			this.setState({ getLoader: false });
			if (!res) { return false; }
			this.props.history.push('/app/createCampaign/step3/snapshot');
		});
	}//End fucntion

	onCheckboxChange = (item) => {
		let status = !item.checked
		let listData = this.state.listData;
		listData[item.index].checked = status;
		this.setState({ listData }, () => {
			let totalEmails = this.state.totalEmails;
			//let totalUniqueEmails = this.state.totalUniqueEmails;
			if (status) {
				totalEmails = parseInt(totalEmails, 0) + parseInt(listData[item.index].count, 0);
				//totalUniqueEmails = parseInt(totalUniqueEmails, 0) + parseInt(listData[item.index].uniqueEmailcount, 0);
			} else {
				totalEmails = parseInt(totalEmails, 0) - parseInt(listData[item.index].count, 0);
				//totalUniqueEmails = parseInt(totalUniqueEmails, 0) - parseInt(listData[item.index].uniqueEmailcount, 0);
			}//End if condition
			this.setState({ totalEmails });
			//this.setState({ totalUniqueEmails });
			this.getSelectedList(this.state.listData);//Get selected id from list
		});
	}//End function

	getSelectedList = (data) => {
		let selectedList = [];
		data.forEach(item => { if (item.checked) { selectedList.push(item.id); } });
		selectedList = selectedList.join(',');
		this.setState({ selectedList });
	}//End function

	render() {
		return (
			<div className="c_c_container">
				<Header title="Who will receive this campaign?" desc={CampaignServices.localStorageDecode().cn} stepNumber={3} />

				<Row gutter={20}>
					<Col lg={5} md={1} sm={24} xs={24}></Col>
					<Col lg={14} md={22} sm={24} xs={24}>

						<Spin tip="Loading, Please wait..." spinning={this.state.loader} >
							<SubscriberList
								data={this.state.listData}
								onChange={(item) => this.onCheckboxChange(item)}
								details={{
									total: this.state.totalEmails,
									//unique: this.state.totalUniqueEmails
								}}
								preview={false}
							/>
						</Spin>
						<hr className="hr-dashed" /><br />
						<Row gutter={30}>
							<Col lg={6} md={6} sm={9} xs={24}>
								{CampaignServices.localStorageDecode().snp ?
									<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')} disabled={this.state.loader}> <Icon type="left" />Back </Button> :
									<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step2/plaintext')} disabled={this.state.loader}> <Icon type="left" />Previous </Button>
								}{/** End snapshop edit condition*/}
							</Col>
							<Col lg={12} md={12} sm={6} xs={24}></Col>
							<Col lg={6} md={6} sm={9} xs={24}>
								<Button onClick={() => this.submitForm()} className="w-full float-r" size="large" type="primary" htmlType="submit" loading={this.state.getLoader} disabled={!this.state.totalEmails || this.state.loader}>
									{CampaignServices.localStorageDecode().snp ? 'Save' :
										<span>Next{this.state.loader ? '' : <Icon type="right" />}</span>
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
		const id = CampaignServices.localStorageDecode().cid;
		this.setState({ loader: true });
		Services.http('get', 'campaign/get/create_form/step_3/get_recipient_list.php?id=' + id).then(res => {
			this.setState({ loader: false });
			if (!res) { return false; }
			//console.log(res,id);
			this.setState({ listData: res.data, totalEmails: res.totalEmails, totalUniqueEmails: res.totalUniqueEmails, });
			this.getSelectedList(res.data);
		});
	}//End componentDidMount

}//End class

export default Form.create()(CreateCampaignStep3);