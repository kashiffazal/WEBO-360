import React, { Component } from 'react';
import { Row, Col, Progress } from 'antd';

class ProgressBox extends Component {
  render() {
    return (
      <div className="progressBarContainer">
        <Row className="m-b-5 content">
          <Col lg={14} md={14} sm={24} xs={24}>Sending to <b><br />{window.progressData.sendingEmailToShow}</b>,<br /> Please wait... </Col>
          <Col lg={10} md={10} sm={24} xs={24} className="text-right">{window.progressData.timer === 'Completed' ? window.progressData.timer : <span><b>Estimated Time </b> {window.progressData.timer}</span>}</Col>
        </Row>
        <div className="m-b-10"><Progress status={window.progressData.progressStatus} percent={Math.round(window.progressData.percent)} /></div>
        <p className="fs-14"><b>Note:</b> This progress bar is getting estimated time not actual.</p>
      </div>
    );
  }
}

export default ProgressBox;