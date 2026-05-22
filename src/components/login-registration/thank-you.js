import React, { Component } from 'react';
import { Result, Button } from 'antd';

class ThankYou extends Component {
  render() {
    return (
      <div className="conEmail">
        <Result
          status="success"
          title="CONGRATULATIONS! YOU'RE VERIFIED!"
          subTitle={`Thank you for verifying your account, please click the button below to login your account`}
          extra={[
            <Button key={1} onClick={() => this.props.history.push("/login")} type="primary" size="large">Login</Button>,
          ]}
        />
      </div>
    );//End return
  }//End render
  componentWillMount(){
    localStorage.removeItem(this.props.match.params.localStorageName);
  }//End componentWillMount
}//End class

export default ThankYou;