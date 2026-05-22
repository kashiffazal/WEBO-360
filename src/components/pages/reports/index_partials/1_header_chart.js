import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Icon, Button } from 'antd';
import { connect } from 'react-redux';
import mapStateToProps from '../../../../store/mapStateToProps';
import html2canvas from 'html2canvas';
import Services from '../../../services';
import CampaignServices from '../../campaigns/campaign_services';

class HeaderChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imageBase64: {
				cLineChart: '',
				cPieChart: '',
				id: ''
			},
			exportLoader: false
		}//End stte object
	}//End constructor


	generatePDf = () => {
		this.setState({ exportLoader: true });
		this.chartToCancas('cLineChart');
		this.chartToCancas('cPieChart');
		this.interval = setInterval(() => {
			if (this.state.imageBase64.cLineChart && this.state.imageBase64.cPieChart) {
				clearInterval(this.interval);
				//console.log('end');
				let post = this.state.imageBase64;
				Services.http('post', 'reporting/exportPdf/index.php', post).then(res => {
					this.setState({ exportLoader: false });
					//console.log(res.data);
					if (!res) { return false; }
					Services.fileDownload(res.path, res.fileName);
				});
			}//End if condition
		}, 1000);
	}//End function


	chartToCancas(idName) {
		//Removing watermark --------------------------//
		let a = document.querySelector('#' + idName + ' > div > div > svg > text.highcharts-credits')
		if (a) { a.parentNode.removeChild(a); }
		//---------------------------------------------//
		//console.log(a);
		//return false;
		html2canvas(document.querySelector('#' + idName), { scale: 2 }).then(canvas => {
			let value = canvas.toDataURL('image/png');
			let imageBase64 = this.state.imageBase64;
			imageBase64[idName] = value;
			imageBase64['id'] = this.props.data[0];
			this.setState({ imageBase64 });
		});
	}//End function

	render() {
		const data = this.props.data;
		const listArr = this.props.listArr;
		return (
			<div>
				<Row>
					<Col lg={16} md={12} sm={12} xs={24}>
						<h3 className="pageTitle m-0">{data[1]}</h3>
						<p className="m-0 fs-12">Sent on {data[2].split(',')[0]} to {data[3]} subscriber(s)</p>
						<p className="m-0 fs-12">List Name:&nbsp;
							{listArr && listArr.map((item, i) => {
							return (<span key={item.id}><button className="btnToAnchor" onClick={() => this.props.history.push('/app/subscribers/list/'+item.id_en)}>{item.list_name}</button>{listArr.length === i && ','} </span>)
						})}
						</p>
					</Col>
					<Col lg={8} md={12} sm={12} xs={24} className="text-right p-t-10">

						<Button onClick={() => CampaignServices.openPreview(data[0])}><Icon type="eye" /> View</Button>&nbsp;&nbsp;
                        <Button onClick={() => this.generatePDf()} loading={this.state.exportLoader}>
							{!this.state.exportLoader && <Icon type="export" />} Export Report
						</Button>
					</Col>
				</Row>
				<hr className="hr-dashed" />
			</div>
		);//End return
	}//End render
}//End class

export default connect(mapStateToProps)(withRouter(HeaderChart));