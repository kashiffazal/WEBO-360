import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../../store/mapStateToProps';
import Services from '../../services';
// import {Row,Col} from 'antd';

class Footer extends Component{
  render(){
    const store_value = this.props.store_values.application_data;
    return(
      <React.Fragment>
        {/* <footer style={{padding : '10px 40px'}}>
          <Row type="flex" justify="space-around" align="middle">
            <Col md={12} sm={24} className='text-left'>
              Version 1.0 | © {Services.getCurrentYear()} WEBO360, All Rights Reserved.
            </Col>
            <Col md={12} sm={24} className='text-right'>
              Developed by &nbsp; <a href="https://www.innotechcloud.com/" rel="noopener noreferrer" target="_blank"><img src="https://blockims.innotechcloud.com/img/brand-logo.png" width="100px" alt="Logo"/></a>
            </Col>
            </Row>
        </footer> */}
        <footer>
          Copyright &copy; 2018 - {Services.getCurrentYear()} <a href={store_value.site_url} target="_blank" rel="noopener noreferrer">{store_value.app_name}</a> All Rights Reserved.
        </footer>
      </React.Fragment>
    )//End return
  }//End render
}//End class


export default connect(mapStateToProps)(Footer);