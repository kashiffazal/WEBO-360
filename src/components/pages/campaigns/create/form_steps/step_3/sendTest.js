/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import Header from '../../header';
import CampaignServices from '../../../campaign_services';
import { Row, Col, Button, Icon } from 'antd';
import TestEmailForm from '../../test_email_form';
import '../../../styles.css';

class SendTest extends Component {
	state = {testSuccess : false}
	render() {
		const st = this.state;
		return (
			<div className="c_c_container">
				<Header title="Test your campaign" desc={CampaignServices.localStorageDecode().cn} stepNumber={3} />
				<Row gutter={20}>
					<Col lg={5} md={3} sm={24} xs={24}></Col>
					<Col lg={14} md={18} sm={24} xs={24}>
						<TestEmailForm testSuccess={() => this.setState({testSuccess : true})}/>
						<br /><br /><hr className="hr-dashed" /><br />
						<Button onClick={() => this.props.history.push('/app/createCampaign/step4')} type="primary" size="large">
							{st.testSuccess ? 'Next' : 'Skip the test '}
							<Icon type="arrow-right" />
						</Button>
						&nbsp;&nbsp;or&nbsp;&nbsp;
						<a href="javascript:void(0)" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')}>return to snapshot</a>
						<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
					</Col>
					<Col lg={5} md={3} sm={24} xs={24}></Col>
				</Row>
			</div>
		);//End return
	}//End render
}//End class

export default SendTest;