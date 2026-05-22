import React, { Component } from 'react';
import Header from '../../header';
import CampaignServices from '../../../campaign_services';
import { Form, Row, Col, Button, Icon, Modal, Spin } from 'antd';
import ESPS from './partial/1_ESPS';
import WhenToSend from './partial/2_whenToSend';
import ConfirmationEmail from './partial/3_confirmationEmail';
import Services from '../../../../../services';
import '../../../styles.css';

const { confirm } = Modal;

class CreateCampaignStep4 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loader: true,
			submitLoader: false,
			prepareLoader: false,
			db_data: {},
			// schedule_field_list: {},
			dateTime: null,
			loaderMsg: "Loading Data, Please wait...",
		}
	}//End constructor

	sendCampaign = (e, notSchedule = true) => {
		if (e) {
			e.preventDefault();
			e.nativeEvent.stopImmediatePropagation();
		}//End if condition
		this.props.form.validateFields((err, values) => {
			if (err) { return false }//End if condition
			//Checking if campaign is schedule then show confirm modal
			if (values.sendType === 'schedule' && notSchedule && this.state.dateTime) { this.confirmSchedule(); return false; }//End if condition
			//this.prepareCampaignAndSend();

			values.id = this.state.db_data.id;
			values.scheduleDateTime = this.state.dateTime || this.state.dateTime;

			//Submit Initial values like ESPS server and account ids, confirmation email send type etc...
			this.setState({ prepareLoader: true, loaderMsg: 'Preparing campaign, Please wait...' });
			Services.http('post', 'campaign/post/step_4/post_initial_values.php', values).then(resInitial => {
				this.setState({ prepareLoader: false });
				if (!resInitial) { return false; }
				//console.log(resInitial);
				if (resInitial.schedule_status) {//If it's schedule then just redirect with some values
					resInitial = { ...resInitial, ...values }
					this.prepareCampaignAndSend(resInitial);
				} else {
					//Send campaign (This structure is for schedule apis purpose if we need to use 3rd party schedule apis )
					this.setState({ submitLoader: true, loaderMsg: (values.sendType === 'schedule' ? 'Scheduling' : 'Sending') + ' campaign, Please wait...' });
					Services.http('get', 'campaign/post/step_4/index.php?id=' + values.id).then(res => {
						this.setState({ submitLoader: false, loaderMsg: '' });
						if (!res) { return false; }
						//console.log(res);
						this.prepareCampaignAndSend(res.data);
					});
				}//End if condition
			});
		});//End form properties
	}//End function

	confirmSchedule = () => {
		let th = this;
		confirm({
			title: 'Schedule Campaign?',
			content: 'Campaign will not be editable after you scheduled it, are you sure to continue?',
			okText: 'Yes',
			cancelText: 'No',
			onOk() { th.sendCampaign(false, false); }
		});
	}//End function

	prepareCampaignAndSend = (data) => {
		//Setting data for 'send page'
		var transferData = {
			campaign_name: CampaignServices.localStorageDecode().cn,
			recipients: this.state.db_data.recipientsCount,
			toBeDelivered: data.sendType,
			confirmationEmail: data.confirmationEmail,
			schedule_date: data.schedule_date,
			report_date: {
				id: CampaignServices.localStorageDecode().cid,
				campaign_name: CampaignServices.localStorageDecode().cn,
				sent_date: data.sent_date + ' ' + data.sent_time,
				recipientsCount: this.state.db_data.recipientsCount,
				bounceCount: ''
			},
		};
		this.props.history.push('/app/createCampaign/step4/send/' + Services.saveArrLocalStorage(transferData))
	}//End function

	render() {
		const st = this.state;
		const fp = this.props.form;
		return (
			<div className="c_c_container">
				<Header title="Send your campaign" desc={CampaignServices.localStorageDecode().cn} stepNumber={4} />
				<Spin spinning={st.submitLoader || st.prepareLoader} tip={st.loaderMsg}>
					{/* {st.loaderMsg && <span className="send_msg_container">{st.loaderMsg}</span>} */}
					{/* {st.submitLoader && <span className="send_msg_container">Sending campaign, Please wait...</span>} */}
					<Row gutter={20}>
						<Col lg={5} md={3} sm={24} xs={24}></Col>
						<Col lg={14} md={18} sm={24} xs={24}>
							<Form onSubmit={this.sendCampaign}>
								{Services.accessControl(1) && <ESPS data={st.db_data} formProps={fp} loader={st.loader} />}
								{Services.accessControl(24) && <WhenToSend onChange={(dateTime) => this.setState({ dateTime })} data={st.db_data} formProps={fp} loader={st.loader} />}
								<ConfirmationEmail formProps={fp} loader={st.loader} />
								<hr className="hr-dashed" /><br />
								<Row gutter={30}>
									<Col lg={8} md={8} sm={9} xs={24}>
										<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')}> <Icon type="left" />Back to snapshot </Button>
									</Col>
									<Col lg={8} md={8} sm={6} xs={24}></Col>
									<Col lg={8} md={8} sm={9} xs={24}>
										<Button className="w-full" size="large" type="primary" loading={st.loader} htmlType="submit">
											{fp.getFieldValue('sendType') === 'schedule' ? 'Send on schedule date' : 'Send campaign now'}
										</Button>
									</Col>
								</Row>
							</Form>
						</Col>
						<Col lg={5} md={3} sm={24} xs={24}></Col>
					</Row>
				</Spin>
			</div>
		);//End return
	}//End render
	componentDidMount() {
		this.setState({ loader: true });
		const id = CampaignServices.localStorageDecode().cid;
		Services.http('get', 'campaign/get/create_form/step_4/index.php?id=' + id).then(res => {
			this.setState({ loader: false });
			if (!res) { return false; }
			//console.log(res);
			this.setState({ db_data: res.data });
			let fv = res.data;
			this.props.form.setFieldsValue({
				esps_sr_id: fv.esps_sr_id,
				sendType: fv.sendType,
				confirmationEmail: fv.confirmationEmail,
			});
		});
	}//End componentDidMount
}//End class
export default Form.create()(CreateCampaignStep4);