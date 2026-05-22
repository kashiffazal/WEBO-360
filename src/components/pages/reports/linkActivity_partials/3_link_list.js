/*eslint-disable no-script-url*/
/*eslint-disable no-new-func*/
import React, { Component } from 'react';
import { Modal, Button, Spin, Empty } from 'antd';
import DataTable from '../../../externalComponents/andt-data-table-component';
import Services from '../../../services';

const { confirm } = Modal;

class LinkList extends Component {

	state = {
		loader: false,
		exportLoaderPDF: false,
		exportLoaderExcel: false,
		exportLoaderCSV: false,
		openModal: false,
		subscribers_ref_ids: [],
		modalData: []
	}//End state

	openList = (data) => {
		this.setState({ loader: true, openModal: true, subscribers_ref_ids: data.click_unique_person });
		Services.http('post', 'reporting/subscriber_list/index.php?keyword=uniquePersonClicked', { 'data': data.click_unique_person }).then(res => {
			//console.log(res);
			this.setState({ loader: false });
			if (!res) { this.setState({ openModal: false }); return false; }
			this.setState({ modalData: res.data }, () => {
				const st = this.state;
				if (st.modalData.cols) {
					//Convert string js sorter function to real js function
					let cols = st.modalData.cols;
					for (var i = 0; i < cols.length; i++) { cols[i].sorter = Function('"use strict";return (' + cols[i].sorter + ')')(); }//End for loop
					this.setState({ modalData: { ...this.state.modalData, cols } });
				}//End if condition
			});
		});
	}//End function

	export = (listLength, exportIn) => {
		if (listLength > 4400 && exportIn !== 'excel' && exportIn !== 'csv') {
			this.confirmExport();
			return false;
		}//End if condition
		let exportType = 'uniquePersonClicked';
		let campaign_id = this.props.campaign_id;
		if (exportIn === 'csv') { this.setState({ exportLoaderCSV: true }); }
		if (exportIn === 'excel') { this.setState({ exportLoaderExcel: true }); }
		if (exportIn === 'pdf') { this.setState({ exportLoaderPDF: true }); }
		Services.http('post', 'reporting/exportPdf/export_subscriber_list.php?exportType=' + exportType + '&id=' + campaign_id + '&exportIn=' + exportIn, { 'data': this.state.subscribers_ref_ids }).then(res => {
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
			onOk() { th.export(0); }
		});
	}//End function

	_render_link_list = (data) => {
		if (!data) { return false }
		//console.log(data);
		return data.map((item, i) => {
			return (
				<tr key={i}>
					<td width="80%">
						<a href={item.link} style={{ 'maxWidth': '700px' }} target="_blank" className="linkShort">{item.link}</a>
					</td>
					<td width="10%" align="center">
						<b>{item.click_person_count}</b> &nbsp;
                        <span className="fs-11">(<a href="javascript:void(0)" onClick={() => this.openList(item)}>who</a>)</span>
					</td>
					<td width="10%" align="center">{item.clicks}</td>
				</tr>
			);
		});
	}//End function

	render() {
		const st = this.state;
		return (
			<div>
				<div className="sectionTitle">
					<table border="0" width="100%">
						<tbody>
							<tr>
								<td width="80%">LINK (URL)</td>
								<td width="10%" align="center">UNIQUE</td>
								<td width="10%" align="center">TOTAL</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="sectionContent">
					<table border="0" width="100%">
						<tbody>
							{this._render_link_list(this.props.data)}
						</tbody>
					</table>
				</div>


				<Modal
					className="hide-modal-header"
					width={720}
					maskClosable={false}
					closable={false}
					visible={st.openModal}
					onCancel={() => this.setState({ openModal: false })}
					footer={[
						'Export : ',
						<Button size="large" key="exportCSV" disabled={!st.modalData.list || st.exportLoaderPDF || st.exportLoaderExcel} loading={st.exportLoaderCSV} onClick={() => this.export(st.modalData.list.length, 'csv')}><i className="fa fa-file-excel-o" /> &nbsp; CSV</Button>,
						<Button size="large" key="exportExcel" disabled={!st.modalData.list || st.exportLoaderPDF || st.exportLoaderCSV} loading={st.exportLoaderExcel} onClick={() => this.export(st.modalData.list.length, 'excel')}><i className="fa fa-file-excel-o" /> &nbsp; XLS</Button>,
						<Button size="large" key="exportPDF" disabled={!st.modalData.list || st.exportLoaderExcel || st.exportLoaderCSV} loading={st.exportLoaderPDF} onClick={() => this.export(st.modalData.list.length, 'pdf')}><i className="fa fa-file-pdf-o" /> &nbsp; PDF</Button>,
						<Button size="large" key="submit" type="primary" onClick={() => this.setState({ openModal: false })}>Cancel</Button>
					]}>
					<Spin spinning={st.loader}>
						{!st.modalData.list ? <div className="h-250 flex-c-m"><Empty description="Loading data, Please wait..." /></div> :
							<DataTable
								columns={st.modalData.cols}
								label={st.modalData.label}
								desc={st.modalData.desc}
								dataSource={st.modalData.list}
								//sizeChangerOptions={[5,10,20,30,40,50,100]}
								filter="true"
								showSizeChanger={true}
								pagination={true}
							/>
						}
					</Spin>
				</Modal>



			</div>
		);//End return
	}//End render
	// componentWillMount(){
	// 	let link_list = this.props.data;
	// 	if(link_list.link_list){
	//         console.log(link_list.link_list);
	// 		this.setState({link_list : link_list.link_list});
	// 	}//End if condition
	// }//End componentWillMount
}//End class

export default LinkList;