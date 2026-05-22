import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../store/mapStateToProps';
class DevelopedBy extends Component {
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.store_values.developed_by_html }} />
    );//End return
  }//End render
}//End class

export default connect(mapStateToProps)(DevelopedBy);