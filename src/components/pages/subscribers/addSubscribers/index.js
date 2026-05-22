/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Input, Row, Col, Button, Spin, message } from 'antd';
import SideNavigation from '../../../mutual/sideNavigation';
import Services from '../../../services';
import BreadcrumbList from '../partials/breadcrumb';
import UploadFile from '../../../externalComponents/antd-upload-file-component';
import MatchCols from './matchCols';
import axios from 'axios';
import './styles.less';

const { TextArea } = Input;


class AddSubscribers extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      loader: false,
      listData : [],
      textAreaValue : null,
      uploadableFile : [],
      showProgressBar : false,
      uploadProgress : 0,
      matchColPage : false,
      matchColArr : {}
    };
  }//End constructor


  addSubscribers = () => {
    let st = this.state
    let fileExists = (this.state.uploadableFile.length >= 1);
    
    let values = {};
    values.emailList = st.textAreaValue;
    values.csvFile = st.uploadableFile;
    values.list_ref_id = st.listData[0];
    values.list_name = st.listData[1];

    if(fileExists || st.textAreaValue){

      if(fileExists){
        this.setState({showProgressBar : true});
        values = Services.post_obj(values,st.uploadableFile[0],'csvFile');
      }//End if condition

      this.setState({ loader: true });
      axios({
        url: window.domainPath+'/apis/subscribers/post/addSubscribers/1_csv_or_string_upload.php',
        method: 'post',
        data: values,
        onUploadProgress: (e) => {this.setState({uploadProgress : Math.round((e.loaded * 100) / e.total)})},
        withCredentials: true,//Send browser cookies created by php session (withCredentials: true) //If you remove this then php session will not be pass to another php page
      }).then(res => {
        res = res.data;
        if(res.status){
          //console.log(res);
          Services.handelRequest(res,200);
          //Just for passing id ans other info in child component
          res.data.list_ref_id = st.listData[0]
          this.setState({matchColArr : res.data} ,() => {
            this.setState({matchColPage : true});  
          })
        }else{
          Services.handelRequest(res,400);
        }//End if condition
        
        this.setState({uploadableFile: [], loader: false, showProgressBar : false});

      }).catch(error => {
        this.setState({loader: false, showProgressBar : false});
        Services.handelRequest(error,404);
      });
    }else{
      message.error('Please provide emails');
    }//End if condition
  };//End function

  render() {
    const sld = this.state.listData;
    const st = this.state;
    return (
      <div>
        {st.matchColPage ?
        <React.Fragment>
          <BreadcrumbList currentPage="Add new subscriber" listId={sld[0]} listName={sld[1]}/><br/><br/>
          <MatchCols data={st.matchColArr} goBack={() => this.setState({matchColPage : false})}/>
        </React.Fragment>
        : 
        <Row gutter={40}>
          <Col lg={19} md={18} sm={24} xs={24}>
            <BreadcrumbList currentPage="Add new subscriber" listId={sld[0]} listName={sld[1]}/>
            <h3 className="pageTitle">Add new subscriber</h3>
            <p className="pageDesc">Each subscriber should be on a new line. You can include any extra details such as name and age, and we’ll match them up with your custom fields in the next step.</p>
            <div className="container_3">
                <Spin spinning={st.loader}>
                  <div className="textAreaContainer">
                    <TextArea disabled={st.uploadableFile.length >= 1} autosize={{ minRows: 10, maxRows: 20}} onChange={(e) => this.setState({textAreaValue : e.target.value, uploadableFile : []})}/>
                    {!st.textAreaValue && 
                      <div className="textAreaPlaceholder">
                        sallysparrow@me.com, Sally Sparrow <br/>
                        aaron@speakeasy.com, Aaron Speakeasy<br/>
                        -OR-<br/>
                        Sally Sparrow, sallysparrow@me.com<br/>
                        Aaron Speakeasy, aaron@speakeasy.com
                      </div>
                    }
                  </div>
                </Spin>
                <UploadFile
                  className="m-b-10"
                  accept=".csv"
                  restrictExtension="csv"
                  loader={st.showProgressBar}
                  progress={st.uploadProgress}
                  disabled={st.textAreaValue}
                  onChange={(files) => this.setState({uploadableFile : files, textAreaValue : ''})}
                />
                <Button onClick={() => this.addSubscribers()} size="large" type="primary" htmlType="submit" loading={this.state.loader}>Import these subscribers</Button>
                &nbsp; or &nbsp;
                <button type="button" onClick={() => this.props.history.push('/app/subscribers/list/' + sld[0])} className="btnToAnchor btaColor"><u>go back</u></button>
            </div>
          </Col>
          <Col lg={5} md={6} sm={24} xs={24}><SideNavigation links="recentSubscribersList"/></Col>
        </Row>
        }{/** End MatchCol condition*/}
      </div>
    )
  }//end render
  componentWillMount(){
    let sessionValue = localStorage.getItem(this.props.match.params.listData);
    if(!sessionValue){window.history.go(-2);return false;}
    let listData = Services.decode64(sessionValue).split('=>');
    //console.log(subscriberValues);
    this.setState({listData});
  }//End componentWillMount
}//End class
export default AddSubscribers;
