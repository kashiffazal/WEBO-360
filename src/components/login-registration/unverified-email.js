import React, { Component } from 'react';
import { Result, Button } from 'antd';
import { connect } from 'react-redux';
import mapStateToProps from '../../store/mapStateToProps';
import Services from '../services';

class UnverifiedEmail extends Component {

  state = {loader : false, data : ['','','']}

  resendEmail = () => {
    this.setState({ loader: true });
    let data = this.state.data;
    //Add session name to remove after verify email
    let values = {full_name : data.name, email : data.email, sessionName : this.props.match.params.data};
    Services.http('post','login/resendVerificationEmail.php',values).then(res => {
      this.setState({ loader: false });
    })//End http service
  }//end function

  render() {
    const store_value = this.props.store_values.application_data;
    return (
      <div className="conEmail">
        <Result
          title="VERIFY YOUR EMAIL ADDRESS"
          subTitle={`To continue using ${store_value.app_name}, please verify your email address.`}
          extra={[
            <Button key={1} onClick={() => this.resendEmail()} size="large" type="primary" loading={this.state.loader}>Send Verification Email</Button>,
            <Button key={2} onClick={() => window.history.go(-1)} size="large">Go Back </Button>
          ]}
        />
      </div>
    );//End return
  }//Emd render
  componentWillMount(){
    let data = Services.loadArrLocalStorage(this.props.match.params.data);
    this.setState({data});
  }//End componentWillMount
}//End class

export default connect(mapStateToProps)(UnverifiedEmail);