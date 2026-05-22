import React, { Component } from 'react';
import { AntInput } from '../../../externalComponents/antd-fields';

class SendGridForm extends Component {
  render() {
    const fp = this.props.formProps
    return (
      <div>
        <div className="m-b-10"><AntInput name="api_key" label="API Key" type="password" formProps={fp} placeholder="e.g. KA.d_fkadkfg45akdGHaf.lksadhfSADFGSnsa..." /></div>
        <div className="m-b-10"><AntInput name="description" label="Description" formProps={fp} placeholder="Add some description" noRequired={true} /></div>
        <div className="m-b-10"><AntInput name="link_domain_path" label="Link URL (Product Link Domain Name)" formProps={fp} placeholder="e.g. www.createwebo1.com" noRequired={true} /></div>
      </div>
    );//End return
  }//End render
}//End class

export default SendGridForm;