/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { withRouter } from 'react-router-dom'

class BreadcrumbList extends Component {
  render() {
    return (
      <Breadcrumb>
        <Breadcrumb.Item href="#" onClick={() => this.props.history.push('/app/overview')}>
          <Icon type="home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/subscribers')}>
          List & Subscribers
        </Breadcrumb.Item>
        {this.props.listId &&
          <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/subscribers/list/' + this.props.listId)}>
            List
          </Breadcrumb.Item>
        }
        {this.props.listName && 
          <Breadcrumb.Item href="javascript:void(0)" onClick={() => this.props.history.push('/app/subscribers/list/' + this.props.listId)}>
            {this.props.listName}
          </Breadcrumb.Item>
        }
        <Breadcrumb.Item>
          {this.props.currentPage}
        </Breadcrumb.Item>
      </Breadcrumb>
    );//End return
  }//End render
}//end class

export default withRouter(BreadcrumbList);