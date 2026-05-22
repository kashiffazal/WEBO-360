/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { withRouter } from "react-router";

class LinkHeader extends Component {
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
                    <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/campaigns/reports/charts/'+this.props.match.params.campaignData)}>
                        {campaignData[1]}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Link Activity & Overlay
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br />
            </div>
        );
    }
}

export default withRouter(LinkHeader);