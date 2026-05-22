import React, { Component } from 'react';
import { Row, Col, Modal, Icon } from 'antd';
import DataTable from '../../externalComponents/andt-data-table-component';
import Services from '../../services';
import SideNavigation from '../../mutual/sideNavigation';
import ScreenLoader from '../../externalComponents/screen-loader';

const { confirm } = Modal;

class Subscribers extends Component{

constructor(props){
  super(props)
  this.state = {getDataLoader : false, listData : [], deleteListLoader : {}};
}//End constructor

getData = () => {
  this.setState({getDataLoader:true});
  Services.http('get','subscribers/get/get_list_data.php').then(res=>{
    this.setState({getDataLoader:false});
    if(!res){return false;}
    this.setState({listData:res.data});
  });
}//End function

componentDidMount(){
  this.getData();
}//End componentDidMount


deleteList = (id) => {
  this.setState({deleteListLoader:{'id':id}});
  Services.http('get','subscribers/post/deleteList.php?id='+id).then(res=>{
    this.setState({deleteListLoader:{'id':false}});
    if(!res){return false;}
    //this.getData();
    this.setState({listData : Services.deleteRowFromArrById(this.state.listData,id)});
  });
}//end function


showDeleteConfirm = (id) => {
  let th = this;
  confirm({
    title: 'Are you sure to delete this List?',
    content: `List can not be recover after deleting, and all subscribers will be removed from this list.`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {th.deleteList(id);}
  });
}



render(){

    const columns = [
      {
        title: 'List Name',
        dataIndex: 'list_name',
        'width' : '50%',
        sorter: (a, b) => a.list_name.length - b.list_name.length,
        render: (text,row) =>
        <div>
          {Services.accessControl(15) ? 
            <a className="dis-block" onClick={() => this.props.history.push('/app/subscribers/list/'+row.id)}>{text}</a> : 
            text
          }
          </div>
      },{
        title: 'Created at',
        dataIndex: 'dateTime',
        'width' : '25%',
        sorter: (a, b) => a.dateTime.length - b.dateTime.length,
      },{
        title: 'Subscribers',
        dataIndex: 'totalSubscribers',
        'width' : '15%',
        sorter: (a, b) => a.totalSubscribers - b.totalSubscribers,
        render: (text,row) =>
          <div>
            {Services.accessControl(15) ? 
              <a className="dis-block" onClick={() => this.props.history.push('/app/subscribers/list/'+row.id)}>{text}</a> : 
              text
            }
          </div>
      }];

    if(Services.accessControl(14)){
      columns.push({
        title: 'Action',
        dataIndex: 'status',
        'width' : '10%',
        render: (record,row) =>
        <div>
          {
            this.state.deleteListLoader.id === row.id ?
            <img src={`${process.env.PUBLIC_URL}/image/round-loader_2.gif`} style={{'width':'10px'}} alt=""/> :
            <button className="btnToAnchor" onClick={() => this.showDeleteConfirm(row.id)}>Delete</button>
          }
        </div>
      })
    }//End if condition


    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <h3 className="pageTitle"><Icon type="user-add" /> Manage Subscribers</h3>
            <p className="pageDesc">Use lists to organize separate groups of subscribers e.g. customers and employees. Correctly managing your lists and using segments will allow you to get the most out of your email marketing as campaigns, segments, subscriber data and engagement are not shared across lists.</p>
            <ScreenLoader active={this.state.getDataLoader}>
              <DataTable 
                columns={columns}
                dataSource={this.state.listData}
                showSizeChanger={true}
                filter="true"
                filterCol={["key", "list_name", "dateTime", "totalSubscribers"]}
                pagination={{itemDetails : true}}
              />
            </ScreenLoader>
          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <SideNavigation btn="cl"/>
            {/* <SideNavigation title="You might also want to..." btn="cl" links="cc,cl,smtp,um"/> */}
          </Col>
        </Row>
      </div>
    )
  }//end rendero
}

export default Subscribers;
