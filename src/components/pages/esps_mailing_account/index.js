import React, { Component } from 'react';
import { Row, Col, Button, Popconfirm, Spin, Icon, Tabs, Empty } from 'antd';
import ESPSModal from './add_ESPS_modal';
import DataTable from '../../externalComponents/andt-data-table-component';
import AccessControl from '../../externalComponents/user-base-access-control';
import SideNavigation from '../../mutual/sideNavigation';
import Services from '../../services';
import TabsCol from './partial/list_cols';

const TabPane = Tabs.TabPane;

class ESPSMailingAccount extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loader: false,
      espsData: [{ key: 1, tab_name: '-', data: [{ key: 1 }] }],
      visibleModal: false, deleteESPSLoader: {}, esps_server_id_selected: '1',
      tabCol: []
    };
  }


  getESPS_data = () => {
    Services.http("get", "esps/get/index.php?id=all").then(res => {
      // console.log(res.data);
      this.setState({ loader: false, espsData: res.data });
    });
  }//End function


  open_ESPS_edit_modal = (row) => {
    let rowNew = {};
    Object.keys(row).forEach(item => { rowNew[item] = row[item]; })
    rowNew.esps_server_id = this.state.esps_server_id_selected;
    delete rowNew.inserted_by;
    delete rowNew.inserted_date;
    delete rowNew.inserted_time;
    delete rowNew.updated_date;
    delete rowNew.updated_time;
    delete rowNew.updated_by;
    delete rowNew.key;
    if (rowNew.esps_server_id === '2') {
      delete rowNew.api_key;
    }//End if condition
    //console.log(rowNew);
    this.setState({ data: row }, () => { this.setState({ visibleModal: true, data: rowNew }); });
  }//End function


  deleteESPS = (id) => {
    let table_name = Services.getObjectFromArr(this.state.esps_server_id_selected, 'esps_server_id', this.state.espsData).table_name;
    this.setState({ deleteESPSLoader: { id: id } });
    Services.http('get', 'esps/post/delete.php?id=' + id + '&table_name=' + table_name).then(res => {
      this.setState({ deleteESPSLoader: { 'id': false } });
      if (!res) { return false; }
      this.getESPS_data();
    });
  }//End function

  render() {
    const st = this.state;
    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <h3 className="pageTitle"><Icon type="mail" /> Delivery Servers</h3>
            <p className="fs-14">Use lists to organize separate groups of subscribers e.g. customers and employees. Correctly managing your lists and using segments will allow you to get the most out of your email marketing as campaigns, segments, subscriber data and engagement are not shared across lists.</p>
            <Spin spinning={this.state.loader}>
              {(!st.espsData.length > 0) ?
                <div className="m-t-50">
                  <Empty />
                </div>
                :
                <Tabs type="card" onChange={(e) => this.setState({ 'esps_server_id_selected': Services.getObjectFromArr(e, 'key', st.espsData).esps_server_id })}>
                  {st.espsData && st.espsData.map((data) => {
                    return (
                      <TabPane key={data.key} tab={data.tab_name}>
                        <DataTable
                          columns={st.tabCol[data.key - 1]}
                          dataSource={data.data}
                          rowSelection={false}
                          showSizeChanger={true}
                          filter="true"
                          pagination={{ itemDetails: true, }}
                          expandedRowRender={!TabsCol.expendData[data.key - 1] ? false : record => {return TabsCol.expendData[data.key - 1].expend(record)}}
                        />
                      </TabPane>
                    )
                  })}
                </Tabs>
              }
            </Spin>
          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <AccessControl>
              <Button ubac_id={2} onClick={() => { this.setState({ visibleModal: true, data: null }) }} type="primary" size="large" className="w-full m-b-20">Add New Delivery Server</Button>
            </AccessControl>
            <ESPSModal
              visible={this.state.visibleModal}
              onCancel={(status) => this.setState({ visibleModal: status })}
              callBack={this.getESPS_data}
              data={this.state.data}
            />
            <SideNavigation title="You might also want to..." links="smtp" />
          </Col>
        </Row>
      </div>
    );//End return
  }//End render

  componentWillMount() {
    //console.log(this.state.espsData[0].tab_name);
    this.setState({ loader: true }, () => { this.getESPS_data(); });
    const last_col = {
      title: 'Action',
      width: '12%',
      align:'center',
      render: (text, row) => {
        return (
          <div>
            {
              this.state.deleteESPSLoader.id === row.id ?
                <span><img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{ 'width': '10px' }} alt="" /> <span className='fs-10'>Deleting...</span></span> :
                <span>
                  {Services.accessControl(3) && <span><a ubac_id={3} onClick={() => this.open_ESPS_edit_modal(row)}>Edit</a> &nbsp;&nbsp;|&nbsp;&nbsp;</span>}
                  {Services.accessControl(4) && <Popconfirm title="Are you sure to delete this ESPS?" onConfirm={() => this.deleteESPS(row.id)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>}
                </span>
            }
          </div>
        )
      }
    };

    //Push last_col
    var tempCol = [];
    TabsCol.columns.forEach((item, i) => {
      let newSet = [...item];
      newSet.push(last_col);
      tempCol.push(newSet);
    });
    this.setState({ tabCol: [...tempCol] });
  }//End componentDidMount



}//End class

export default ESPSMailingAccount;
