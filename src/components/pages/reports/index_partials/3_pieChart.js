/*eslint-disable no-script-url*/
/*eslint-disable no-new-func*/
import React, { Component } from 'react';
import { Row, Col, Modal, Button, Tooltip, Spin, Empty } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Services from '../../../services';
import DataTable from '../../../externalComponents/andt-data-table-component';

const { confirm } = Modal;

class PieChart extends Component {
	state = {
		loader: false,
		openModal: false,
		listData: [],
		exportType: null,
		exportLoaderPDF: false,
		exportLoaderExcel: false,
		exportLoaderCSV: false,

		graphOptions: {
			chart: {
				height: 200,
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: { text: '' },
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			// legend: {
			//     layout: 'vertical',
			//     align: 'right',
			//     verticalAlign: 'middle'
			// },
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: { enabled: false },
					showInLegend: false
				}
			},
			series: [{
				name: 'Percent',
				colorByPoint: true,
				data: [
					{ name: '', y: 0 },
					{ name: '', y: 0 },
					{ name: '', y: 0 },
					{ name: '', y: 0 },
				]
			}]



		},//End chartObject
		countDetails: {
			open: 0,
			bounced: 0,
			notOpen: 0,
			spam: 0,
			totalOpen: 0,
			clickPercent: 0,
			clickCount: 0,
			unsubscribePercent: 0,
			unsubscribeCount: 0
		},//End details object
		countColor: {
			open: '',
			bounced: '',
			notOpen: '',
			spam: '',
		}//End details object
	}//End state

	openList = (keyword) => {
		this.setState({ loader: true, openModal: true, exportType: keyword });
		let campaign_id = this.props.campaign_id;
		Services.http('get', 'reporting/subscriber_list/index.php?keyword=' + keyword + '&id=' + campaign_id).then(res => {
			this.setState({ loader: false });
			if (!res) { this.setState({ openModal: false }); return false; }
			//console.log(res);

			this.setState({ listData: res.data }, () => {
				const st = this.state;
				if (st.listData.cols) {
					//Convert string js sorter function to real js function
					let cols = st.listData.cols;
					for (var i = 0; i < cols.length; i++) { cols[i].sorter = Function('"use strict";return (' + cols[i].sorter + ')')(); }//End for loop
					this.setState({ listData: { ...this.state.listData, cols } });
				}//End if condition
			});
		});
	}//End function

	export = (listLength, exportIn) => {
		//alert(listLength);
		if (listLength > 4400 && exportIn !== 'excel' &&  exportIn !== 'csv') {
			this.confirmExport();
			return false;
		}//End if condition
		let exportType = this.state.exportType;
		let campaign_id = this.props.campaign_id;
		if (exportIn === 'csv') { this.setState({ exportLoaderCSV: true }); }
		if (exportIn === 'excel') { this.setState({ exportLoaderExcel: true }); }
		if (exportIn === 'pdf') { this.setState({ exportLoaderPDF: true }); }
		//console.log('reporting/exportPdf/export_subscriber_list.php?exportType='+exportType+'&id='+campaign_id);
		Services.http('get', 'reporting/exportPdf/export_subscriber_list.php?exportType=' + exportType + '&id=' + campaign_id + '&exportIn=' + exportIn).then(res => {
			this.setState({ exportLoaderCSV: false, exportLoaderExcel: false, exportLoaderPDF: false });
			if (!res) { return false; }
			Services.fileDownload(res.path, res.fileName);
			//console.log(res);
		});
	}//End Export

	confirmExport = () => {
		let th = this;
		confirm({
			title: 'Export file size',
			content: 'File has more then 100 pages, it will take few minutes to export.',
			okText: 'Export',
			cancelText: 'Cancel',
			onOk() { th.export(0, 'pdf'); }
		});
	}//End function


	render() {
		const st = this.state;
		const dc = this.state.countDetails;
		const dColor = this.state.countColor;
		const dGraphic = this.state.graphOptions;
		return (
			<div>
				<Row gutter={10}>
					<Col lg={6} md={12} sm={12} xs={24}>
						<span id="cPieChart">
							<HighchartsReact highcharts={Highcharts} options={dGraphic} />
						</span><span className="cPieChartEnd"></span>
					</Col>
					<Col lg={8} md={12} sm={12} xs={24}>
						<span id="cPieChartSection1">
							<ul className="pieChartList">
								<li>
									<span style={{ 'background': dColor.open }}></span> <b>{dc.open}</b> <span className="label">{dc.open > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('uniqueOpen')}>Unique open</a> : 'Unique open'}</span>
									<p>{dc.totalOpen} total opens to date</p>
								</li>
								<li>
									<span style={{ 'background': dColor.bounced }}></span> <b>{dc.bounced}</b> <span className="label">{dc.bounced > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('bounced')}>Bounced</a> : 'Bounced'}</span>
									<p>All emails appear to be delivered</p>
								</li>
								<li>
									<span style={{ 'background': dColor.notOpen }}></span> <b>{dc.notOpen}</b> <span className="label">{dc.notOpen > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('notOpened')}>Not Opened</a> : 'Not Opened'}</span>
									<p>Open rates are <a href="javascript:void(0)">only estimates</a></p>
								</li>
							</ul>
						</span>
					</Col>
					<Col lg={10} md={24} sm={24} xs={24}>
						<span id="cPieChartSection1">
							<ul className="pieChartList2 pieChartList">
								<li><p><b>{dGraphic.series[0].data[0].y}%</b> of all recipients {dGraphic.series[0].data[0].y > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('openedSoFar')}> opened so far</a> : ' opened so far'} </p></li>
								<li><p><b>{dc.clickPercent}%</b> {dc.clickPercent > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('clickedALink')}>clicked a link</a> : 'clicked a link'} ({dc.clickCount} person)</p></li>
								<li><p><b>{dc.unsubscribePercent}%</b> {dc.unsubscribePercent > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('unsubscribed')}>unsubscribed</a> : 'unsubscribed'} ({dc.unsubscribeCount} people)</p></li>
								<li>
									<span style={{ 'background': dColor.spam }}></span> <b>{dc.spam}</b> <span className="label">{dc.spam > 0 ? <a href="javascript:void(0)" onClick={() => this.openList('spam')}>Spam</a> : 'Spam'}</span>
									<p>All emails appear to be spam</p>
								</li>
							</ul>
						</span>
					</Col>
				</Row>

				<Modal
					className="hide-modal-header"
					width={720}
					maskClosable={false}
					closable={false}
					visible={st.openModal}
					title="Title"
					onCancel={() => this.setState({ openModal: false })}
					footer={[
						'Export : ', 
						<Button size="large" key="exportCSV" disabled={!st.listData.list || st.exportLoaderPDF || st.exportLoaderExcel} loading={st.exportLoaderCSV} onClick={() => this.export(st.listData.list.length, 'csv')}><i className="fa fa-file-excel-o" /> &nbsp; CSV</Button>,
						<Button size="large" key="exportExcel" disabled={!st.listData.list || st.exportLoaderPDF || st.exportLoaderCSV} loading={st.exportLoaderExcel} onClick={() => this.export(st.listData.list.length, 'excel')}><i className="fa fa-file-excel-o" /> &nbsp; XLS</Button>,
						<Button size="large" key="exportPDF" disabled={!st.listData.list || st.exportLoaderExcel || st.exportLoaderCSV} loading={st.exportLoaderPDF} onClick={() => this.export(st.listData.list.length, 'pdf')}><i className="fa fa-file-pdf-o" /> &nbsp; PDF</Button>,
						<Button size="large" key="submit" disabled={st.exportLoaderPDF || st.exportLoaderExcel || st.exportLoaderCSV} type="primary" onClick={() => this.setState({ openModal: false })}>Cancel</Button>
					]}>
					<Spin spinning={st.loader}>
						{!st.listData.list ? <div className="h-250 flex-c-m"><Empty description="Loading data, Please wait..." /></div> :
							<DataTable
								columns={st.listData.cols}
								label={st.listData.label}
								desc={st.listData.desc}
								dataSource={st.listData.list}
								//sizeChangerOptions={[5,10,20,30,40,50,100]}
								filter="true"
								showSizeChanger={true}
								pagination={true}
								expandedRowRender={st.listData.expandedRow ? record => {
									return (
										record.links.map(item => {
											return (
												<div key={item.key}>
													<Row gutter={10} key={item.key} className="fs-11">
														<Col lg={12} md={24} sm={24} xs={24}>
															<b>Clicked URL: </b><br />
															<Tooltip placement="top" title={item.click_url}>
																<a href={item.click_url} className="truncate">{item.click_url}</a>
															</Tooltip>
														</Col>
														<Col lg={4} md={24} sm={24} xs={24}>
															<b>Click Count</b><br />
															{item.count}
														</Col>
														<Col lg={8} md={24} sm={24} xs={24}>
															<b>Clicked date and time</b><br />
															{item.dateTime}
														</Col>
													</Row>
													<hr className="hr-dashed" />
												</div>
											)
										})
									)
								} : false}
							/>
						}
					</Spin>
				</Modal>
			</div>
		);//End return
	}//End render
	componentWillMount() {
		let graphData = this.props.data;
		//console.log(graphData);
		if (graphData.details) {
			let graphOptions = this.state.graphOptions;
			graphOptions.series[0].data[0].name = graphData.Opened.names.open;
			graphOptions.series[0].data[1].name = graphData.Opened.names.bounce;
			graphOptions.series[0].data[2].name = graphData.Opened.names.not_open;
			graphOptions.series[0].data[3].name = graphData.Opened.names.spam;
			graphOptions.series[0].data[0].y = graphData.Opened.unique_open;
			graphOptions.series[0].data[1].y = graphData.Opened.bounced;
			graphOptions.series[0].data[2].y = graphData.Opened.not_open;
			graphOptions.series[0].data[3].y = graphData.Opened.spam;
			graphOptions.series[0].data[0].color = graphData.Opened.color.open;
			graphOptions.series[0].data[1].color = graphData.Opened.color.bounce;
			graphOptions.series[0].data[2].color = graphData.Opened.color.not_open;
			graphOptions.series[0].data[3].color = graphData.Opened.color.spam;
			this.setState({ graphOptions });

			let countColor = this.state.countColor;
			countColor.open = graphData.Opened.color.open;
			countColor.bounced = graphData.Opened.color.bounce;
			countColor.notOpen = graphData.Opened.color.not_open;
			countColor.spam = graphData.Opened.color.spam;
			this.setState({ countColor });

			let countDetails = this.state.countDetails;
			countDetails.open = graphData.details.count.unique_open;
			countDetails.bounced = graphData.details.count.bounced;
			countDetails.notOpen = graphData.details.count.not_opened;
			countDetails.spam = graphData.details.count.spam;
			countDetails.totalOpen = graphData.details.count.total_open;
			countDetails.clickPercent = graphData.Clicked.click_percent;
			countDetails.clickCount = graphData.Clicked.click;
			countDetails.unsubscribePercent = graphData.Unsubscribed.unsubscribe_percent;
			countDetails.unsubscribeCount = graphData.Unsubscribed.unsubscribed;;
			this.setState({ countDetails });

		}//End if condition
	}//End componentDidMount
}//End class

export default PieChart;