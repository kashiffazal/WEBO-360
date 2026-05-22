/*eslint-disable no-new-func*/
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Row, Col, Form, Select, Button, notification, Popconfirm, message } from 'antd';
import DataTable from '../../../externalComponents/andt-data-table-component';
import AgreementDialog from '../../../externalComponents/antd-agreement-dialog';
import Services from '../../../services';

const FormItem = Form.Item;
const Option = Select.Option;

class MatchCols extends Component {

  state = {
    loader: false,
    modified_data: [],
    modified_data_cols: [],
    deleteColumnKeys: [],
    showDataTable: false,
    btnDisabled: true
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return false }//End if condition

      var data = this.props.data;

      //Object to Array for below conditions
      var valuesArr = Object.values(values);

      //Getting labels -----------------------------------------------//
      var labelArr = [];//Label array with same indexes as values
      var tempValArr = [];
      for (var i = 0; i < valuesArr.length; i++) {
        tempValArr.push(valuesArr[i].split('=>')[0]);
        labelArr.push(valuesArr[i].split('=>')[1]);
      }//End for loop
      values = tempValArr;
      valuesArr = Object.values(values);
      //---------------------------------------------------------------//

      //Find duplicate selection of columns
      var duplicateCols = Services.find_duplicate_in_array(labelArr, "Nothing (skip)");
      if (duplicateCols.length > 0) {
        notification['error']({ message: data.duplicateError.errorTitle, description: data.duplicateError.errorMsg + "(" + duplicateCols.join(',') + ")", duration: data.duplicateError.errorDuration || 5 });
        return false;
      }//End if condition

      //Checking user selection for valid email list ------//
      var emailIndex = valuesArr.indexOf('email');
      if (emailIndex < 0) {
        notification['error']({ message: data.forgotEmailError.errorTitle, description: data.forgotEmailError.errorMsg, duration: data.forgotEmailError.errorDuration || 5 });
        return false;
      }//End if condition

      var getSingleEmail = data.dataList[emailIndex][1][0];
      if (!Services.validateEmail(getSingleEmail)) {
        notification['error']({ message: data.selectionError.errorTitle, description: data.selectionError.errorMsg, duration: data.selectionError.errorDuration || 5 });
        return false;
      }//End if condition
      //----------------------------------------------------//

      //Set post Obj
      let postObj = {}
      postObj.data = {
        'values': values,
        'label': labelArr,
        'list_ref_id': data.list_ref_id,
        'fileName': data.fileName,
        'importFromList': data.importFromList
      };

