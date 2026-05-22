import React, { Component } from 'react';
import { Row, Col, Spin } from 'antd';

class ScheduleDate extends Component {
    render() {
        const cd = this.props.data;
        //console.log(cd);
        return (
            <div>
                <br /><br />
                <div className="snapshot_title snp_flex_between">
                    <h3>Schedule At</h3>
                </div>
                <div className="campaignDetailPreview">
                    <Spin spinning={this.props.loader} tip="Loading, Please wait...">
                        <Row>
                            <Col lg={6} md={6} sm={8} xs={24}><b>Date & Time</b></Col>
                            <Col lg={18} md={18} sm={16} xs={24}>{cd}</Col>
                        </Row>
                    </Spin>
                </div>
                <br /><br />
            </div>
        );
    }
}

export default ScheduleDate;