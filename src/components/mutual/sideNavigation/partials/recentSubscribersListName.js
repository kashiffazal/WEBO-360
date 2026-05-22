import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Services from '../../../services';
import { Spin } from 'antd';

class RecentSubscribersListName extends Component{
  constructor(props){
    super(props);
    this.state = {recentList : [], loader: false}
  }//End constructor

  componentDidMount(){
    //Getting recent list name ---------------------------------*/
    this.setState({loader : true});
    Services.http('get','subscribers/get/get_list_name_or_subscriber_data.php?limit=10').then(res => {
      this.setState({loader : false}, () => {
        if(!res){return false;}
        this.setState({recentList : res.data, loader : false});
      });
    })//End asios post
    /*End Getting recent list name---------------------------------*/
  }//End componentWillMount

  mapArray = (arr) => {
    if (arr && arr.length >= 1) {
      return arr.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <Link to={`/app/subscribers/list/${item.id}`}>{item.list_name}</Link>
            <span>{item.description}</span>
          </React.Fragment>
        )//End return
      });
    }else{ return <span>List is not created yet.</span>; }//end if condition
  }//End fucntion

  render(){
    return(
      <Spin tip="Loading..." spinning={this.state.loader}>
        <span className="childComponent">
          <p>Recent created list</p>
            {this.mapArray(this.state.recentList)}
            
        </span>
      </Spin>
    )//End return
  }//End render
}//End class
export default RecentSubscribersListName;
