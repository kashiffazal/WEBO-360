import React, { Component } from 'react';
import { Row, Col, Form, Button, Tooltip } from 'antd';
import moment from 'moment';
import { AntInput } from '../../externalComponents/antd-fields';
import DataTable from '../../externalComponents/andt-data-table-component';
import Services from '../../services';
import ScreenLoader from '../../externalComponents/screen-loader';
import $ from 'jquery';
import './styles.less';

const ButtonGroup = Button.Group;

class SubReports extends Component {
  state = {
    getLoader: false,
    getCampaignLoader: false,
    getListLoader: false,
    loader: false,
    loaderPdf: false,
    loaderExcel: false,
    loaderCSV: false,
    formData: {},
    espsAcData: [],
    disabledListField: false,
    list_ref_ids: '',
    disabledFromDate: false,
    data: null,
    tableOverFlow: false,
    colapseIcon: 'double-left',
    tableOverFlowIcon: 'arrows-alt',
    selectedESPSName: 'All',
    selectedESPSAcName: 'All',
    selectedCampaignName: 'All',
    selectedListName: 'All',
    selectedActionName: 'All',
    holdFormValues: null,
    tableLabel: 'Generate Reports',
    tableDesc1: 'You can filter and export reports',
    customFilterCol: []
  }

  updateFormDataState = (objName, newDataObj) => {
    let formData = this.state.formData;
    formData[objName] = newDataObj;
    this.setState({ formData }, () => {
      console.log(this.state.formData);
    });
  }//End function
  getEspsAcBySr = (esps_sr_id) => {
    if (!esps_sr_id) { this.setState({ espsAcData: [] }); return false; }
    var dataIndex = this.state.formData.esps.findIndex(x => x.id === esps_sr_id);
    this.setState({ espsAcData: this.state.formData.esps[dataIndex].data });
  }//End if condition

  getDataNameById = (object, id, name) => {
    return object[object.findIndex(x => x.id === id)][name];
  }//End function

  collapse = () => {
    $('.report-container').toggleClass('colhide');
    if (this.state.colapseIcon === 'double-left') {
      this.setState({ colapseIcon: 'double-right' });
    } else {
      this.setState({ colapseIcon: 'double-left' });
    }//End if condition
  }//End form

  tableOverFlowToggle = () => {
    this.setState({ tableOverFlow: !this.state.tableOverFlow });
    if (this.state.tableOverFlowIcon === 'arrows-alt') {
      this.setState({ tableOverFlowIcon: 'table' });
    } else {
      this.setState({ tableOverFlowIcon: 'arrows-alt' });
    }//End if condition
  }//End form


  submitForm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //Getting Names
        values.esps_sr_name = values.esps_sr_id ? this.getDataNameById(this.state.formData.esps, values.esps_sr_id, 'server_name') : 'All';
        values.esps_sr_ac_name = values.esps_sr_ac_id ? this.getDataNameById(this.state.espsAcData, values.esps_sr_ac_id, 'account_name') : 'All';
        values.campaign_name = values.campaign_ref_id ? this.getDataNameById(this.state.formData.campaign_data, values.campaign_ref_id, 'campaign_name') : 'All';
        values.list_name = values.list_ref_id ? this.getDataNameById(this.state.formData.list_data, values.list_ref_id, 'list_name') : 'All';
        //Checking if it has single list then 
        values.single_list = this.state.disabledListField;
        values.list_ref_ids = this.state.list_ref_ids;

        //Setting Custom Filter Cols
        let customFilterCol = [
          { label: 'Email Address', value: 'email' },
          { label: 'Full Name', value: 'full_name' },
        ];
        !values.list_ref_id && customFilterCol.push({ label: 'List Name', value: 'list_name' });
        !values.esps_sr_id && customFilterCol.push({ label: 'ESPS Server', value: 'server_name' });
        !values.esps_sr_ac_id && customFilterCol.push({ label: 'ESPS Account', value: 'account_name' });
        !values.campaign_ref_id && customFilterCol.push({ label: 'Campaign Name', value: 'campaign_name' });
        !values.action && customFilterCol.push({ label: 'Action', value: 'action' });
        customFilterCol.push({ label: 'Action Date Time', value: 'action_date' });

