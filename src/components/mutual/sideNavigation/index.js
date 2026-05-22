import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'
import { Button } from 'antd';
import CampaignServices from '../../pages/campaigns/campaign_services';
import AccessControl from '../../externalComponents/user-base-access-control';
import RecentSubscribersListName from './partials/recentSubscribersListName';
import './styles.css';
import Services from '../../services';

class SideNavigation extends Component {
  state = {
    linksArr: [],
    btnLink: false,
    title: false
  }

  createCampaign = () => {
    CampaignServices.localStorageEncode({});
    this.props.history.push('/app/createCampaign/step1');
  }//End function

  linkListFunc = () => {
    const lk = this.state.linksArr;

    let listArr = {
      recentSubscribersList: <RecentSubscribersListName />,
      ac: <React.Fragment>
        <span>
          <Link to="/app/accountSettings">Edit Account Profile</Link>
          <span>Account settings, customize test and confirmation email templates, etc.</span>
        </span>
      </React.Fragment>,
      ms: <AccessControl>
        <span ubac_id={12}>
          <Link to="/app/subscribers">Manage your subscribers</Link>
          <span>Add subscribers, change settings, etc.</span>
        </span>
      </AccessControl>,
      smtp: <AccessControl>
        <span ubac_id={1}>
          <Link to="/app/DeliveryServers">Manage Delivery Servers</Link>
          <span>Add New Delivery Servers, edit or change settings, etc.</span>
        </span>
      </AccessControl>,
      um: <AccessControl>
        <span ubac_id={7}>
          <Link to="/app/usersList">User Management</Link>
          <span>Add new users, edit or change settings, etc.</span>
        </span>
      </AccessControl>,
      cc: <AccessControl>
        <span ubac_id={17}>
          <button className="btnToAnchor" onClick={() => this.createCampaign()}>New Campaign</button>
          <span>Create new campaign and sent.</span>
        </span>
      </AccessControl>,
      cl: <AccessControl>
        <span ubac_id={16}>
          <Link to="/app/campaign">Campaign History</Link>
          <span>View sent and drafted campaign logs.</span>
        </span>
      </AccessControl>,
      /** User Management*/
      umcu: <AccessControl>
        <span ubac_id={6}>
          <Link to="/app/createUser">Create User</Link>
          <span>Create new user with user role.</span>
        </span>
      </AccessControl>,
      umul: <AccessControl>
        <span ubac_id={7}>
          <Link to="/app/usersList">Users Log</Link>
          <span>List users, edit or delete, etc</span>
        </span>
      </AccessControl>,
      umcr: <AccessControl>
        <span ubac_id={9}>
          <Link to="/app/usersRole">Users Role</Link>
          <span>Define new roles with permissions.</span>
        </span>
      </AccessControl>
    }//End links obj
    let res = [];
    for (var i = 0; i < lk.length; i++) { if (listArr[lk[i]]) { res.push(listArr[lk[i]]); } }//End for loop
    return res;
  }//End function

  render() {
    const bt = this.state.btnLink;
    const ti = this.state.title;
    return (
      <div className="side_nav">
        {Services.accessControl(17) && (bt === 'cc' && <Button onClick={() => this.createCampaign()} type="primary" size="large">Create a new campaign</Button>)}
        {Services.accessControl(12) && (bt === 'ms' && <Button onClick={() => this.props.history.push('/app/subscribers')} type="primary" size="large">Manage Subscribers</Button>)}
        {Services.accessControl(13) && (bt === 'cl' && <Button onClick={() => this.props.history.push('/app/subscribers/createList')} type="primary" size="large">Create a new list</Button>)}
        {Services.accessControl(6) && (bt === 'umcu' && <Button onClick={() => this.props.history.push('/app/createUser')} type="primary" size="large">Create New User</Button>)}
        {ti && <p>{ti}</p>}
        {this.linkListFunc().map((item, i) => { return (<React.Fragment key={i}>{item}</React.Fragment>) })}
      </div>
    );//End return
  }//End render
  componentDidMount() {
    this.setState({
      linksArr: (this.props.links ? this.props.links.split(',') : ''),
      btnLink: this.props.btn,
      title: this.props.title,
    });
  }//End componentDidMount
}//End class

export default withRouter(SideNavigation);