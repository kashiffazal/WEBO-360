import React, { Component } from 'react';
import { Row, Col, Button, Spin } from 'antd';

class Sender extends Component {
    render() {
        const cd = this.props.data;
        const edit = this.props.disabledEdit;
        return (
            <div>
                <div className="snapshot_title snp_flex_between">
                    <h3>Campaign and sender</h3>
                    {!edit && <Button disabled={this.props.loader} onClick={() => this.props.edit('step1')} icon="edit">Edit</Button>}
                </div>
                <Spin spinning={this.props.loader} tip="Loading, Please wait...">
                    <div className="campaignDetailPreview">
                        <Row>
                            <Col lg={6} md={6} sm={8} xs={24}><b>Campaign Name</b></Col>
                            <Col lg={18} md={18} sm={16} xs={24}>{cd.campaign_name}</Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={8} xs={24}><b>Subject</b></Col>
                            <Col lg={18} md={18} sm={16} xs={24}>{cd.subject_line}</Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={8} xs={24}><b>From</b></Col>
                            <Col lg={18} md={18} sm={16} xs={24}>{cd.fromName} &#60;{cd.fromEmail}&#62;</Col>
                        </Row>
                        {(cd.replayToName && cd.replayToEmail) && 
                            <Row>
                                <Col lg={6} md={6} sm={8} xs={24}><b>Reply To</b></Col>
                                <Col lg={18} md={18} sm={16} xs={24}>{cd.replayToName} &#60;{cd.replayToEmail}&#62;</Col>
                            </Row>
                        }
                        {(!cd.replayToName && cd.replayToEmail) && 
                            <Row>
                                <Col lg={6} md={6} sm={8} xs={24}><b>Reply-To address</b></Col>
                                <Col lg={18} md={18} sm={16} xs={24}>{cd.replayToEmail}</Col>
                            </Row>
                        }
                    </div>
                </Spin>             
            </div>
        );
    }
}

export default Sender;