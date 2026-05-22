import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Result, Button } from 'antd';

class _404 extends Component {
  render(){
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button onClick={() => window.history.go(-1)} type="primary">Go Back </Button>}
      />
    );//End return
  }//End render
}//end class

export default withRouter(_404);
