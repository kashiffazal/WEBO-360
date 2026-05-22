import React, { Component } from 'react';
import { Result, Button } from 'antd';

class Error extends Component {
  render() {
    return (
      <div className="h-full flex-c-m">
        <Result
          status="error"
          title="Sorry, we've run into a problem"
          subTitle="We're not exactly sure what the problem is. It could be that the system had a rare and once-off glitch: so first try going back and performing the action again."
          extra={[
            <Button key="1" size="large" type="primary" onClick={() => window.history.go(-1)}>Go Back</Button>
          ]}
        />
      </div>
    );
  }
}

export default Error;