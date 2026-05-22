import React, { Component } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import Services from '../../services';
import SideNavigation from '../../mutual/sideNavigation';
import BreadcrumbList from './partials/breadcrumb';

const FormItem = Form.Item;

class CreateList extends Component{

  state = {loader : false}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(err){return false;}
      this.setState({loader: true});
      Services.http('post','subscribers/post/createList.php',values).then(res => {
        this.setState({loader: false});
        if(!res){return false;}
        //console.log(res);
        this.props.history.push('/app/subscribers/list/'+res.id)
      });
    });//End form properties
  }//End handleSubmit

  render(){
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
          <Row gutter={40}>
            <Col lg={19} md={24} sm={24} xs={24}>
              <BreadcrumbList currentPage="Add a new list"/>
              <h3 className="pageTitle">Add a new list</h3>
              <p className="pageDesc">Give the list an easy to remember name that you'll recognize when you're sending an email.</p>
              <div className="container_3">
                <Form onSubmit={this.handleSubmit}>
                  <Row gutter={5}>
                    <Col lg={8} md={8} sm={24} xs={24}>
                      <FormItem>
                        {getFieldDecorator('list_name', {rules: [{required: true, message: 'Please enter list name'}]})(<Input size="large" disabled={this.state.loader} placeholder="Type list name here"/>)}
                      </FormItem>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <FormItem>
                          {getFieldDecorator('description', {rules: [{required: true, message: 'Please describe about list'}]})(<Input size="large" disabled={this.state.loader} placeholder="Type some description"/>)}
                        </FormItem>
                    </Col>
                    <Col lg={4} md={4} sm={24} xs={24}>
                      <Button className="w-full" loading={this.state.loader} size="large" type="primary" htmlType="submit">Create List</Button>
                    </Col>
                  </Row>
                </Form>
              </div>{/*end container_1*/}
            </Col>
            <Col lg={5} md={24} sm={24} xs={24}>
              <SideNavigation btn="ms" links="recentSubscribersList"/>
            </Col>
          </Row>
      </div>
    )//End return
  }//End render
}//End class
export default Form.create()(CreateList);