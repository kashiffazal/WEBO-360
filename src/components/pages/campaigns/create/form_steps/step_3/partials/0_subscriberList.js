import React, { Component } from 'react';
import { Row, Col, List, Checkbox } from 'antd';

class SubscriberList extends Component {
	render() {

		const previewStyle = {
			'padding': '5px',
			'zIndex': '100000',
			'position': 'absolute',
			'left': '0',
			'right': '0',
			'top': '0',
			'bottom': '0',
			'background': '#ffffff78',
			'cursor': 'no-drop'
		}


		return (
			<div>
				<div style={{ 'position': 'relative', 'background': '#fff' }}>
					<div style={this.props.preview ? previewStyle : {}}></div>
					<List className="bgwhite" bordered dataSource={this.props.data} renderItem={item => (
						<List.Item>
							<Checkbox onChange={() => this.props.onChange(item)} checked={item.checked}>
								{item.list_name}
								{/* <div className="fs-12 float-r m-t-3">Subscribers:- (Total: <b>{item.count}</b> | Unique: <b>{item.uniqueEmailcount}</b>)</div> */}
								<div className="fs-12 float-r m-t-3">Total Subscribers :- <b>{item.count}</b></div>
							</Checkbox>
						</List.Item>
					)} />
				</div>


				<Row className="m-t-10 fs-14">
					<Col lg={12} md={12} sm={12} xs={24}>
						<b>Total Subscribers: </b><span className="fs-18">{this.props.details.total}</span>
					</Col>
					<Col lg={12} md={12} sm={12} xs={24} className="text-right text-right-575">
						{/* <b>Total Unique Subscribers: </b> <span className="fs-18">{this.props.details.unique}</span> */}
					</Col>
				</Row>

			</div>
		);
	}
}

export default SubscriberList;