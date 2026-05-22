import React, { Component } from 'react';
import { Modal, Button, Checkbox } from 'antd';

import './style.css';

class AgreementDialog extends Component {

  state = {
    modalVisible: false
  }

  addLinkToModal = (str) => {

    var openTag = "<link>";
    var closeTag = "</link>";

    var firstContent = str.split(openTag);
    var secondContent = firstContent[1].split(closeTag);

    var partial1 = firstContent[0];
    var partial2 = secondContent[1];
    var btnText = secondContent[0];

    return <span>{partial1}<button className="btnToAnchor" onClick={() => this.setState({ modalVisible: true })}>{btnText}</button>{partial2}</span>;
  }//End function


  render() {
    const st = this.state;
    const pr = this.props;
    return (
      <div className={"c_c_agreementModal dis-flex flex-t " + pr.className}>

        <Checkbox onChange={(e) => pr.disabledBtn(!e.target.checked)}></Checkbox>
        <span id="lineContent" className="dis-inline-block m-l-10 m-t-2">
          {pr.lineContent ? this.addLinkToModal(pr.lineContent) : 'I agree to terms and conditions.'}
        </span>

        <Modal
          maskClosable={false}
          visible={st.modalVisible}
          width={800}
          centered
          title={pr.title || "Agreement"}
          //className="hide-modal-footer"
          onCancel={() => this.setState({ modalVisible: false })}
          footer={[<Button key="back" onClick={() => this.setState({ modalVisible: false })}>Close</Button>]}
        >
          <div className="modal_container">
            {pr.HTMLcontent ||
              <span>
                <h1>Content of the Agreement</h1>
                <p>The WTO Trade Facilitation Agreement (TFA) consists of a Preamble and 24 Articles. It is structured into three parts: Section I, Section II, and Section III. One Annex is attached to the Agreement.</p>

                <h3>Substantive Obligations</h3>
                <p>The core of the Agreement is a package of substantial trade facilitation measures WTO Members are required to put in place. These trade facilitation rules are regrouped in Section I of the WTO TFA and consist of 12 Articles covering the following areas:</p>
                <ul>
                  <li>The Relationship between government authorities and traders and other interested parties;</li>
                  <li>Customs clearance procedures;</li>
                  <li>Non-Customs control measures;</li>
                  <li>Administrative simplification;</li>
                  <li>Use of information technology for processing and data exchange;</li>
                  <li>Agency cooperation and cross-border cooperation;</li>
                  <li>Transit traffic; and</li>
                  <li>Customs cooperation.</li>
                </ul>

                <p>
                  For an overview of the Articles and a mapping of existing trade facilitation instruments consult the WTO map.<br />
                  For a summary presentation of these substantive obligations from a business perspective, read ITC, WTO Trade <br />
                  Facilitation Agreement: A Business Guide for developing countries, 2013.
                </p>

                <h3>Special and Differential Treatment Provisions</h3>
                <p>A second major element of the Agreement is the special and differential treatment provisions of Section II from Article 13 to 22. These provisions provide implementation flexibilities for developing countries (DC) and least-developed countries (LDC). DC and LDC members may lack the capacities to comply with the Agreement at its entry into force and will have to build this capacity over time and with external assistance. Under these provisions DCs and LDCs are given more time to comply with all provisions, and a linkage between compliance and technical assistance and capacity building is established. This is the first time that a WTO Agreement contains such a linkage. The rational for this linkage is that there need to be more effective provisions of S&DT that not only shelter developing countries from obligations but assist them in building the capacities necessary to comply with the Agreement implementation.</p>

                <h3>Institutional Arrangements</h3>
                <p>Furthermore, a Committee on Trade Facilitation is established to meet at least once per year. These Committees exist also under other WTO Agreements and have a major role for the implementation of the Agreement. In addition to the Committee at the WTO level, each member is requested to establish a national committee “to facilitate both domestic coordination and implementation of provisions of this Agreement”.</p>
                <p>The final provisions of Article 24 outline terms regarding the entry into force for Members , accession of new Members(1*) and new parties(2*), the relationship with other WTO Agreements, namely GATT 1994, TBT and SPS Agreements, the application of the DSU, and exceptions and exemptions.</p>
                <hr />
                <p>(1*) As the WTO TFA enters into force conform to Article X :3 of Agreement Establishing the WTO (WTO Agreement), Members are those Members ratified the Protocol of Amendment and therewith accepted the amendment to the Annex 1 of the WTO Agreement.</p>
                <p>(2*) This applies to all Members that accept the WTO TFA—by way of ratifying the Protocol of Amendment—after the entry into force of the Agreement.</p>
              </span>
            }
          </div>
        </Modal>
      </div>/*End class c_c_agreementModal */
    );//End render
  }//End class


  componentDidMount() {
    //this.addLinkToModal(this.props.lineContent);
  }//End 

}


export default AgreementDialog;