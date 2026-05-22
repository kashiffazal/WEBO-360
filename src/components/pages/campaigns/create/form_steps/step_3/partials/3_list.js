import React, { Component } from 'react';
import SubscriberList from './0_subscriberList';
import { Button, Spin } from 'antd';

class SList extends Component {
    render() {
        const cd = this.props.data;
        const edit = this.props.disabledEdit;
        return (
            <div>
                <div className="snapshot_title snp_flex_between">
                    <h3>Recipients</h3>
                    {!edit && <Button disabled={this.props.loader} onClick={() => this.props.edit('step3')} icon="edit">Edit</Button>}
                </div>
                {cd.listData && 
                    <div className="campaignDetailPreview">
                        <Spin spinning={this.props.loader} tip="Loading, Please wait...">
                            <SubscriberList 
                                data={cd.listData.data}
                                //onChange={(item) => this.onCheckboxChange(item)}
                                details={{
                                    total : cd.listData.totalEmails,
                                    unique : cd.listData.totalUniqueEmails
                                }}
                                preview={true}
                            />
                        </Spin>
                    </div>
                }
            </div>
        );
    }
}

export default SList;