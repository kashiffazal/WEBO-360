import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Spin, Popconfirm } from 'antd';
import CampaignServices from '../campaign_services';
import DataTable from '../../../externalComponents/andt-data-table-component';
import AccessControl from '../../../externalComponents/user-base-access-control';
import Services from '../../../services';

class Archive extends Component {
   constructor(props) {
      super(props);
      this.state = { loader: false, data: null, currentArchiveData: null };
   }//End constructor


   redirectToCampaignResend = (id) => {
      CampaignServices.localStorageEncode({ cid: id, campaignResend: id });
      this.props.history.push('/app/createCampaign/step1');
   }//End function

   redirectToReport = (rowData) => {
      //console.log(rowData);
      Services.saveArrLocalStorage(
         [rowData.id, rowData.campaign_name, rowData.sent_date, (parseInt(rowData.recipientsCount, 0))],
         "/app/campaigns/reports/charts"
      );
   }//End function

   deleteOrActiveCampaign = (id, type) => {
      //console.log(id,type);
      if (type === 'Delete') {
         this.setState({ loader: true });
         Services.http('get', 'campaign/post/deleteCampaign.php?id=' + id).then(res => {
            this.setState({ loader: false });
            if (!res) { return false; }//end if condition
            let data = [...this.state.data];
            id.split(',').forEach(idv => {data =  Services.deleteRowFromArrById(data, idv);});
            //console.log(data);    
            this.setState({data}, () => {this.props.archiveCount(this.state.data.length);});
         });
      }//End if condition

      if (type === 'Active') {
         alert('d');
         this.setState({ loader: true });
         Services.http('get', 'campaign/post/activeCampaign.php?id=' + id).then(res => {
            this.setState({ loader: false });
            if (!res) { return false; }//end if condition
            this.parentChildDataTransfer(id, type);
         });
      }//End if condition
   }//End function


   parentChildDataTransfer = (id, type) => {
      let data = [...this.state.data];
      let activeData = [...this.props.activeData];
      id.split(',').forEach(idv => {
         if (type === 'Active') {
            var dataIndex = data.findIndex(x => x.id === idv);
            activeData.push(data[dataIndex]);
         }//End if condition
         data = Services.deleteRowFromArrById(data, idv);
      });
      if (type === 'Active') {
         activeData.sort(function (a, b) { return a.id - b.id; });
         this.props.archiveToActive(activeData.reverse());
      };
      this.setState({ data }, () => { this.props.archiveCount(this.state.data.length); });
   }//End function


