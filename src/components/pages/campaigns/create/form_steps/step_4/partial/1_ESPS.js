import React, { Component } from 'react';
import { Row, Col, Spin } from 'antd';
import ESPSModal from '../../../../../esps_mailing_account/add_ESPS_modal';
import Services from '../../../../../../services';
import { AntInput } from '../../../../../../externalComponents/antd-fields';

class ESPS extends Component {

	constructor(props) {
		super(props);
		this.state = {
			updateLoade: false,
			visibleModal: false,
			esps_account_list: {},
			esps_updated_data: null
			// esps_data: []
		}
	}//End constructor

	getESPSupdatedData = () => {
		this.setState({ updateLoade: true });
		Services.http('get', 'esps/get/server_list_test_email.php').then(res => {
			//console.log(res.data);
			this.props.formProps.setFieldsValue({ 'esps_sr_id': '', 'esps_sr_ac_id': '' });
			this.setState({ updateLoade: false, esps_updated_data: res.data });
		});
	}//End function

	setESPSaccountList = () => {
		setTimeout(() => {
			let esps_data = this.state.esps_updated_data || this.props.data.esps_servers.data;
			this.props.formProps.setFieldsValue({ 'esps_sr_ac_id': '' });
			let esps_sr_id = this.props.formProps.getFieldValue('esps_sr_id');
			if (esps_sr_id) {
				this.setState({ esps_account_list: Services.getObjectFromArr(esps_sr_id, 'id', esps_data).data });
			} else {
				this.setState({ esps_account_list: {} });
			}//End if condition
		}, 10);
	}//End function


	render() {
		const pr = this.props.data;
		const fp = this.props.formProps;
		const st = this.state;
		return (
			<div>
				<div className="snapshot_title">
					<h3>Send campaign by ESPS Mailing Account(s)</h3>
					<p>Please select the Mailing Account to send the campaign. <a onClick={() => this.setState({ visibleModal: true })}>Add New Delivery Server.</a></p>
				</div>

				<ESPSModal
					visible={st.visibleModal}
					onCancel={() => this.setState({ visibleModal: false })}
					callBack={() => this.getESPSupdatedData()}
				/>
				{st.visibleModal && <AntInput label="Temp" className="dis-none-imp" containerClassName="hide-required-label" name="Temp" formProps={fp} />}
				<Spin tip="Updating data, Please wait..." spinning={st.updateLoade}>
					<Spin tip="Loading data, Please wait..." spinning={this.props.loader}>
						<div className="campaignDetailPreview m-b-30">
							<Row gutter={20}>
								<Col lg={12} md={12} sm={24} xs={24}>
									<AntInput filter={true} type="select" label="ESPS Server" name="esps_sr_id" formProps={fp} options={
										(st.esps_updated_data ? st.esps_updated_data : (pr.esps_servers && pr.esps_servers.data))
									} setValueLabel={['id', 'server_name']} onChange={() => this.setESPSaccountList()} />
								</Col>
								<Col lg={12} md={12} sm={24} xs={24}>
									<AntInput filter={true} type="select" label="Account Name" name="esps_sr_ac_id" formProps={fp} options={st.esps_account_list} setValueLabel={['id', 'account_name']} />
								</Col>
							</Row>

						</div>
					</Spin>
				</Spin>
			</div>
		);//End return
	}//End render
	componentWillReceiveProps(newProps) {
		if (this.props.data !== newProps.data) {
			this.setESPSaccountList();
			setTimeout(() => { this.props.formProps.setFieldsValue({ esps_sr_ac_id: newProps.data.esps_sr_ac_id }); }, 100);
		}//End if copndition
	}//End componentDidMount
}//End class

export default ESPS;