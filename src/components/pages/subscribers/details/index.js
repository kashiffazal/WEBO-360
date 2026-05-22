/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import Services from '../../../services';
import SubscriberPersonalDetails from './subscriberPersonalDetails';
import SubscriberCampaignDetails from './subscriberCampaignDetails';
import BreadcrumbList from '../partials/breadcrumb';

class SubscriberDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subscriberData: null,
            serverData: {
                personal_data: null
            },
            loader: false,
        }//End state
    }//End constructor
    componentWillMount() {
        let subscriberValues = Services.loadArrLocalStorage(this.props.match.params.subscriberData)
        if (!subscriberValues) { window.history.go(-2); return false; }
        this.setState({ subscriberData: subscriberValues });
        Services.http('get', 'subscribers/get/subscriber_details/index.php?id=' + subscriberValues[0]).then(res => {
            if (!res) { return false; }
            this.setState({ serverData: res });
        });
    }//End componentWillMount


    update_personal_data = (data) => {
        this.setState({ serverData: { ...this.state.serverData, personal_data: data } });
    }//End function


    render() {
        const st_db = this.state.serverData;
        return (
            <div>
                {st_db.personal_data ?
                    <React.Fragment>
                        <BreadcrumbList currentPage={`Snapshot of ${this.state.subscriberData[1]}`} listId={this.state.subscriberData[2]} listName={this.state.subscriberData[3]} />
                        <br />
                        <Row>
                            <Col lg={7} md={9} sm={24} xs={24}>
                                <SubscriberPersonalDetails data={st_db.personal_data} statusData={st_db.statusData} update_personal_data={(data) => this.update_personal_data(data)} />
                            </Col>
                            <Col lg={17} md={15} sm={24} xs={24}>
                                <SubscriberCampaignDetails data={st_db.activity_data} percentage={st_db.percentageData} />
                            </Col>
                        </Row>
                    </React.Fragment>
                    :
                    <Spin spinning={true}>
                        <div className="h-300 flex-c-m"><Empty description="Loading, Please wait..." /></div>
                    </Spin>
                }
            </div>
        );
    }
}

export default SubscriberDetails;