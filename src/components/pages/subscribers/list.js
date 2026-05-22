import React, { Component } from 'react';
import { Row, Col, Button, Tabs } from 'antd';
import DataTable from '../../externalComponents/andt-data-table-component';
import SideNavigation from '../../mutual/sideNavigation';
import Services from '../../services';
import UpdateListName from './partials/updateListName';
import BreadcrumbList from './partials/breadcrumb';
import ScreenLoader from '../../externalComponents/screen-loader';

const TabPane = Tabs.TabPane;

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      exportLoaderCSV: false,
      exportLoaderExcel: false,
      exportLoaderPdf: false,
      subscribers_data: false,
      subscribers_status: [
        {
          key: 1,
          status: '',
          data: [{}]
        }
      ],
      bulkLoader: false,
      listNameData: {},
      recentListRefresh: false
    };
  }//End constructor

  getData = (list_id) => {
    this.setState({ loader: true });
    Services.http('get', 'subscribers/get/get_list_name_or_subscriber_data.php?id=' + list_id).then(res => {
      this.setState({ loader: false });
      if (!res) { return false; }
      res = res.data;
      //console.log(res);
      this.setState({
        subscribers_data: res.subscribers,
        subscribers_status: res.status_data,
        bulkLoader: false,
        listNameData: {
          id: this.props.match.params.list_id,
          list_name: res.list_name,
          description: res.description
        }
      });
    });
  }//End function


  updateStatusLocalAfterDB = (rows, fromStatus, toStatus) => {
    let statusArr = this.state.subscribers_status;
    let data = { ...this.state.subscribers_data };
    //Get From Status Name and Data
    var index = statusArr.findIndex(x => x.id === fromStatus);
    fromStatus = statusArr[index].status;
    var fromStatusData = [...data[statusArr[index].status]];
    //Get To Status Name and Data
    index = statusArr.findIndex(x => x.id === toStatus);
    toStatus = statusArr[index].status;
    var toStatusData = [...data[statusArr[index].status]];

    //Transfer from 'From Status' to 'To Status';
    rows.selectedRows.forEach(item => {
      var index = fromStatusData.findIndex(x => x.id === item.id);
      toStatusData.push(fromStatusData[index]);
      fromStatusData.splice(index, 1);//Delete specific index
    });

    data[fromStatus] = fromStatusData;
    data[toStatus] = toStatusData;
    this.setState({ subscribers_data: data });
  }//End function


  bulkActionHandler = (rows, status, currentStatus) => {
    this.setState({ bulkLoader: true });
    let postVar = {
      'status': status,
      'user_ids': rows.selectedRowIds,
      'list_id': this.props.match.params.list_id,
    }
    Services.http("post", "subscribers/post/bulk_action.php", postVar).then((res) => {
      this.setState({ bulkLoader: false });
      if (!res) { return false; }
      this.updateStatusLocalAfterDB(rows, currentStatus, status);
      //this.getData(this.props.match.params.list_id);
    });
  }//End function

  redirectToUserData = (data) => {
    let st = this.state.listNameData;
    Services.saveArrLocalStorage([data.id, data.full_name, st.id, st.list_name], '/app/subscribers/list/details');
  }//End function

  redirectToAddNewSubscribers = () => {
    let st = this.state.listNameData;
    let listDatabase64 = Services.encode64(st.id + '=>' + st.list_name + '=>' + st.description);
    let sessionName = Services.randomAlphaNumber(6, true);
    localStorage.setItem(sessionName, listDatabase64);
    this.props.history.push('/app/subscribers/list/addSubscribers/' + sessionName);
  }//End function

  exportList = (exportType) => {
    if (exportType === 'csv') { this.setState({ exportLoaderCSV: true }) };
    if (exportType === 'excel') { this.setState({ exportLoaderExcel: true }) }
    if (exportType === 'pdf') { this.setState({ exportLoaderPdf: true }) };

    Services.http("get", "subscribers/post/exportList.php?id=" + this.props.match.params.list_id + '&list_name=' + this.state.listNameData.list_name.split(' ').join('_') + '&exportIn=' + exportType).then((res) => {
      this.setState({ exportLoaderCSV: false, exportLoaderExcel: false, exportLoaderPdf: false });
      if (!res) { return false; }
      Services.fileDownload(res.path, res.fileName);
    });
  }//end function


  render() {
    const st = this.state;
    const columns = [
      {
        title: 'Email Address',
        dataIndex: 'email',
        key: 'email',
        width: '30%',
        sorter: (a, b) => a.email.length - b.email.length,
        render: (text, row) =>
          <a className="dis-block" onClick={() => this.redirectToUserData(row)}>{text}</a>
      }, {
        title: 'Name',
        dataIndex: 'full_name',
        key: 'full_name',
        width: '45%',
        sorter: (a, b) => a.name.length - b.name.length,
      }, {
        title: 'Subscribed',
        dataIndex: 'subscribed',
        key: 'subscribed',
        width: '25%',
        sorter: (a, b) => a.subscribed.length - b.subscribed.length,
      }];
    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <ScreenLoader active={st.loader}>
              <BreadcrumbList currentPage="List" />
              <UpdateListName data={st.listNameData} refresh={(status) => this.setState({ recentListRefresh: status })} resetProps={(data) => this.setState({ listNameData: data })} />
              <ScreenLoader active={st.bulkLoader}>
                <Tabs defaultActiveKey="1" className="tab_style_1" type="card">
                  {st.subscribers_status.map((data) => {
                    return (
                      <TabPane key={data.key} tab={data.status + " (" + (st.subscribers_data !== false ? st.subscribers_data[data.status].length : 0) + ")"}>
                        <DataTable
                          columns={columns}
                          bulkAction={data.bulkAction}
                          bulkActionHandler={(rows, status) => this.bulkActionHandler(rows, status, data.id)}
                          dataSource={st.subscribers_data[data.status]}
                          rowSelection={true}
                          showSizeChanger={true}
                          pagination={{ itemDetails: true, }}
                          customFilter="true"
                          customFilterCol={[
                            { label: 'Email Address', value: 'email' },
                            { label: 'Name', value: 'full_name' }
                          ]}
                        />
                      </TabPane>
                    )
                  })}
                </Tabs>
              </ScreenLoader>
            </ScreenLoader>
            <br />
          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <Button onClick={() => this.redirectToAddNewSubscribers()} type="primary" size="large" className="w-full">Add new subscribers</Button>
            <br /><br />
            <Button.Group style={{ width: '100%' }}>
              <Button style={{ width: '33.3%' }} disabled={st.loader || st.exportLoaderPdf || st.exportLoaderExcel} loading={st.exportLoaderCSV} onClick={() => this.exportList('csv')}>{!st.exportLoaderCSV && <span><i className="fa fa-file-excel-o" />&nbsp;</span>}CSV</Button>
              <Button style={{ width: '33.3%' }} disabled={st.loader || st.exportLoaderPdf || st.exportLoaderCSV} loading={st.exportLoaderExcel} onClick={() => this.exportList('excel')}>{!st.exportLoaderExcel && <span><i className="fa fa-file-excel-o" />&nbsp;</span>}XLS</Button>
              <Button style={{ width: '33.3%' }} disabled={st.loader || st.exportLoaderExcel || st.exportLoaderCSV} loading={st.exportLoaderPdf} onClick={() => this.exportList('pdf')}>{!st.exportLoaderPdf && <span><i className="fa fa-file-pdf-o" />&nbsp;</span>}PDF</Button>
            </Button.Group>
            <br /><br />
            {!st.recentListRefresh && <SideNavigation links="recentSubscribersList" />}
          </Col>
        </Row>
      </div>
    )
  }//end render
  componentDidMount() { this.getData(this.props.match.params.list_id); }//End componentDidMount
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.list_id !== this.props.match.params.list_id) {
      this.getData(nextProps.match.params.list_id);
    }//End if condition
  }//End componentWillReceiveProps
}//End class
export default List;
