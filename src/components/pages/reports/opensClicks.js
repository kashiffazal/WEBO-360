import React, { Component } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import OpensClicksHeader from './opensClicks_partials/1_header';
import Services from '../../services';
import SideNavigation from '../../mutual/sideNavigation';
import LineChart from './index_partials/2_lineChart';

class OpensClicks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campaignInitialValues: {},
            data: null,
            loader: false,
        }//End state
    }//End constructor


    getData = () => {
        this.setState({ loader: true });
        let state_id = this.state.campaignInitialValues[0];
        //alert(state_id);
        Services.http('get', 'reporting/chart/index.php?id=' + state_id + '&type=2').then(res => {
            this.setState({ loader: false });
            this.setState({ data: res });
        });
    }//End function


    render() {
        const campaignData = this.state.campaignInitialValues;
        return (
            <div className="container">
                <Row gutter={40}>
                    <Col lg={19} md={18} sm={24} xs={24} className="reportContainer">
                        <OpensClicksHeader data={campaignData} />
                        <h3 className="pageTitle m-0">Opens & Clicks Over Time</h3>
                        <p className="m-0 fs-12"><span className="fs-14">{campaignData[1]}</span> - Sent on {campaignData[2].split(',')[0]} at {campaignData[2].split(',')[1]}</p>
                        <hr className="hr-dashed" />
                        <Spin spinning={this.state.loader} tip="Loading, Please wait...">
                            {this.state.loader ?
                                <div style={{ 'height': '160px' }}>
                                    <br /><br /><br /><br />
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
                                    <br /><br />
                                </div>
                                :
                                <span>
                                    <br />
                                    {this.state.data &&
                                        <LineChart data={this.state.data} hideLink={true} />
                                    }
                                </span>
                            }
                        </Spin>
                    </Col>
                    <Col lg={5} md={6} sm={24} xs={24}>
                        <SideNavigation title="You might also want to..." btn="cc" links="ac,ms,smtp,um" />
                    </Col>
                </Row>
            </div>
        );//Ene return
    }//End render
    componentWillMount() {
        let campaignInitialValues = Services.loadArrLocalStorage(this.props.match.params.campaignData);
        this.setState({ campaignInitialValues }, () => { this.getData(); });
        // let sessionValue = localStorage.getItem(this.props.match.params.campaignData);
        // if (!sessionValue) { alert("Incorrect URL"); this.props.history.goBack(); return; }//End function
        // let campaignInitialValues = Services.decode64(sessionValue).split('=>');
        // this.setState({ campaignInitialValues }, () => {this.getData();});
    }//End componentDidMount
}//End class

export default OpensClicks;