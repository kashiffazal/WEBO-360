/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { withRouter } from "react-router";


class Header extends Component {
    render() {
        const data = this.props.data;
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item href="#" onClick={() => this.props.history.push('/app/overview')}>
                        <Icon type="home" />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/campaign')}>
                        Campaign
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {data[1]}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br />
            </div>
        );
    }
}

export default withRouter(Header);