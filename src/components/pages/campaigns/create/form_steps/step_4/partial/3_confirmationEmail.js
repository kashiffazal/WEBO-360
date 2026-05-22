/*eslint-disable no-useless-escape*/
import React, { Component } from 'react';
import { AntInput } from '../../../../../../externalComponents/antd-fields';
import { Spin } from 'antd';
class ConfirmationEmail extends Component {
	render() {
		const fp = this.props.formProps;
		return (
			<div>
				<div className="snapshot_title">
					<h3>Confirmation email</h3>
					<p>Send confirmation to the following email address when the campaign has been sent.</p>
				</div>
				<Spin tip="Loading data, Please wait..." spinning={this.props.loader}>
					<div className="campaignDetailPreview">
						<AntInput type="email" name="confirmationEmail" placeholder="Type confirmation email" formProps={fp} />
					</div>
					<br />
				</Spin>
			</div>
		);//end return
	}//End render
}//End class
export default ConfirmationEmail;