   render() {


      const columns = [
         // {
         //   title: 'Sr',
         //   dataIndex: 'key',
         //   sorter: (a, b) => a.key - b.key,
         // },
         {
            title: 'Campaign Name',
            dataIndex: 'campaign_name',
            width: '25%',
            sorter: (a, b) => a.campaign_name.length - b.campaign_name.length,
            render: (text, row) =>
               <div>
                  {Services.accessControl(23) ?
                     <a onClick={() => this.redirectToReport(row)}>{row.campaign_name}</a> :
                     row.campaign_name
                  }
               </div>
         }, {
            title: 'Sent Date',
            dataIndex: 'sent_date',
            width: '20%',
            sorter: (a, b) => a.sent_date.length - b.sent_date.length,
            render: (text, row) => row.sent_date
         }, {
            title: 'Recipients',
            dataIndex: 'recipientsCount',
            width: '10%',
            sorter: (a, b) => a.recipientsCount - b.recipientsCount,
         }, {
            title: 'Opened',
            dataIndex: 'openerPer',
            width: '10%',
            sorter: (a, b) => a.openerPer - b.openerPer,
            render: (text) => <span>{text}%</span>
         }, {
            title: 'Clicked',
            dataIndex: 'clickerPer',
            width: '10%',
            sorter: (a, b) => a.clickerPer - b.clickerPer,
            render: (text) => <span>{text}%</span>
         }, {
            title: 'Unsubscribed',
            dataIndex: 'unsubPer',
            width: '12%',
            sorter: (a, b) => a.unsubPer - b.unsubPer,
            render: (text) => <span>{text}%</span>
         }];

      if ((Services.accessControl(19) || Services.accessControl(18)) && !this.props.readonly) {
         columns.push({
            title: 'Action',
            dataIndex: 'id',
            align: 'center',
            width: '13%',
            render: (text, row) =>
               <div>
                  {/* {
                this.state.deleteLoader.id === row.id ?
                  <span><img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{'width':'10px'}} alt=""/> &nbsp;Please wait...</span> : */}
                  <span className="dis-block">
                     <a title="View Template" onClick={() => this.props.templatePreview(row.id)}><i className="fa fa-eye fs-14"></i></a>
                            &nbsp;&nbsp;<a>-</a>&nbsp;&nbsp;
                            <AccessControl>
                        <a ubac_id={19} title="Copy this campaign" onClick={() => this.redirectToCampaignResend(row.id)}><i className="fa fa-copy fs-14"></i></a>
                        <span ubac_id={18} title="Active this campaign">
                           &nbsp;&nbsp;<a>-</a>&nbsp;&nbsp;
                                    <Popconfirm title="Are you sure to active this campaign?" onConfirm={() => this.deleteOrActiveCampaign(row.id, 'Active')} okText="Yes" cancelText="No"><a><i className="fa fa-hdd-o fs-14"></i></a></Popconfirm>
                        </span>
                        <span ubac_id={18} title="Delete this campaign">
                           &nbsp;&nbsp;<a>-</a>&nbsp;&nbsp;
                                    <Popconfirm title="Are you sure to delete this campaign?" onConfirm={() => this.deleteOrActiveCampaign(row.id, 'Delete')} okText="Yes" cancelText="No"><a><i className="fa fa-trash-o fs-14"></i></a></Popconfirm>
                        </span>
                     </AccessControl>
                  </span>
                  {/* } */}
               </div>
         });
      }//End if condition


      return (
         <div className="container">
            <Spin tip={this.state.loader ? "Loading campaign, Please wait..." : "Loading..."} spinning={this.state.loader}>
               <DataTable
                  className="pagination-absolute"
                  columns={columns}
                  label="Archive Campaign Reports"
                  desc="All archive campaign list are below."
                  dataSource={this.state.data}
                  sizeChangerOptions={[5, 10, 20, 30, 40, 50, 100]}
                  filter="true"
                  showSizeChanger={true}
                  pagination={true}
                  bulkAction={this.props.readonly ? false : [
                     { 'label': 'Active', 'value': 'Active', 'bulkActionMsg': 'Are you sure to active this campaign(s)?', 'bulkActionBottomBtnLabel': 'Active Campaign(s)' },
                     { 'label': 'Delete', 'value': 'Delete', 'bulkActionMsg': 'Are you sure to delete this campaign(s) permanently?', 'bulkActionBottomBtnLabel': 'Delete Campaign(s)' }
                  ]}
                  bulkActionHandler={(rows, value) => this.deleteOrActiveCampaign(rows.selectedRowIds.join(','), value)}
                  //bulkActionMsg={`Are you sure to this campaign(s) permanently?`}
                  //bulkActionBottomBtnLabel="Delete Campaigns"
                  rowSelection={!this.props.readonly}
               />
            </Spin>
         </div>
      )//End return statement
   }//End render
   componentDidMount() {
      this.setState({ loader: true });
      Services.http('get', 'campaign/get/archiveCampaignLog.php').then(res => {
         //console.log(res.data);
         this.setState({ loader: false });
         if (!res) { return false; }
         this.setState({ data: res.data })
         this.props.archiveCount(res.data.length);
         this.props.loadArchiveData();
      });
   }//End componentDidMount
   componentWillReceiveProps(nextProps) {
      //Add new archive data in to current archive array
      if (this.state.currentArchiveData !== nextProps.currentArchiveData) {
         //console.log(nextProps.currentArchiveData);
         let data = [...this.state.data];
         let car = nextProps.currentArchiveData;
         car.forEach(item => { data.push(item); })
         data.sort(function (a, b) { return a.id - b.id; })
         this.setState({ data: data.reverse(), currentArchiveData: nextProps.currentArchiveData }, () => { this.props.archiveCount(this.state.data.length); });
      }//End if condition
   }//End componentWillReceiveProps
}//End component

export default withRouter(Archive);