        this.setState({ loader: true });
        Services.http('post', 'subReports/post/index.php', values).then(res => {
          //console.log(res.data);
          this.setState({ loader: false });
          if (!res) { return false; }
          var actionName = values.action ? values.action : 'All';
          this.setState({
            data: res.data,
            selectedESPSName: values.esps_sr_name,
            selectedESPSAcName: values.esps_sr_ac_name,
            selectedCampaignName: values.campaign_name,
            selectedListName: values.list_name,
            selectedActionName: actionName,
            tableLabel: `Subscribers Data from ${moment(this.props.form.getFieldValue('from_date')).format('MM-DD-YYYY')} to ${moment(this.props.form.getFieldValue('to_date')).format('MM-DD-YYYY')}`,
            tableDesc1: `ESPS Server : ${values.esps_sr_name} | ESPS Account : ${values.esps_sr_ac_name}`,
            tableDesc2: `Campaign : ${values.campaign_name} | List Name : ${values.list_name} | Action : ${actionName}`,
            holdFormValues: values,
            customFilterCol: customFilterCol
          });
        });
      }//End if condition
    });//End form properties
  }//End function

  getCampaignByESPS = (esps_sr_id, esps_sr_ac_id) => {
    if (!esps_sr_id) { this.setState({ disabledFromDate: false }); return false; }
    esps_sr_ac_id = esps_sr_ac_id ? esps_sr_ac_id : '';
    this.props.form.setFieldsValue({ campaign_ref_id: '', list_ref_id: '' });
    this.setState({ getCampaignLoader: 'validating' });
    Services.http('get', 'subReports/get/campaign_data.php?srid=' + esps_sr_id + '&srAcId=' + esps_sr_ac_id).then(res => {
      this.setState({ getCampaignLoader: false });
      if (!res) { return false; }
      this.updateFormDataState('campaign_data', res.data);
      //console.log(res.data);
    });
  }//End function

  getSubscriberListName = (campaign_id) => {
    if (!campaign_id) { this.setState({ disabledFromDate: false }); return false; }
    var dataIndex = this.state.formData.campaign_data.findIndex(x => x.id === campaign_id);
    var list_id = this.state.formData.campaign_data[dataIndex].list_ref_id;
    var sent_date = this.state.formData.campaign_data[dataIndex].sent_date;
    this.props.form.setFieldsValue({ from_date: moment(sent_date), to_date: moment() });
    this.setState({ disabledFromDate: true, disabledListField: false, list_ref_ids: '' });

    this.props.form.setFieldsValue({ list_ref_id: '' });
    this.setState({ getListLoader: 'validating' });
    Services.http('get', 'subReports/get/list_data.php?ids=' + list_id).then(res => {
      this.setState({ getListLoader: false });
      if (!res) { return false; }
      this.updateFormDataState('list_data', res.data);
      //If it has single list then select it as default with field disabled
      if (res.data.length === 1) {
        this.props.form.setFieldsValue({ list_ref_id: res.data[0].id });
        this.setState({ disabledListField: true })
      } else {
        //If it has more then one list then mearge ids to send at server (for server logic)
        let list_ref_ids = [];
        res.data.forEach(i => { list_ref_ids.push(i.id) });
        this.setState({ list_ref_ids: list_ref_ids.join(',') })
      }//End if condition
      //console.log(res.data);
    });
  }//End function

  exportReports = (exportIn) => {
    if (exportIn === 'excel') { this.setState({ loaderExcel: true }); }//End i condition
    if (exportIn === 'csv') { this.setState({ loaderCSV: true }); }//End i condition
    if (exportIn === 'pdf') { this.setState({ loaderPdf: true }); }//End i condition

    var postData = this.state.holdFormValues;
    postData.tableLabel = this.state.tableLabel;
    postData.tableDesc1 = this.state.tableDesc1;
    postData.tableDesc2 = this.state.tableDesc2;
    Services.http('post', 'subReports/post/export.php?exportIn=' + exportIn, this.state.holdFormValues).then(res => {
      this.setState({ loaderCSV: false, loaderExcel: false, loaderPdf: false });
      if (!res) { return false; }
      //console.log(res.data);
      Services.fileDownload(res.path, res.fileName);
    });
  }//End function

  render() {
    const fp = this.props.form;
    const st = this.state;
    const columns = [
      {
        title: 'Sr',
        dataIndex: 'key',
        width: '6%',
        sorter: (a, b) => a.key - b.key,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '15%',
        sorter: (a, b) => { return a.email.localeCompare(b.email) }
      },
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        width: '10%',
        sorter: (a, b) => { return a.full_name.localeCompare(b.full_name) }
      }];

    if (st.selectedListName === 'All') {
      columns.push({
        title: 'List Name',
        dataIndex: 'list_name',
        width: '12%',
        sorter: (a, b) => { return a.list_name.localeCompare(b.list_name) }
      });
    }//End if condition

    if (st.selectedCampaignName === 'All') {
      columns.push({
        title: 'Campaign Name',
        dataIndex: 'campaign_name',
        width: '12%',
        sorter: (a, b) => { return a.campaign_name.localeCompare(b.campaign_name) }
      });
    }//End if condition

    if (st.selectedESPSName === 'All') {
      columns.push({
        title: 'ESPS Server',
        dataIndex: 'server_name',
        width: '10%',
        sorter: (a, b) => { return a.server_name.localeCompare(b.server_name) }
      });
    }//End if condition

    if (st.selectedESPSAcName === 'All') {
      columns.push({
        title: 'ESPS Account',
        dataIndex: 'account_name',
        width: '12%',
        sorter: (a, b) => { return a.account_name.localeCompare(b.account_name) }
      });
    }//End if condition

    if (st.selectedActionName === 'All') {
      columns.push({
        title: 'Action',
        dataIndex: 'action',
        width: '10%',
        sorter: (a, b) => { return a.action.localeCompare(b.action) }
      });
    }//End if condition
    columns.push({
      title: 'Action Date Time',
      dataIndex: 'action_date',
      width: '13%',
      sorter: (a, b) => { return a.action_date.localeCompare(b.action_date) }
    });

    return (
      <div className="container report-container">
        <Row gutter={20} className="rowColapse">
          <Col lg={4} md={24} sm={24} xs={24} className="col1">
            <Form className="step_1" onSubmit={this.submitForm}>
              <AntInput type="select" filter={true} feedback={st.getLoader} label="ESPS Server" name="esps_sr_id" formProps={fp} style={{ marginBottom: '10px' }} options={st.formData.esps} setValueLabel={['id', 'server_name']} noRequired={true} onChange={(e) => { this.getCampaignByESPS(e, fp.getFieldValue('esps_sr_ac_id')); this.getEspsAcBySr(e) }} />
              {st.espsAcData.length > 0 &&
                <React.Fragment>
                  <AntInput type="select" filter={true} feedback={st.getLoader} label="ESPS Account" name="esps_sr_ac_id" formProps={fp} style={{ marginBottom: '10px' }} options={st.espsAcData} setValueLabel={['id', 'account_name']} noRequired={true} onChange={(e) => this.getCampaignByESPS(fp.getFieldValue('esps_sr_id'), e)} />
                  <AntInput type="select" filter={true} feedback={st.getCampaignLoader} label="Campaign" name="campaign_ref_id" formProps={fp} style={{ marginBottom: '10px' }} options={st.formData.campaign_data} setValueLabel={['id', 'campaign_name']} noRequired={true} onChange={(e) => this.getSubscriberListName(e)} />
                </React.Fragment>
              }
              {(st.espsAcData.length > 0 && fp.getFieldValue('campaign_ref_id')) &&
                <AntInput type="select" filter={true} feedback={st.getListLoader} disabled={st.disabledListField} label="List Name" name="list_ref_id" formProps={fp} style={{ marginBottom: '10px' }} options={st.formData.list_data} setValueLabel={['id', 'list_name']} noRequired={true} />
              }
              <AntInput type="datepicker" disabled={st.disabledFromDate} label="From Date" name="from_date" formProps={fp} style={{ marginBottom: '10px' }} onChange={() => fp.setFieldsValue({ to_date: moment() })} />
              <AntInput type="datepicker" disabledDate={(e) => e && e < moment(this.props.form.getFieldValue('from_date'))} label="To Date" name="to_date" formProps={fp} style={{ marginBottom: '10px' }} />
              <AntInput type="select" filter={true} feedback={st.getLoader} label="Action" name="action" formProps={fp} style={{ marginBottom: '20px' }} options={st.formData.action_data} noRequired={true} />
              <Button className="w-full" htmlType="submit" type="primary" loading={st.loader}>Generate Report</Button>
            </Form>
          </Col>
          <Col lg={20} md={24} sm={24} xs={24} className="col2 bg-side-line">

            <Tooltip placement="top" title={"Collapse Form"}>
              <Button shape="circle" icon={st.colapseIcon} onClick={() => this.collapse()} /> &nbsp;
            </Tooltip>
            <Tooltip placement="top" title={"Table Overflow"}>
              <Button shape="circle" disabled={(st.data ? false : true)} icon={st.tableOverFlowIcon} onClick={() => this.tableOverFlowToggle()} />
            </Tooltip>
            <ScreenLoader active={st.loader}>
              <DataTable
                label={st.tableLabel}
                desc={<span>{st.tableDesc1}<br />{st.tableDesc2}</span>}
                columns={columns}
                dataSource={st.data}
                overFlow={st.tableOverFlow}
                showSizeChanger={true}
                pagination={{ itemDetails: true, showOnSinglePage: true }}
                customFilter="true"
                customFilterCol={st.customFilterCol}
              />
              <div className="exportBtnGroup">
                {st.selectedCampaignName !== 'All' && <span>Export: &nbsp;</span>}
                <ButtonGroup>
                  {st.selectedCampaignName !== 'All' && <Button disabled={st.loaderExcel || st.loaderCSV} loading={st.loaderPdf} icon="file-pdf" onClick={() => this.exportReports('pdf')}>PDF</Button>}
                  <Button disabled={st.loaderPdf || st.loaderCSV} loading={st.loaderExcel} icon="file-excel" onClick={() => this.exportReports('excel')}>
                    {st.selectedCampaignName !== 'All' ? 'Excel' : 'Export in XLS'}
                  </Button>
                  <Button disabled={st.loaderPdf || st.loaderExcel} loading={st.loaderCSV} icon="file-excel" onClick={() => this.exportReports('csv')}>
                    {st.selectedCampaignName !== 'All' ? 'CSV' : 'Export in CSV'}
                  </Button>
                </ButtonGroup>
              </div>
            </ScreenLoader>
          </Col>
        </Row>
      </div>
    );//End return
  }//End render
  componentDidMount() {
    this.setState({ getLoader: 'validating' });
    Services.http('get', 'subReports/get/index.php').then(res => {
      this.setState({ getLoader: false });
      if (!res) { return false; }
      this.setState({ formData: res.data });
      //console.log(res.data);
    });
  }//End componentDidMount
}//End class

export default Form.create()(SubReports);