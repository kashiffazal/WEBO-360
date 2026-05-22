import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import { withRouter } from 'react-router-dom'
import DataTable from '../../../externalComponents/andt-data-table-component';
import CampaignServices from '../campaign_services';
import Services from '../../../services';

class Scheduled extends Component {
  constructor(props) {
    super(props);
    this.state = { loader: {}, listData: [] };
  }//End constructor

  unscheduleCampaign = (id, cronId) => {
    this.setState({ loader: { 'id': id } });
    Services.http('get', 'campaign/post/unscheduleCampaign.php?id=' + id + '&cronJob_id=' + cronId).then(res => {
      this.setState({ loader: { id: false } });
      if (!res) { return false; }//end if condition
      this.props.unscheduleUpdate(id);
    })
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
        width: '42%',
        sorter: (a, b) => a.campaign_name.length - b.campaign_name.length,
        render: (text, row) =>
          <span>{row.campaign_name} {row.status === 'sending' ? <span><img src={`${process.env.PUBLIC_URL}/image/sending.gif`} width="18px" alt='' /> <span className="fs-10">Sending...</span></span> : ''}</span>
      }, {
        title: 'Created',
        dataIndex: 'inserted_date',
        width: '21%',
        sorter: (a, b) => a.inserted_date.length - b.inserted_date.length,
      }, {
        title: 'Schedule Date',
        width: '24%',
        render: (text, row) =>
          <div>
            {row.scheduleDateTime}
          </div>
      }, {
        title: 'Details',
        align: 'center',
        width: '13%',
        render: (text, row) =>
          <div>
            {this.state.loader.id === row.id ?
              <span className="fs-9"><img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{ 'width': '10px' }} alt="" /> &nbsp;Please wait...</span> :
              <React.Fragment>
                <a title="View Template" onClick={() => this.props.templatePreview(row.id)}><i className="fa fa-eye fs-14"></i></a>
                &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                <a ubac_id={22} title="Snapshot" onClick={() => {
                  CampaignServices.localStorageEncode({ cid: row.id, cn: row.campaign_name });
                  this.props.history.push('/app/createCampaign/step3/snapshot');
                }}><i className="fa fa-file-text-o" /></a>
                &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                <Popconfirm title="Are you sure to unschedule this campaign?" onConfirm={() => this.unscheduleCampaign(row.id, row.cronJob_id)} okText="Yes" cancelText="No">
                  <a><i className="fa fa-calendar-times-o" /></a>
                </Popconfirm>
              </React.Fragment>
            }
          </div>
      }];

    return (
      <div className="container">
        {(this.props.data && this.props.data.length > 0) &&
          <React.Fragment>
            <DataTable
              columns={columns}
              label="Scheduled Campaign"
              desc="All scheduled campaign list are below."
              dataSource={this.props.data}
              sizeChangerOptions={[5, 10, 20, 30, 40, 50, 100]}
              filter="true"
              showSizeChanger={true}
              pagination={true}
            />
            <br /><br />
          </React.Fragment>
        }
      </div>
    )//End return statement
  }//End render
}//End component

export default withRouter(Scheduled);
