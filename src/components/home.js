import React, { Component } from "react";
import Loadable from 'react-loadable';
import { HashRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from 'react-router-scroll-top'

import { connect } from 'react-redux';
import mapStateToProps from '../store/mapStateToProps';
import mapDispatchToState from '../store/action';

//Services Import
import Services from './services';

//Importing Components
import SecondaryHeader from './mutual/header/secondaryHeader';
import PrimaryHeader from './mutual/header/primaryHeader';
import ScreenLoader from './externalComponents/screen-loader';
import Footer from './mutual/footer/footer';
import SessionExpiredLoginScreen from './externalComponents/antd-session-expired-login-screen';


//Importing with loader
function Loading({ error }) {
  if (error) { console.log(error); return 'Oh nooess!'; } else { return <ScreenLoader active={true}/>; }
}//End function
const Overview = Loadable({ loader: () => import('./pages/overview'), loading: Loading });

const CampaignLog = Loadable({ loader: () => import('./pages/campaigns/log'), loading: Loading });

//Campaign Imports
const CreateCampaignStep1 = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_1'), loading: Loading });
const CreateCampaignStep2 = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_2'), loading: Loading });
const Template = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_2/1_template'), loading: Loading });
const CreateTemplate = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_2/2_editor'), loading: Loading });
const EditHTML = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_2/3_editHtml'), loading: Loading });
const PlainText = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_2/4_plaintext'), loading: Loading });
const CreateCampaignStep3 = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_3'), loading: Loading });
const Snapshot = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_3/snapshot'), loading: Loading });
const SendTest = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_3/sendTest'), loading: Loading });
const CreateCampaignStep4 = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_4'), loading: Loading });
const SendQueued = Loadable({ loader: () => import('./pages/campaigns/create/form_steps/step_4/send_queued'), loading: Loading });

//Reports Imports
const CampaignReports = Loadable({ loader: () => import('./pages/reports/'), loading: Loading });
const LinkActivity = Loadable({ loader: () => import('./pages/reports/linkActivity'), loading: Loading });
const OpensClicks = Loadable({ loader: () => import('./pages/reports/opensClicks'), loading: Loading });

//Other pages imports
const Subscribers = Loadable({ loader: () => import('./pages/subscribers'), loading: Loading });
const CreateList = Loadable({ loader: () => import('./pages/subscribers/createList'), loading: Loading });
const List = Loadable({ loader: () => import('./pages/subscribers/list'), loading: Loading });
const SubscriberDetails = Loadable({ loader: () => import('./pages/subscribers/details'), loading: Loading });
const AddSubscribers = Loadable({ loader: () => import('./pages/subscribers/addSubscribers/'), loading: Loading });
const Automation = Loadable({ loader: () => import('./pages/automation/automation'), loading: Loading });
const SMTP_setting = Loadable({ loader: () => import('./pages/smtp/'), loading: Loading });
const ESPSMailingAccount = Loadable({ loader: () => import('./pages/esps_mailing_account/'), loading: Loading });
const AccountSettings = Loadable({ loader: () => import('./pages/accountSettings'), loading: Loading });
//User Management page imports
const UsersManagement = Loadable({ loader: () => import('./pages/usersManagement/createUser'), loading: Loading });
const UsersRole = Loadable({ loader: () => import('./pages/usersManagement/usersRole'), loading: Loading });
const UsersList = Loadable({ loader: () => import('./pages/usersManagement/usersList'), loading: Loading });

const SubReports = Loadable({ loader: () => import('./pages/subReports'), loading: Loading });

const _404 = Loadable({ loader: () => import('./pages/404/404'), loading: Loading });


class MainApp extends Component {

  componentDidMount() {
    if (!localStorage.getItem(window.appLocalStorage)) {
      this.props.history.push(process.env.PUBLIC_URL + '/login');
    } else {
      this.props.changeStateToReducer('ud', Services.getUserData());
      //console.log(Services.getUserData());
    }//End if condition
    this.interval = setInterval(() => {
      if (!localStorage.getItem(window.appLocalStorage)) {
        clearInterval(this.interval);
        this.props.history.push(process.env.PUBLIC_URL + '/login');
      }//End if condition
      if (window.sessionExpire === true) {
        this.props.changeStateToReducer('showLoginScreen', true);
      } else {
        this.props.changeStateToReducer('showLoginScreen', false);
      }//End if condition
    }, 1000);
  }//End componentDidMount

  render() {
    return (

      <div>
        <SessionExpiredLoginScreen show={this.props.store_values.showLoginScreen} />
        <HashRouter>
          <div>
            <header>
              <SecondaryHeader />
              <PrimaryHeader />
            </header>
            <div className="ant-container wave-bg">
              <ScrollToTop>
                <Switch>
                  <Route exact path={`${process.env.PUBLIC_URL}/`} component={CampaignLog} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/overview`} component={Overview} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/automation`} component={Automation} />

                  {Services.accessControl(16) && <Route exact path={`${process.env.PUBLIC_URL}/app/campaign`} component={CampaignLog} />}
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step1`} component={CreateCampaignStep1} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step2`} component={CreateCampaignStep2} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step2/template`} component={Template} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step2/editor`} component={CreateTemplate} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step2/edithtml`} component={EditHTML} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step2/plaintext`} component={PlainText} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step3`} component={CreateCampaignStep3} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step3/snapshot`} component={Snapshot} />
                  {Services.accessControl(25) && <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step3/sendTest`} component={SendTest} />}
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step4`} component={CreateCampaignStep4} />
                  <Route exact path={`${process.env.PUBLIC_URL}/app/createCampaign/step4/send/:data`} component={SendQueued} />


                  <Route path={`${process.env.PUBLIC_URL}/app/campaigns/reports/charts/:campaignData`} component={CampaignReports} />
                  <Route path={`${process.env.PUBLIC_URL}/app/campaigns/reports/LinkActivity/:campaignData`} component={LinkActivity} />
                  <Route path={`${process.env.PUBLIC_URL}/app/campaigns/reports/OpensClicks/:campaignData`} component={OpensClicks} />



                  {Services.accessControl(12) && <Route exact path={`${process.env.PUBLIC_URL}/app/subscribers`} component={Subscribers}></Route>}
                  {Services.accessControl(13) && <Route exact path={`${process.env.PUBLIC_URL}/app/subscribers/createList`} component={CreateList}></Route>}
                  {Services.accessControl(15) && <Route exact path={`${process.env.PUBLIC_URL}/app/subscribers/list/:list_id`} component={List}></Route>}
                  {Services.accessControl(16) && <Route exact path={`${process.env.PUBLIC_URL}/app/subscribers/list/details/:subscriberData`} component={SubscriberDetails}></Route>}
                  {Services.accessControl(17) && <Route exact path={`${process.env.PUBLIC_URL}/app/subscribers/list/addSubscribers/:listData`} component={AddSubscribers}></Route>}


                  {Services.accessControl(1) && <Route ubac_id={1} path={`${process.env.PUBLIC_URL}/app/smtpSettings`} component={SMTP_setting}></Route>}
                  {Services.accessControl(1) && <Route ubac_id={1} path={`${process.env.PUBLIC_URL}/app/DeliveryServers`} component={ESPSMailingAccount}></Route>}


                  {Services.accessControl(26) && <Route path={`${process.env.PUBLIC_URL}/app/accountSettings`} component={AccountSettings}></Route>}

                  {/** User Management */}
                  {Services.accessControl(6) && <Route exact path={`${process.env.PUBLIC_URL}/app/createUser`} component={UsersManagement}></Route>}
                  {Services.accessControl(7) && <Route path={`${process.env.PUBLIC_URL}/app/usersList`} component={UsersList}></Route>}
                  {Services.accessControl(8) && <Route exact path={`${process.env.PUBLIC_URL}/app/createUser/:id`} component={UsersManagement}></Route>}
                  {Services.accessControl(9) && <Route path={`${process.env.PUBLIC_URL}/app/usersRole`} component={UsersRole}></Route>}

                  {Services.accessControl(32) && <Route path={`${process.env.PUBLIC_URL}/app/reports`} component={SubReports}></Route>}


                  <Route path={`${process.env.PUBLIC_URL}/app/*`} component={_404}></Route>
                </Switch>
              </ScrollToTop>
              <div className="wave-bg-bottom"></div>
            </div>
            <Footer />
          </div>
        </HashRouter>

      </div>

    )//End render
  }//End Render
}//End class

export default connect(mapStateToProps, mapDispatchToState)(MainApp);
