import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Spin, Popconfirm, Tabs, Empty } from 'antd';
import CampaignServices from '../campaign_services';
import DataTable from '../../../externalComponents/andt-data-table-component';
import AccessControl from '../../../externalComponents/user-base-access-control';
import Services from '../../../services';
import Archive from './archive';

const TabPane = Tabs.TabPane;

class Sent extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteLoader: false, archiveLoader: false, data: [], currentArchiveData: null, archiveCount: 0, loadArchiveData: false };
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

  // deleteCampaign = (id) => {
  //   this.setState({ deleteLoader: true });
  //   Services.http('get', 'campaign/post/deleteCampaign.php?id=' + id).then(res => {
  //     this.setState({ deleteLoader: false });
  //     if (!res) { return false; }//end if condition
  //     this.setState({ data: Services.deleteRowFromArrById(this.state.data, id) });
  //   });
  // }//End function

  deleteOrarchiveCampaign = (id, arCount, type) => {
    if (type === 'Archive') {
      this.setState({ archiveLoader: true });
      Services.http('get', 'campaign/post/archiveCampaign.php?id=' + id).then(res => {
        this.setState({ archiveLoader: false });
        if (!res) { return false; }//end if condition
        let data = [...this.state.data];

        let car = [];//Current Archive Data
        id.split(',').forEach(idv => {
          //Seprate current archive into array
          var dataIndex = data.findIndex(x => x.id === idv);
          car.push(data[dataIndex]);
          data = Services.deleteRowFromArrById(data, idv);
        });
        this.setState({ data });
        (this.state.loadArchiveData) && this.setState({ currentArchiveData: car });
        this.setState({ archiveCount: parseInt(arCount, 0) + parseInt(car.length, 0) });
      });
    }//End if condition

    if (type === 'Delete') {
      this.setState({ loader: true });
      Services.http('get', 'campaign/post/deleteCampaign.php?id=' + id).then(res => {
        this.setState({ loader: false });
        if (!res) { return false; }//end if condition
        let data = [...this.state.data];
        id.split(',').forEach(idv => {data =  Services.deleteRowFromArrById(data, idv);});
        this.setState({data});
        // id.split(',').forEach(idv => {
        //   this.setState({ data: Services.deleteRowFromArrById(this.state.data, idv) });
        // });
      });
    }//End if condition
  }//End function



  render() {

    const st = this.state;
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
                st.deleteLoader.id === row.id ?
                  <span><img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{'width':'10px'}} alt=""/> &nbsp;Please wait...</span> : */}
            <span className="dis-block">
              <a title="View Template" onClick={() => this.props.templatePreview(row.id)}><i className="fa fa-eye fs-14"></i></a>
                &nbsp;&nbsp;<a>-</a>&nbsp;&nbsp;
              <AccessControl>
                <a ubac_id={19} title="Copy this campaign" onClick={() => this.redirectToCampaignResend(row.id)}><i className="fa fa-copy fs-14"></i></a>
                <span ubac_id={18} title="Archive this campaign">
                  &nbsp;&nbsp;<a>-</a>&nbsp;&nbsp;
                  {/* <Popconfirm title="Are you sure to delete this campaign?" onConfirm={() => this.deleteCampaign(row.id)} okText="Yes" cancelText="No"><a><i className="fa fa-trash-o fs-14"></i></a></Popconfirm> */}
                  <Popconfirm title="Are you sure to archive this campaign?" onConfirm={() => this.deleteOrarchiveCampaign(row.id, this.state.archiveCount, 'Archive')} okText="Yes" cancelText="No"><a><i className="fa fa-folder-open-o fs-14"></i></a></Popconfirm>
                </span>
                <span ubac_id={18} title="Delete this campaign">
                  &nbsp;&nbsp;<a>-</a>&nbsp;&nbsp;
                  <Popconfirm title="Are you sure to delete this campaign?" onConfirm={() => this.deleteOrarchiveCampaign(row.id, 0, 'Delete')} okText="Yes" cancelText="No"><a><i className="fa fa-trash-o fs-14"></i></a></Popconfirm>
                </span>
              </AccessControl>
            </span>
            {/* } */}
          </div>
      });
    }//End if condition

    return (
      <div className="container">
        <Tabs defaultActiveKey="1" className="tab_style_1" type="card">
          <TabPane key={1} tab={`Sent (${st.data.length})`}>
            {(st.data && st.data.length > 0) ?
              <Spin tip={st.archiveLoader ? "Archive campaign, Please wait..." : "Loading..."} spinning={st.archiveLoader}>
                <DataTable
                  className="pagination-absolute"
                  columns={columns}
                  label="Sent Campaign Reports"
                  desc="All sent campaign list are below."
                  dataSource={st.data}
                  sizeChangerOptions={[5, 10, 20, 30, 40, 50, 100]}
                  filter="true"
                  showSizeChanger={true}
                  pagination={true}
                  bulkAction={this.props.readonly ? false : [
                    { 'label': 'Archive', 'value': 'Archive', 'bulkActionMsg': 'Are you sure to archive this campaign(s)?', 'bulkActionBottomBtnLabel': 'Archive Campaign(s)' },
                    { 'label': 'Delete', 'value': 'Delete', 'bulkActionMsg': 'Are you sure to delete this campaign(s) permanently?', 'bulkActionBottomBtnLabel': 'Delete Campaign(s)' }
                  ]}
                  bulkActionHandler={(rows, value) => this.deleteOrarchiveCampaign(rows.selectedRowIds.join(','), st.archiveCount, value)}
                  //bulkActionMsg="Are you sure to archive this campaign(s)?"
                  //bulkActionBottomBtnLabel="Archive Campaigns"
                  rowSelection={!this.props.readonly}
                />
              </Spin>
              :
              <Empty />
            }
          </TabPane>
          <TabPane key={2} tab={`Archive (${st.archiveCount})`}>
            <Archive
              templatePreview={(id) => this.props.templatePreview(id)}
              archiveToActive={(data) => this.setState({ data })}
              activeData={st.data}
              currentArchiveData={st.currentArchiveData}
              archiveCount={(count) => this.setState({ archiveCount: count })}
              loadArchiveData={() => this.setState({ loadArchiveData: true })}
            />
          </TabPane>
        </Tabs>
      </div>
    )//End return statement
  }//End render
  componentDidMount() {
    this.setState({
      data: this.props.data ? this.props.data : [],
      archiveCount: this.props.archiveCount
    });
  }//End componentDidMount
}//End component

export default withRouter(Sent);
