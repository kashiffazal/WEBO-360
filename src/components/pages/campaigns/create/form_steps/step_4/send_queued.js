import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import Services from '../../../../../services';
import '../../../styles.css';

class SendQueued extends Component {

  state = {
    status: 0,
    data: null,
    summary_data: {}
  }//End state


  redirectToReport = (rowData) => {
    //console.log(rowData);
    // Services.saveArrLocalStorage(
    //   [rowData.id, rowData.campaign_name, rowData.sent_date, (parseInt(rowData.recipientsCount, 0) + parseInt(rowData.bounceCount, 0))],
    //   "/app/campaigns/reports/charts"
    // );
    this.props.history.push('/app/overview')
  }//End function

  render() {
    const st = this.state;
    return (
      <div className="c_c_container bg-white-imp">
        <Row gutter={20}>
          <Col lg={5} md={3} sm={24} xs={24}></Col>
          <Col lg={14} md={18} sm={24} xs={24}>
            <h1 className="m-0 m-t-30">
              <i className="fa fa-paper-plane-o"></i> Queued for immediate delivery
            </h1>
            <p className="m-0 p-t-10 p-b-10">A confirmation email will be sent to {st.summary_data.confirmationEmail} when the campaign has been successfully delivered.</p>

            {st.summary_data.toBeDelivered !== 'now' ?
              <Button className="m-t-10 m-b-20" type="primary" size="large" onClick={() => this.props.history.push('/app/overview')}>Go to dashboard</Button> :
              <div className="m-t-10 m-b-20 dis-flex flex-m">
                {
                  this.state.status === '0' ?
                    <span><Icon type="sync" className="fs-22" spin /> &nbsp;&nbsp; Sending campaign...</span> :
                    <Button type="primary" size="large" onClick={() => this.redirectToReport(st.summary_data.report_date)}>{/*See campaign report*/} Go to dashboard</Button>
                }
              </div>
            }{/* End 'now condition' */}

            <div className="summary_container">
              <Row>
                <Col lg={8} md={8} sm={12} xs={24}><strong className="fs-16">Summary</strong></Col>
                <Col lg={16} md={16} sm={12} xs={24}></Col>
              </Row>
              <hr />
              <Row>
                <Col lg={8} md={8} sm={12} xs={24} className="fw-500">Campaign name</Col>
                <Col lg={16} md={16} sm={12} xs={24}>{st.summary_data.campaign_name}</Col>
              </Row>
              <hr />
              <Row>
                <Col lg={8} md={8} sm={12} xs={24} className="fw-500">Recipients</Col>
                <Col lg={16} md={16} sm={12} xs={24}>{st.summary_data.recipients}</Col>
              </Row>
              <hr />
              <Row>
                <Col lg={8} md={8} sm={12} xs={24} className="fw-500">To be delivered</Col>
                <Col lg={16} md={16} sm={12} xs={24}>
                  {st.summary_data.toBeDelivered === 'now' ? 'Immediate' : 'Schedule'}
                </Col>
              </Row>
              {st.summary_data.toBeDelivered !== 'now' &&
                <React.Fragment>
                  <hr />
                  <Row>
                    <Col lg={8} md={8} sm={12} xs={24} className="fw-500">Schedule date time</Col>
                    <Col lg={16} md={16} sm={12} xs={24}>{st.summary_data.schedule_date}</Col>
                  </Row>
                </React.Fragment>
              }
            </div>
          </Col>
          <Col lg={5} md={3} sm={24} xs={24}></Col>
        </Row>
      </div>
    );//End return
  }//End render

  componentDidMount() {
    this.setState({
      status: this.props.match.params.status,
      data: this.props.match.params.data
    }, () => {
      let transferData = Services.loadArrLocalStorage(this.props.match.params.data);
      this.setState({ summary_data: transferData });
      //console.log(transferData);
    });


  }//End componentDidMount

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.status !== this.props.match.params.status) {
      this.setState({ status: this.props.match.params.status });
    }//end if condition
  }//End componentDidUpdate

}//End class

export default SendQueued;
