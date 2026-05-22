import React, { Component } from 'react';
import { Row, Col } from 'antd';

class ClickDetails extends Component {
    render() {
        const data = this.props.data;
        return (
            <div className="popularLinks">
            <div className="dataHighlight">
                <Row>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <div className="countContainer">
                            <table cellPadding="0" cellSpacing="0" width="100%">
                                <tbody>
                                    <tr style={{'borderBottom': '1px solid #ebebc7'}}>
                                        <td nowrap="" className="p-b-10"><div className="peopleClicked">{data.person_clicked}</div></td>
                                        <td className="goalDescription p-b-10"><h2>person clicked</h2>Giving you a <strong>{data.clicked_rate}%</strong> click rate.</td>
                                    </tr>
                                    <tr className="mb_down">
                                        <td nowrap="" className="p-t-10"><div className="peopleClicked secondary">{data.avarage_clicks_per_person}</div></td>
                                        <td className="goalDescription p-t-10"><h2>clicks per person</h2>Average of all those who clicked.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <div className="countContainer">
                            <table cellPadding="0" cellSpacing="0" width="100%">
                                <tbody>
                                    <tr className="mb_up" style={{'borderBottom': '1px solid #ebebc7'}}>
                                        <td nowrap="" className="p-b-10"><div className="peopleClicked">{data.total_clicks}</div></td>
                                        <td className="goalDescription p-b-10"><h2>total clicks</h2>Made by {data.clicks_made_by_total_person} person</td>
                                    </tr>
                                    <tr>
                                        <td nowrap="" className="p-t-10"><div className="peopleClicked secondary">{data.not_clicked}</div></td>
                                        <td className="goalDescription p-t-10"><h2>didn't click</h2>That's {data.not_clicked_persent}% of all those who opened.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
        );
    }
}

export default ClickDetails;