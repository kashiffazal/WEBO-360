/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Breadcrumb, Icon } from 'antd';

class OpensClicksHeader extends Component {
    render() {
        const campaignData = this.props.data;
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => this.props.history.push('/app/overview')}>
                        <Icon type="home" />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/campaign')}>
                        Campaign
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/campaigns/reports/charts/' + this.props.match.params.campaignData)}>
                        {campaignData[1]}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Opens & Clicks Over Time
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br />
            </div>
        );
    }
}

export default withRouter(OpensClicksHeader);