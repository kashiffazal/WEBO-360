import React, { Component } from 'react';
import { Row, Col, Select, DatePicker, Spin } from 'antd';
import { AntInput } from '../../../../../../externalComponents/antd-fields';
const Option = Select.Option;

class WhenToSend extends Component {
	state = {
		selectedRadioValue: null,
		dateValues: {
			day: '1',
			month: '2',
			year: '2019'
		},
		timeValues: {
			hour: '09',
			min: '09',
			ampm: 'am',
			timeZone: 'Asia/Karachi',
		},
		editDisabled: false,
		fields_list: {
			month: [],
			day: [],
			year: [],
			hour: [],
			min: [],
			ampm: [],
			timeZone: []
		}
	}

	onDateChange = (date, dateString) => {
		let srtDate = dateString.split("-");
		let dateValues = this.state.dateValues;
		dateValues.day = srtDate[2];
		dateValues.month = srtDate[1];
		dateValues.year = srtDate[0];
		this.setState({ dateValues });
		this.provideValuesToParentComponent();
	}//End function

	selectDateTime = (e, type) => {
		let dateValues = this.state.dateValues;
		let timeValues = this.state.timeValues;
		if (type === 'day' || type === 'month' || type === 'year') {
			dateValues[type] = e;
			this.setState(dateValues);
		}//End if condition
		if (type === 'hour' || type === 'min' || type === 'ampm' || type === 'timeZone') {
			timeValues[type] = e;
			this.setState(timeValues);
		}//End if condition
		this.provideValuesToParentComponent();
	}//End function

	provideValuesToParentComponent = () => {
		let scheduledDateTime = {
			date: this.state.dateValues,
			time: this.state.timeValues
		}//End variable
		this.props.onChange(scheduledDateTime);
	}//End function

	onRadioChange = (value) => {
		this.setState({ selectedRadioValue: value }, () => {
			this.provideValuesToParentComponent();
		})
	}//End function


	render() {

		const edit = this.state.editDisabled;
		const fl = this.state.fields_list;
		const fp = this.props.formProps;
		const st = this.state;
		return (
			<div>
				<div className="snapshot_title">
					<h3>When would you like to send this campaign?</h3>
					<p>You can send it right now or schedule a time in the future.</p>
				</div>
				<Spin tip="Loading data, Please wait..." spinning={this.props.loader}>
					<div className="campaignDetailPreview">
						<AntInput
							name="sendType"
							type="radio"
							vertical
							radioOptions={[
								{ value: 'now', label: 'Send it now' },
								{ value: 'schedule', label: 'Schedule for a specific time' }
							]}
							formProps={fp}
							disabled={edit}
							value={'now'}
							onChange={(value) => this.onRadioChange(value)}
						/>

						{st.selectedRadioValue === 'schedule' &&
							<div className="schedule_container">
								<p>This campaign will be sent at the date and time specified below.</p>
								<Row>
									<Col lg={4} md={4} sm={6} xs={24}>
										<b>Date</b>
									</Col>
									<Col lg={20} md={20} sm={18} xs={24}>

										<div className="input_container">
											<Select disabled={edit} onChange={(e) => this.selectDateTime(e, 'month')} value={this.state.dateValues.month}>
												{fl.month.map((item, i) => { return (<Option key={i} value={item.value}>{item.label}</Option>) })}
											</Select>

											<Select disabled={edit} onChange={(e) => this.selectDateTime(e, 'day')} value={this.state.dateValues.day}>
												{fl.day.map((item, i) => { return (<Option key={i} value={item.value}>{item.label}</Option>) })}
											</Select>

											<Select disabled={edit} onChange={(e) => this.selectDateTime(e, 'year')} value={this.state.dateValues.year}>
												{fl.year.map((item, i) => { return (<Option key={i} value={item.value}>{item.label}</Option>) })}
											</Select>

											<DatePicker disabled={edit} onChange={this.onDateChange} placeholder="" format={'YYYY-M-D'} />

										</div>

									</Col>
								</Row>
								<Row>
									<Col lg={4} md={4} sm={6} xs={24}>
										<b>Time</b>
									</Col>
									<Col lg={20} md={20} sm={18} xs={24}>

										<div className="input_container_2">
											<Select disabled={edit} onChange={(e) => this.selectDateTime(e, 'hour')} value={this.state.timeValues.hour}>
												{fl.hour.map((item, i) => { return (<Option key={i} value={item.value}>{item.label}</Option>) })}
											</Select>

											<Select disabled={edit} onChange={(e) => this.selectDateTime(e, 'min')} value={this.state.timeValues.min}>
												{fl.min.map((item, i) => {
													return (
														item.selected ?
															<Option key={i} selected="" value={item.value}>{item.label}</Option> :
															<Option key={i} value={item.value}>{item.label}</Option>

													)
												})}
											</Select>

											<Select disabled={edit} onChange={(e) => this.selectDateTime(e, 'ampm')} value={this.state.timeValues.ampm}>
												{fl.ampm.map((item, i) => { return (<Option key={i} value={item.value}>{item.label}</Option>) })}
											</Select>

											<Select
												showSearch
												optionFilterProp="children"
												filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

												disabled={edit} onChange={(e) => this.selectDateTime(e, 'timeZone')} value={this.state.timeValues.timeZone} style={{ 'width': '100%', 'marginTop': '10px' }}>
												{fl.timeZone.map((item, i) => { return (<Option key={i} value={item.value}>{item.label}</Option>) })}
											</Select>
										</div>

									</Col>
								</Row>
							</div>
						}{/** End state value condition*/}

					</div>
				</Spin>
				<br /><br />
			</div>
		);//End return
	}//End render


	componentWillReceiveProps(nextProps) {
		if (this.state.fields_list !== nextProps.data.schedule_fields_list) {
			const pd = this.props.data;
			//console.log(pd);
			if (pd && pd.schedule_fields_list) {
				this.setState({
					fields_list: pd.schedule_fields_list,
					dateValues: pd.defaultDateTime.date,
					timeValues: pd.defaultDateTime.time,
				});
				if (pd.scheduleDateTime !== "") {
					this.setState({
						dateValues: pd.scheduleDateTime.date,
						timeValues: pd.scheduleDateTime.time,
						editDisabled: true,
						selectedRadioValue: 'schedule'
					});
				}//End if condition
			}//End if condition
		}//End if condition
	}//End componentWillReceiveProps

}//End class

export default WhenToSend;