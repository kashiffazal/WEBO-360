import React, { Component } from 'react';
import { Row, Col, Spin } from 'antd';
import CampaignServices from '../../../../campaign_services';

class Preview extends Component {
    render() {
        const cd = this.props.data;
        const edit = this.props.disabledEdit;
        const campaign_id = CampaignServices.localStorageDecode().cid;
        return (
            <div>
                <div className="snapshot_title">
                    <h3>Preview with fallback content</h3>
                    <p>See your campaign with fallback content.</p>
                </div>
                <div className="campaignDetailPreview">
                    <Spin spinning={this.props.loader} tip="Loading, Please wait...">
                        <Row>
                            <Col lg={6} md={6} sm={8} xs={24}><b>HTML Version</b></Col>
                            <Col lg={18} md={18} sm={16} xs={24}>
                                <a onClick={() => CampaignServices.openPreview(campaign_id)}>View a preview</a>
                                {!edit && 
                                    <React.Fragment>
                                        , &nbsp;
                                        <a onClick={() => this.props.edit('step2')}>Change template</a> or &nbsp;
                                        <a onClick={() => {
                                            localStorage.setItem('hted',true);
                                            this.props.edit('step2/editor')
                                        }}>Edit current template</a>
                                    </React.Fragment>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={8} xs={24}><b>Plain Text Version</b></Col>
                            <Col lg={18} md={18} sm={16} xs={24}>
                                {cd.plaintext ? 
                                    <span>
                                        <a onClick={() => CampaignServices.openPreview(campaign_id)}>Preview</a>
                                        {!edit &&  <React.Fragment> or <a onClick={() => this.props.edit('step2/plaintext')}>Edit</a></React.Fragment>}
                                    </span>    
                                :
                                    <a onClick={() => this.props.edit('step2/plaintext')}><b className="fs-16">Add plain text</b></a>
                                }

                            </Col>
                        </Row>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default Preview;