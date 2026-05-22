import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

//Importing Components
import Login from './login-registration';
import ConfirmEmail from './login-registration/confirm-email';
import ThankYou from './login-registration/thank-you';
import UnverifiedEmail from './login-registration/unverified-email';
import MainApp from './home';
import _404 from './404';
import Error from './error';

//Firestore implementation
import { connect } from 'react-redux';
import mapStateToProps from '../store/mapStateToProps';
import mapDispatchToState from '../store/action';
// import FirestoreCompany from './firestore_company';
import DevelopedBy from './developedBy';

class App extends Component {
  render() {
    const block = this.props.store_values.application_data.blockStatus;
    const blockHTML = this.props.store_values.application_data.blockHTML;
    const maintenance = this.props.store_values.application_data.maintenanceStatus;
    const maintenanceHTML = this.props.store_values.application_data.maintenanceHTML;
    const developedByRouteName = this.props.store_values.developedByRouteName;
    return (
      <HashRouter>
        <span>
          {block ?
            <div dangerouslySetInnerHTML={{ __html: blockHTML }} /> :
            (maintenance ?
              <div dangerouslySetInnerHTML={{ __html: maintenanceHTML }} /> :
              <Switch>
                <Route exact path={`${process.env.PUBLIC_URL}/`} component={MainApp}></Route>
                <Route exact path={`${process.env.PUBLIC_URL}/${developedByRouteName}`} component={DevelopedBy}></Route>
                <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login}></Route>
                <Route exact path={`${process.env.PUBLIC_URL}/confirmEmail/:data`} component={ConfirmEmail}></Route>
                <Route exact path={`${process.env.PUBLIC_URL}/thankYou/:localStorageName`} component={ThankYou}></Route>
                <Route exact path={`${process.env.PUBLIC_URL}/unverified/:data`} component={UnverifiedEmail}></Route>
                <Route exact path={`${process.env.PUBLIC_URL}/error`} component={Error}></Route>
                <Route path={`${process.env.PUBLIC_URL}/app/:path`} component={MainApp}></Route>
                <Route path={`${process.env.PUBLIC_URL}/*`} component={_404}></Route>
              </Switch>
            )}
        </span>
      </HashRouter>
    )//end Return
  }//end render


  // componentDidMount() {
  //   const db = FirestoreCompany.firestore();
  //   //Getting Developed By HTML
  //   db.collection('company').doc('developedBy').onSnapshot(res => {
  //     let data = res.data();
  //     if (data) {
  //       this.props.changeStateToReducer('developed_by_html', data.html);
  //       this.props.changeStateToReducer('developedByRouteName', data.routeName);
  //     }//End if condition
  //   }, (error) => { console.log('Error!', error); });

  //   //Getting Application Status
  //   db.collection('applications').doc(process.env.REACT_APP_FIRESTORE_DOC_NAME).onSnapshot(res => {
  //     let data = res.data();
  //     if (data) {
  //       this.props.changeStateToReducer('application_data', data);
  //       localStorage.setItem('webo_app_title', data.app_title);
  //     }//End if condition
  //   }, (error) => { console.log('Error!', error); });
  // }//End componentDidMount
}//End class
export default connect(mapStateToProps, mapDispatchToState)(App);
