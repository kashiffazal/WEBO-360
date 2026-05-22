import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import Services from '../../../services';
import './styles.css';

const FormItem = Form.Item;
const Option = Select.Option;

class SubscriberPersonalDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			loader: false,
		}
	}//End constructor

	submitForm = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				values.id = this.props.data.id;
				values.list_ref_id = this.props.data.list_ref_id;
				values.pre_status = this.props.data.status;
				this.setState({ loader: true })
				Services.http('post', "subscribers/post/update_subscriber.php", values).then(res => {
					this.setState({ loader: false })
					if (!res) { return false; }
					this.props.update_personal_data(res.user_personal_data.personal_data);
					this.setState({ showForm: false });
				});
			}//End if condition
		});//End form properties
	}//End function


	showForm = () => {
		let data = this.props.data;
		//console.log(data);
		this.setState({ showForm: true }, () => {
			this.props.form.setFieldsValue({
				full_name: data.full_name,
				email: data.email,
				status: data.status
			});
		});
	}//End function




	render() {
		const data = this.props.data;
		const statusData = this.props.statusData;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.submitForm}>
				<div className="personal_detail_container">

					<div className="personal_data">

						<Row gutter={30}>
							<Col lg={6} md={7} sm={24} xs={24}>
								<div className="avatar">
									<img src={`${process.env.PUBLIC_URL}/image/subscriber_avatar.png`} width="100%" alt="" />
								</div>
							</Col>
							<Col lg={18} md={17} sm={24} xs={24}>

								{this.state.showForm ?
									<div className="m--3-0">
										<FormItem>{getFieldDecorator('full_name', { rules: [{ required: true, message: '.' }], })(<Input placeholder="Subscriber name" />)}</FormItem>
										<FormItem>{getFieldDecorator('email', { rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, { required: true, message: '.' }], })(<Input placeholder="Subscriber email" />)}</FormItem>
									</div>
									:
									<div className="user_details">
										<p className="name">{data.full_name}</p>
										<p className="email">{data.email}</p>
										<p className="read_email">Read email with {data.email_read_with}</p>
									</div>
								}

							</Col>
						</Row>



					</div>

					{!this.state.showForm &&
						<div className="location">
							<div className="map"></div>
							<div className="mapcaption">We don't know where Syed is yet.</div>
						</div>
					}



					<div className="status_details">
						{this.state.showForm ?
							<div className="p-20">
								<Row gutter={30}>
									<Col lg={6} md={7} sm={24} xs={24}>
										<label className="dis-block p-t-8 fw-600">Status:</label>
									</Col>
									<Col lg={18} md={17} sm={24} xs={24}>
										<FormItem>{getFieldDecorator('status', { rules: [{ required: true, message: 'Please select gender' }] })(
											<Select>
												{statusData.map(item => {return(<Option key={item.key} value={item.id}>{item.status}</Option>	)})}
											</Select>
										)}</FormItem>
									</Col>
								</Row>
								<hr className="hr-dashed" />
								<Button type="primary" htmlType="submit" loading={this.state.loader}>Save Changes</Button>
								&nbsp; or &nbsp;
								<a onClick={() => this.setState({ showForm: false })}>cencel</a>
							</div>
							:
							<span>
								<div className="status">
									<label>Status</label>
									<div className="status_data">{data.status_date}</div>
								</div>
								<div className="status">
									<label>Join</label>
									<div className="status_data">{data.joining_date}</div>
								</div>
								{/* <div className="status" style={{ 'borderBottom': 'none' }}>
									<label>Permission to track activity</label>
									<div className="status_data">Unknown</div>
								</div> */}
								<div className="edit_btn_container">
									<Button type="primary" onClick={() => this.showForm()} className="button">Edit {data.first_name}</Button>
								</div>
							</span>
						}
					</div>








				</div>
			</Form>
		);//End return
	}//End render
}//End class

export default Form.create()(SubscriberPersonalDetails);