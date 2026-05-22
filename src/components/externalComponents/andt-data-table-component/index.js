/*eslint-disable array-callback-return*/
import React, { Component } from 'react';
import { Form, Select, Input, Icon, Row, Col, Button, Table, message, Popconfirm } from 'antd';
import axios from 'axios';
import './styles.css';

const FormItem = Form.Item;
const Option = Select.Option;

class DataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataLoader: false,
      apiData: [],
      currentPaginationPage: null,
      defaultPageSize: null,
      defaultPageSizeOption: [10, 20, 30, 40, 50, 100],
      tableData: this.props.dataSource,
      filterData: this.props.dataSource,
      tableDataHold: this.props.dataSource,
      bulkActionValue: null,
      bulkActionLabelToShowOnPopOver: null,
      bulkActionMsg: '',
      bulkActionBottomBtnLabel: '',
      bulkActionValueError: null,
      numberofSelectedRows: null,
      bulkActionPopOverConfirmVisible: false,
      selectedCustomFilterCol: null
    }
  }//End constructor

  filterDataArray = (text, dataArray, keys) => {
    const newData = dataArray.filter(item => {
      const textData = text.toUpperCase();
      for (var i = 0; i < keys.length; i++) {
        item[keys[i]] = item[keys[i]].toString();
        if (item[keys[i]].toUpperCase().indexOf(textData) > -1) {
          return item[keys[i]].toUpperCase().indexOf(textData) > -1;
        }//End if condition
      }//End for loop
    });
    return newData;
  }//End function

  //Next and previous links
  itemRender = (current, type, originalElement) => {
    if (type === 'prev') { return <a>Previous</a>; }
    if (type === 'next') { return <a>Next</a>; }
    return originalElement;
  }//End function

  changeCurrentPage = (page) => { this.setState({ currentPaginationPage: page }); }//End function

  showSizeChangerDropDown = () => {
    let { getFieldDecorator } = this.props.form;
    const optionList = this.props.sizeChangerOptions || this.state.defaultPageSizeOption;
    const pageOptionList = optionList.map((item, i) => { return (<Option key={i} value={item}>{item}</Option>) });
    return (
      <div>
        <FormItem label={this.props.sizeChangeLabel || "Record per page"}>{getFieldDecorator('pageSize', { initialValue: (this.props.sizeChangerOptions ? this.props.sizeChangerOptions[0] : this.state.defaultPageSizeOption[0]) })(
          <Select className="pageSizeSelectBox" onChange={(value) => this.setState({ defaultPageSize: value })}>
            {pageOptionList}
          </Select>
        )}</FormItem>
      </div>
    );
  }//End function

  showFilterField = () => {
    let { getFieldDecorator } = this.props.form;
    let filterColData = [];

    if (this.props.filterCol && this.props.filterCol.length >= 1) {
      filterColData = this.props.filterCol;
    } else {
      for (var i = 0; i < this.props.columns.length; i++) {
        filterColData.push(this.props.columns[i]['dataIndex']);
      }//End for loop
      //console.log(this.props.columns);
      //console.log(filterColData);
    }//End if condition
    //Remove Empty values from array
    filterColData.forEach((item, key) => { if (!item) { filterColData.splice(key, 1); } });
    return (
      <div>
        <FormItem label={this.props.filterLabel || "Filter"}>{getFieldDecorator('filter')(
          <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={(value) => this.setState({ tableData: this.filterDataArray(value.target.value, this.state.filterData, filterColData) })} placeholder={this.props.filterPlaceholder || "Filter data"} />
        )}</FormItem>
      </div>
    )
  }//End function

  showCustomFilterField = () => {
    let { getFieldDecorator } = this.props.form;
    let selectedfilterCol = []
    this.props.customFilterCol.forEach(item => { selectedfilterCol.push(item.value); })
    return (
      <React.Fragment>
        <Col lg={4} md={6} sm={24} xs={24}>
          <FormItem label={this.props.customFilterLabel || "Filter By"}>{getFieldDecorator('filterBy', { initialValue: null })(
            <Select
              style={{ width: '100%' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value) => {
                (this.props.dataSource && this.props.dataSource.length > 1) &&
                  this.setState({
                    selectedCustomFilterCol: value ? [value] : null,
                    tableData: this.filterDataArray('', this.state.filterData, selectedfilterCol)
                  });
                this.props.form.setFieldsValue({ filter: '' })
              }}>
              <Option value={null}>-Select-</Option>
              {this.props.customFilterCol.map(item => {
                return (<Option key={item.value} value={item.value}>{item.label}</Option>)
              })}
            </Select>
          )}</FormItem>
        </Col>
        <Col lg={4} md={6} sm={24} xs={24}>
          <FormItem label={this.props.filterLabel || "Filter"}>{getFieldDecorator('filter')(
            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={
              (value) => {
                (this.props.dataSource && this.props.dataSource.length > 1) &&
                  this.setState({
                    tableData: this.filterDataArray(
                      value.target.value,
                      this.state.filterData,
                      (this.state.selectedCustomFilterCol ? this.state.selectedCustomFilterCol : selectedfilterCol))
                  })
              }} placeholder={this.props.filterPlaceholder || "Filter data"} />
          )}</FormItem>
        </Col>
      </React.Fragment>
    )
  }//End function

  bulkAction = (position) => {
    let { getFieldDecorator } = this.props.form;
    const bulkOptionList = this.props.bulkAction.map((item, i) => { return (<Option key={i + 1} value={item.value + "=>" + item.label + "=>" + (item.bulkActionMsg ? item.bulkActionMsg : '') + "=>" + (item.bulkActionBottomBtnLabel ? item.bulkActionBottomBtnLabel : '')}>{item.label}</Option>) });
    return (
      <span className={(position === 'top' ? "bulkGroup" : "bulkGroup bulkGroupBottom")}>
        {/* Show field when at least one row is selected */}
        {this.state.numberofSelectedRows && this.state.numberofSelectedRows.selectedRowKeys.length > 0 ?
          <React.Fragment>
            <p className="bulkActionLabel">
              <span className="bulkGroupBottomLabel">{this.props.bulkActionLabel ? this.props.bulkActionLabel + " : " : "Bulk Action : "}</span>
              <span className="bulkActionError">{this.state.bulkActionValueError}</span>
              <span className="selectedRowsCount">{this.state.bulkActionValue && this.state.numberofSelectedRows && this.state.numberofSelectedRows.selectedRowKeys.length + ' rows is selected'}</span>
            </p>
            <FormItem>{getFieldDecorator('bulkAction', { initialValue: '' })(
              <Select onChange={(data) => {
                this.setState({
                  'bulkActionValue': data.split('=>')[0],
                  'bulkActionLabelToShowOnPopOver': data.split('=>')[1],
                  'bulkActionMsg': data.split('=>')[2],
                  'bulkActionBottomBtnLabel': data.split('=>')[3]
                }, () => { this.bulkActionHandler('skip') })
              }}>
                <Option key={0} value="">-Select-</Option>
                {bulkOptionList}
              </Select>
            )}</FormItem>

            <Popconfirm
              title={this.props.bulkActionMsg ? this.props.bulkActionMsg : (this.state.bulkActionMsg ? this.state.bulkActionMsg : `Are you sure to change status as '${this.state.bulkActionLabelToShowOnPopOver}'?`)}
              onConfirm={() => this.bulkActionHandler('run')}
              onCancel={() => { this.setState({ bulkActionPopOverConfirmVisible: false }) }}
              okText="Yes"
              cancelText="No"
              visible={this.state.bulkActionPopOverConfirmVisible}
            >
              <Button type="primary" onClick={() => this.bulkActionHandler('openPopOver')}>
                {this.props.bulkActionBottomBtnLabel ? this.props.bulkActionBottomBtnLabel :
                  (this.state.bulkActionBottomBtnLabel ? this.state.bulkActionBottomBtnLabel : <span><span className="bulkGroupBottomBtnText">Bulk&nbsp;</span>Action</span>)
                }
              </Button>
            </Popconfirm>
          </React.Fragment>
          : <div style={{height:"42px"}}></div>}
      </span>
    )//End return
  }//End function

  bulkActionHandler = (statusKeyword) => {
    if (!this.state.bulkActionValue) {
      this.setState({ 'bulkActionValueError': 'Please select action' })
      return false;
    }//End if condition
    if (!(this.state.numberofSelectedRows && this.state.numberofSelectedRows.selectedRowKeys.length > 0)) {
      this.setState({ 'bulkActionValueError': 'At least one row must be selected' })
      return false;
    }//End if condition
    if (statusKeyword === 'openPopOver') {
      this.setState({ 'bulkActionPopOverConfirmVisible': true })
    }//End if condition

    this.setState({ 'bulkActionValueError': '' })
    if (statusKeyword === 'run') {
      //alert('asdf');
      this.props.bulkActionHandler(this.state.numberofSelectedRows, this.state.bulkActionValue);
      this.setState({ 'bulkActionPopOverConfirmVisible': false })
    }//End if condition

  }//End function

  render() {
    const tableClass = (this.props.className ? this.props.className + " dataTable" : 'dataTable');
    //rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {

        //Getting rows id
        let selectedRowIds = [];
        selectedRows.forEach(element => { selectedRowIds.push(element['id']); });
        //End rows id

        if (typeof this.props.rowSelection === 'function') {
          this.props.rowSelection(selectedRowKeys, selectedRowIds, selectedRows);
        }//End if condition

        this.setState({
          'numberofSelectedRows': {
            'selectedRowKeys': selectedRowKeys,
            'selectedRowIds': selectedRowIds,
            'selectedRows': selectedRows,
          }
        })
      }
    }
    const paginationOptions = (attr) => {
      let res = {};
      if (attr.size) { res['size'] = attr.size; }
      if (attr.nextPreviousBtn) { res['itemRender'] = this.itemRender; }
      if (attr.itemDetails) { res['showTotal'] = (total, range) => `${range[0]}-${range[1]} of ${total} items`; }
      if (attr.simple) { res['simple'] = true; }
      if (attr.showQuickJumper) { res['showQuickJumper'] = true; }
      if (attr.itemTotal) { res['showTotal'] = (total) => `Total ${total} items`; }
      if (attr.showSizeChanger) {
        res['showSizeChanger'] = true;
        res['onShowSizeChange'] = (current, pageSize) => attr.showSizeChanger(current, pageSize);
        if (attr.sizeChangerOptions) { res['pageSizeOptions'] = attr.sizeChangerOptions; }
      }//End if condition
      if (attr.currentPage) {
        res['current'] = this.state.currentPaginationPage || attr.currentPage;
        res['onChange'] = (page) => { this.changeCurrentPage(page) }
      }//End if condition
      if (attr.showOnSinglePage) {//Default is false
        res['hideOnSinglePage'] = false;
      } else {
        res['hideOnSinglePage'] = true;
      }//End if condition
      if (this.props.showSizeChanger) {
        res['defaultPageSize'] = this.state.defaultPageSize || this.state.defaultPageSizeOption[0];
        res['pageSize'] = this.state.defaultPageSize || this.state.defaultPageSizeOption[0];
        if (this.props.sizeChangerOptions) {
          res['defaultPageSize'] = this.state.defaultPageSize || this.props.sizeChangerOptions[0];
          res['pageSize'] = this.state.defaultPageSize || this.props.sizeChangerOptions[0];
        }
      } else {
        res['defaultPageSize'] = attr.defaultPageSize || 10;
      }//End if condition

      return res;
    }//End function
    const classNameContainer = (this.props.classNameContainer ? this.props.classNameContainer + ' c_k_table_0' : 'c_k_table_0');
    return (
      <div className={classNameContainer}>

        {this.props.label
          ?
          (this.props.showSizeChanger ?
            (this.props.customFilter ?
              <Row gutter={10} className="m-b-10 headingAndFilter">
                <Col lg={12} md={24} sm={24} xs={24}>
                  <div>
                    <h1 className={this.props.desc ? 'tableLabel tableLabel2' : 'tableLabel'}>
                      {this.props.label}
                    </h1>
                    {this.props.desc && <p style={{ 'margin': '0px' }}>{this.props.desc}</p>}
                  </div>
                </Col>
                {this.showCustomFilterField()}
                <Col lg={4} md={6} sm={24} xs={24}>
                  {this.props.showSizeChanger && this.showSizeChangerDropDown()}
                </Col>
              </Row>
              :
              <Row gutter={10} className="m-b-10">
                <Col lg={16} md={12} sm={24} xs={24}>
                  <h1 className={this.props.desc ? 'tableLabel tableLabel2' : 'tableLabel'}>
                    {this.props.label}
                  </h1>
                  {this.props.desc && <p style={{ 'margin': '0px' }}>{this.props.desc}</p>}
                </Col>
                <Col lg={4} md={6} sm={24} xs={24}>
                  {this.props.filter && this.showFilterField()}
                </Col>
                <Col lg={4} md={6} sm={24} xs={24}>
                  {this.props.showSizeChanger && this.showSizeChangerDropDown()}
                </Col>
              </Row>
            )
            :
            <Row gutter={10} className="m-b-10">
              <Col lg={16} md={12} sm={24} xs={24}>
                <h1 className={this.props.desc ? 'tableLabel tableLabel2' : 'tableLabel'}>
                  {this.props.label}
                </h1>
                {this.props.desc && <p style={{ 'margin': '0px' }}>{this.props.desc}</p>}
              </Col>
              <Col lg={4} md={6} sm={24} xs={24}></Col>
              <Col lg={4} md={6} sm={24} xs={24}>
                {this.props.filter && this.showFilterField()}
              </Col>
            </Row>
          )


          :
          this.props.customFilter ?
            <Row gutter={10} className="m-b-10">
              {this.showCustomFilterField()}
              <Col lg={6} md={0} sm={24} xs={24}>
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                {this.props.bulkAction && this.bulkAction("top")}
              </Col>
              <Col lg={4} md={6} sm={24} xs={24}>
                {this.props.showSizeChanger ? this.showSizeChangerDropDown() : ''}
              </Col>
            </Row>
            :
            <Row gutter={10} className="m-b-10">
              <Col lg={4} md={7} sm={24} xs={24}>
                {this.props.filter && this.showFilterField()}
              </Col>
              <Col lg={6} md={10} sm={24} xs={24}>
                {this.props.bulkAction && this.bulkAction("top")}
              </Col>
              <Col lg={10} md={0} sm={24} xs={24}>
              </Col>
              <Col lg={4} md={7} sm={24} xs={24}>
                {this.props.showSizeChanger ? this.showSizeChangerDropDown() : ''}
              </Col>
            </Row>
        }

        <div className="tableContainer">
          <div className={(this.props.overFlow ? "overFlowTable" : "")}>
            {!this.state.tableData && this.state.dataLoader ? <div className="table_loader_1"></div> :
              <Table
                className={
                  tableClass + " tableStyles-1"
                  //  +
                  // (this.props.styleType === 1 && 'tableStyles-1')
                }//End className
                //{...this.props.rowSelection ? rowSelection={rowSelection} : ''}
                ////rowSelection={{}}
                rowSelection={(this.props.rowSelection ? rowSelection : undefined)}
                columns={this.props.columns}
                dataSource={this.state.tableData || this.state.apiData}
                total={this.state.tableData ? this.state.tableData.length : this.state.apiData.length}
                pagination={this.props.pagination && paginationOptions(this.props.pagination)}
                expandedRowRender={this.props.expandedRowRender ? this.props.expandedRowRender : undefined}
              />
            }
            {this.props.label &&
              <Row gutter={10}>
                <Col lg={14} md={24} sm={24} xs={24}>
                  {this.props.bulkAction && this.bulkAction("bottom")}
                </Col>
                <Col lg={10} md={24} sm={24} xs={24}></Col>
              </Row>
            }
          </div>
        </div>



      </div>
    );//End return
  }//End render

  componentDidMount() {
    this.getTableData = (api) => {
      this.setState({ dataLoader: true });
      axios.get(api).then(res => {
        //console.log(res.data);
        this.setState({ dataLoader: false, apiData: res.data.data.active });
      }).catch(error => {
        console.log(error);
        this.setState({ dataLoader: false });
        message.error('Interval server error, ' + error);
      });
    }//End function
    if (this.props.dataAPI) {
      this.getTableData(this.props.dataAPI);
    }//End if condition

  }//End componentDidMount

  componentWillReceiveProps(nextProps) {
    //Update state after dataSource of table (update table after add and delete record)
    if (this.state.tableDataHold !== nextProps.dataSource) {
      this.setState({
        tableData: nextProps.dataSource,
        tableDataHold: nextProps.dataSource,
        filterData: nextProps.dataSource,
      });
    }//End if condition
  }//End componentWillReceiveProps

}//End class





export default Form.create()(DataTable);