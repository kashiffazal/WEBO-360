import React, { Component } from 'react';
import Header from '../../header';
import CampaignServices from '../../../campaign_services';
import Services from '../../../../../services';
import { Row, Col, Button, Icon } from 'antd';
import '../../../styles.css';

import Sender from './partials/1_sender';
import Preview from './partials/2_preview';
import SList from './partials/3_list';
import ScheduleDate from './partials/4_schedule_date';

class Snapshot extends Component {
	constructor(props) {
		super(props);
		this.state = { loader: false, data: {}, editDisabled: false }
	}//End constructor


	edit = (url) => {
		localStorage.setItem('snp', true);
		this.props.history.push('/app/createCampaign/' + url);
	}//End function

	render() {
		const cd = this.state.data;
		const edit = this.state.editDisabled;
		return (
			<div className="c_c_container">
				<Header title="Campaign Snapshot" desc={CampaignServices.localStorageDecode().cn} stepNumber={3} />
				<Row gutter={20}>
					<Col lg={5} md={3} sm={24} xs={24}></Col>
					<Col lg={14} md={18} sm={24} xs={24}>
						<Sender data={cd} edit={(url) => this.edit(url)} disabledEdit={edit} loader={this.state.loader}/>
						{cd.html ?
							<span>
								<br /><br />
								<Preview data={cd} edit={(url) => this.edit(url)} disabledEdit={edit} loader={this.state.loader}/>
								{cd.list_ref_id ?
									<span>
										<br /><br />
										<SList data={cd} edit={(url) => this.edit(url)} disabledEdit={edit} loader={this.state.loader}/>
										{!edit ?
											<span>
												<br /><hr className="hr-dashed" /><br />
												<div className="text-right">
													<Button onClick={() => this.props.history.push('/app/createCampaign/step4')} size="large" type="primary">
														Delivery <Icon type="right" />
													</Button>
													{Services.accessControl(25) &&
														<span>
															&nbsp;&nbsp;or&nbsp;&nbsp;
															<Button onClick={() => this.props.history.push('/app/createCampaign/step3/sendTest')} size="large">
																Send a test
															</Button>
														</span>
													}
												</div>
											</span>
											:
											<ScheduleDate data={cd.scheduleDateTime} loader={this.state.loader}/>
										}

									</span>
									:
									<span>
										<br /><hr className="hr-dashed" /><br />
										<Button onClick={() => this.edit('step3')} type="primary" size="large">Define recipients <Icon type="arrow-right" /></Button>
									</span>
								}{/** End list_ref_id condition*/}

							</span>
							:
							<span>
								<br /><hr className="hr-dashed" /><br />
								<Button onClick={() => this.edit('step2')} type="primary" size="large">Define content <Icon type="arrow-right" /></Button>
							</span>
						}{/** End preview html condition*/}



					</Col>
					<Col lg={5} md={3} sm={24} xs={24}></Col>
				</Row>
				
			</div>
		);//End return
	}//End render

	componentWillMount() {
		localStorage.removeItem('snp');
		localStorage.removeItem('hted');
		const id = CampaignServices.localStorageDecode().cid;
		this.setState({ loader: true });
		Services.http('get', 'campaign/get/create_form/step_3/snapshot.php?id=' + id).then(res => {
			this.setState({ loader: false });
			if (!res) { return false; }
			//console.log(res.tags);
			if (res.data.scheduleDateTime) {
				this.setState({ data: res.data, editDisabled: true });
			} else {
				this.setState({ data: res.data });
			}//End if condition

			//Save html tags into local storage in order to get directly other then hit API
			//Mostly use in preview function in campaign services
			Services.saveArrLocalStorage(res.tags, false, window.htmlTagsLocalStorage);

		});
	}//End componentDidMount

}//End class

export default Snapshot;