      this.setState({ loader: true });
      Services.http('post', 'subscribers/post/addSubscribers/2_set_columns.php', postObj).then(res => {
        this.setState({ loader: false });
        //console.log(res);
        if (!res) { return false; }
        //return false;
        let rla = res.arrayData.labels;
        for (var i = 0; i < rla.length; i++) {
          //Convert string js sorter function to real js function
          rla[i].sorter = Function('"use strict";return (' + rla[i].sorter + ')')();
          //Unsubscribe to black list condition
          if (rla[i].dataIndex === "s_status") { rla[i].render = (record) => <div>{record === 'Active' ? <span className="active">Active</span> : <span className="unsubscribed">Black list <span style={{ 'fontSize': '12px', 'fontWeight': '400' }}>({record})</span></span>}</div> }//End if condition
        }//End for loop
        //Add delete subscriber column
        rla.push({ title: 'Action', dataIndex: '', render: (value, row, index) => <Popconfirm title={res.subscriberDeleteSure} onConfirm={() => this.deleteSubscriber(index, row.key, res.subscriberDeleteMsg)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm> })
        this.setState({ modified_data_cols: rla, modified_data: res.arrayData.data, showDataTable: true });
      });
    });//End form properties
  }//End function

  deleteSubscriber = (index, key, delMsg) => {
    const data = this.state.modified_data;
    const deleteKeys = this.state.deleteColumnKeys;
    data.splice(index, 1);
    deleteKeys.push((key - 1)); //-1 means key to index for backend delete from csv file
    this.setState({ modified_data: data, deleteColumnKeys: deleteKeys });
    message.success(delMsg);
  }//End function

  finalSubmitSubscribers = () => {
    var data = this.props.data;

    //Set post Obj
    let postObj = {}
    postObj.data = {
      'deleteKeys': this.state.deleteColumnKeys,
      'list_ref_id': data.list_ref_id,
      'fileName': data.fileName,
      'importFromList': data.importFromList
    };

    this.setState({ loader: true });
    Services.http('post', 'subscribers/post/addSubscribers/3_upload_subscribers.php', postObj).then(res => {
      this.setState({ loader: false });
      //console.log(res);
      if (!res) { return false; }
      this.props.history.push('/app/subscribers/list/' + data.list_ref_id);
    });

  }//End function

  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.props.data.dataList;
    const colList = this.props.data.colList;
    const st = this.state;
    //console.log(st.modified_data);
    return (
      <div className="matchColContainer">
        <Row gutter={20}>
          <Col lg={4} md={2} sm={24} xs={24}></Col>
          <Col lg={16} md={20} sm={24} xs={24}>

            <div className={st.showDataTable ? "dis-none" : "dis-block"}>
              <h3 className="pageTitle m-0">Match the columns with your subscriber list fields…</h3>
              <p className="pageDesc">For each column of your subscriber data, select a field that it corresponds to.</p>

              <Form onSubmit={this.handleSubmit}>
                {data.map((item, i) => {
                  return (
                    <Row gutter={20} key={i}>
                      <Col lg={18} md={16} sm={24} xs={24}>
                        <div className="itemListContainer">
                          <div className="itemTitle">{item[0]}</div>
                          {item[1].map((item_li, k) => { return (<div className="itemValues" key={k}>{item_li}</div>) })}
                        </div>
                      </Col>
                      <Col lg={6} md={8} sm={24} xs={24}>
                        <div className="matchColList">
                          <p>Belongs to...</p>
                          <FormItem>{getFieldDecorator(i.toString(), { initialValue: "", rules: [{ required: true, message: 'Please select' }] })(
                            <Select>
                              <Option value="">-Select-</Option>
                              {colList.map(item_col => { return (<Option key={item_col.key} disabled={item_col.disabled} value={item_col.value + "=>" + item_col.label}>{item_col.label}</Option>) })}
                            </Select>
                          )}</FormItem>
                        </div>
                      </Col>
                    </Row>
                  )
                })}
                <hr className="hr-dashed" />
                <br />
                <Button size="large" type="primary" htmlType="submit" loading={st.loader}>Match completed</Button>
                &nbsp; or &nbsp;
                <button type="button" onClick={() => { this.props.goBack() }} className="btnToAnchor btaColor"><u>go back</u></button>
              </Form>
            </div>

            <div className={st.showDataTable ? "dis-block" : "dis-none"}>
              <DataTable
                label="Final list preview before uploading"
                desc="Please review all your subscribers before upload, you can delete any subscriber."
                columns={st.modified_data_cols}
                dataSource={st.modified_data}
                showSizeChanger={true}
                //filter="true"
                pagination={{ itemDetails: true, }}
                customFilter="true"
                customFilterCol={[
                  { label: 'Full Name', value: 'full_name' },
                  { label: 'Email Address', value: 'email' },
                  { label: 'Status', value: 's_status' }
                ]}
              />
              <AgreementDialog
                className="m-t-12 m-b-13"
                title={'Subscriber list Agreement'}
                disabledBtn={(status) => this.setState({ btnDisabled: status })}
                lineContent={'Check here to indicate that you have read and agree to the terms of the <link>Subscribers List Agreement.</link>'}
              />
              <hr className="hr-dashed" />
              <Button onClick={() => this.finalSubmitSubscribers()} size="large" type="primary" loading={st.loader} disabled={this.state.btnDisabled}>Finish adding subscribers</Button>
              &nbsp; or &nbsp;
              <button type="button" onClick={() => this.setState({ showDataTable: false })} className="btnToAnchor btaColor"><u>go back</u></button>
            </div>

          </Col>
          <Col lg={4} md={2} sm={24} xs={24}></Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(withRouter(MatchCols));