/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import CampaignServices from '../campaign_services';
import Services from '../../../services';
import { AntInput } from '../../../externalComponents/antd-fields';
import { Form, Row, Col, Button, Spin } from 'antd';
import '../styles.css';

class TestEmailForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			getLoader: false,
			sendLoader: false,
			testSuccess: false,
			esps_data: {},
			esps_account_list: {}
		}
	}//End constructor


	sendTest = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) { return false }//End if condition
			this.setState({ sendLoader: true });
			values.campaign_id = CampaignServices.localStorageDecode().cid;
			Services.http('post', 'esps_test/index.php', values).then(res => {
				this.setState({ sendLoader: false });
				if (!res) { return false; }
				//console.log(res);
				this.props.testSuccess();
				this.setState({ testSuccess: true });
			});
		});//End form properties
	}//End function


	setESPSaccountList = () => {
		setTimeout(() => {
			this.props.form.setFieldsValue({ 'esps_sr_ac_id': '' });
			let esps_sr_id = this.props.form.getFieldValue('esps_sr_id');
			if (esps_sr_id) {
				this.setState({ esps_account_list: Services.getObjectFromArr(esps_sr_id, 'id', this.state.esps_data).data });
			} else {
				this.setState({ esps_account_list: {} });
			}//End if condition
		}, 10);
	}//End function



	render() {
		const fp = this.props.form;
		const st = this.state;
		const pr = this.props;
		return (
			<Form onSubmit={this.sendTest}>
				<Spin tip={"Loading data, Please wait..."} spinning={st.getLoader}>
					{Services.accessControl(1) ?
						<Row gutter={10}>
							<Col lg={8} md={8} sm={24} xs={24}>
								<AntInput label="Email" type={pr.emailText ? 'text' : 'email'} name="to_email" formProps={fp} placeholder="Please type your email" />
							</Col>
							<Col lg={8} md={8} sm={24} xs={24}>
								<AntInput filter={true} type="select" label="ESPS Server" name="esps_sr_id" formProps={fp} options={st.esps_data} setValueLabel={['id', 'server_name']} onChange={() => this.setESPSaccountList()} />
							</Col>
							<Col lg={8} md={8} sm={24} xs={24}>
								<AntInput filter={true} type="select" label="Account Name" name="esps_sr_ac_id" formProps={fp} options={st.esps_account_list} setValueLabel={['id', 'account_name']} />
							</Col>
						</Row>
						:
						<AntInput label="Email" type="email" name="to_email" formProps={fp} placeholder="Please type your email" />
					}
					<p className="m-0 p-t-15 p-b-15">For test emails, personalization tags are replaced with the fallback terms you supplied.</p>
					<Button htmlType="submit" size="large" loading={st.sendLoader}>Sent the test email</Button>
					{st.sendLoader && <span className="dis-inline-block p-l-15 fs-12 text-blue-2">Sending test email, Please wait...</span>}
				</Spin>
			</Form>
		);//End return
	}//End render
	componentWillMount() {
		//const id = CampaignServices.localStorageDecode().cid;
		//if(!id || id === '0'){return false;}

		this.setState({ getLoader: true });
		Services.http('get', 'esps/get/server_list_test_email.php').then(res => {
			if (!res) { return false; }
			this.setState({ getLoader: false, esps_data: res.data });
			this.props.form.setFieldsValue({ to_email: res.test_data.to_email });
			if (Services.accessControl(1)) {
				this.props.form.setFieldsValue({ esps_sr_id: "" })
			}//End if condition
		});
	}//End componentDidMount
}//End class

export default Form.create()(TestEmailForm);