import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Popconfirm, Icon } from 'antd';
import DataTable from '../../../externalComponents/andt-data-table-component';
import AccessControl from '../../../externalComponents/user-base-access-control';
import CampaignServices from '../campaign_services';
import Services from '../../../services';

class Draft extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], deleteLoader: {} };
  }//End constructor

  deleteCampaign = (id) => {
    this.setState({ deleteLoader: { 'id': id } });
    Services.http('get', 'campaign/post/deleteCampaign.php?id=' + id).then(res => {
      this.setState({ deleteLoader: { id: false } });
      if (!res) { return false; }//end if condition
      this.setState({ data: Services.deleteRowFromArrById(this.state.data, id) });
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
        title: 'Content',
        dataIndex: 'inserted_time',
        width: '12%',
        sorter: (a, b) => a.inserted_time - b.inserted_time,
        render: (text, row) =>
          <div>
            {
              (row.template_type === 'importFromPC' && row.template_file_name) ||
                (row.template_type === 'importFromURL' && row.template_url) ||
                (row.template_type === 'composeHTML') ?
                <Icon type="check-circle" className="text-green fs-16" theme="filled" /> :
                <Icon type="close-circle" className="text-red fs-16" theme="filled" />
            }
          </div>
      }, {
        title: 'Recipients',
        dataIndex: 'template_type',
        width: '12%',
        sorter: (a, b) => a.template_type - b.template_type,
        render: (text, row) =>
          <div>
            {row.list_ref_id ? <Icon type="check-circle" className="text-green fs-16" theme="filled" /> : <Icon type="close-circle" className="text-red fs-16" theme="filled" />}
          </div>
      }];

    if ((Services.accessControl(22) || Services.accessControl(18)) && !this.props.readonly) {
      columns.push({
        title: 'Action',
        dataIndex: 'id',
        align: 'center',
        width: '13%',
        render: (text, row) =>
          <div>
            {
              this.state.deleteLoader.id === row.id ?
                <span className="fs-9"><img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{ 'width': '10px' }} alt="" /> &nbsp;Please wait...</span> :
                <span>
                  <a title="View Template" onClick={() => this.props.templatePreview(row.id)}><i className="fa fa-eye fs-14"></i></a>
                  &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                  <AccessControl>
                    <a ubac_id={22} onClick={() => {
                      CampaignServices.localStorageEncode({ cid: row.id, cn: row.campaign_name });
                      this.props.history.push('/app/createCampaign/step3/snapshot');
                    }}><i className="fa fa-send-o" /></a>
                    <span ubac_id={18}>
                    &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                      <Popconfirm title="Are you sure to delete this draft?" onConfirm={() => this.deleteCampaign(row.id)} okText="Yes" cancelText="No"><a><i className="fs-14 fa fa-trash-o" /></a></Popconfirm>
                    </span>
                  </AccessControl>
                </span>
            }
          </div>
      });
    }//End if condition
    return (
      <div className="container">
        {(this.state.data && this.state.data.length > 0) &&
          <React.Fragment>
            <DataTable
              columns={columns}
              label="Recent Draft"
              desc="All recent drafted campaign list are below."
              dataSource={this.state.data}
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
  componentDidMount() { this.setState({ data: this.props.data }); }//End componentDidMount
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) { this.setState({ data: this.props.data }) }//end if condition
  }//End componentDidUpdate  
}//End component

export default withRouter(Draft);
