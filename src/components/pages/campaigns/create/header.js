import React, { Component } from 'react';
import { Steps, Row, Col, } from 'antd';
const Step = Steps.Step;

class Header extends Component {
	render() {
		return (
			<div className="header">
				<Row type="flex" justify="space-around" align="middle">
					<Col lg={14} md={12} sm={24} xs={24}>
						<h3>{this.props.title}</h3>
						<p>{this.props.desc}</p>
					</Col>
					<Col lg={10} md={12} sm={24} xs={24}>

							<Steps size="small" current={this.props.stepNumber-1}>
								<Step title="Campaign" />
								<Step title="Content" />
								<Step title="Recipients" />
								<Step title="Delivery" />
							</Steps>
					</Col>
				</Row>
			</div>
		);//End return
	}//End render
}//End class

export default Header;