import React, { Component } from 'react';
import { Row, Col, Icon, Form, Input, Button, Tooltip } from 'antd';
import Services from '../../../services';


const FormItem = Form.Item;

class UpdateListName extends Component {
  state = {toggleEdit : false,loader : false}
  handleForm   = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(err){return false;}
      this.setState({loader:true});
      values.id = this.props.data.id;
      Services.http('post','subscribers/post/updateListName.php',values).then(res => {
        this.setState({loader:false});
        if(!res){return false;}
        this.setState({toggleEdit : false});
        this.props.resetProps(values);
        this.props.refresh(true);
        this.props.refresh(false);
      });
    });//End form properties
  }//End function
  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.props.data;
    const st = this.state;
    return (
      <div className="m-b-15">
        {st.toggleEdit ? 
          <Form onSubmit={this.handleForm} style={{'marginTop' : '-4px', 'marginBottom' : '-3px'}}>
            <Row gutter={5}>
              <Col lg={8} md={8} sm={24} xs={24}>
                <FormItem label="List name">
                  {getFieldDecorator('list_name', {initialValue : data.list_name,rules: [{required: true, message: 'Please enter list name'}]})(<Input disabled={st.loader} placeholder="Type list name here"/>)}
                </FormItem>
              </Col>
              <Col lg={11} md={11} sm={24} xs={24}>
                  <FormItem label="Description">
                    {getFieldDecorator('description', {initialValue : data.description, rules: [{required: true, message: 'Please describe about list'}]})(<Input disabled={st.loader} placeholder="Type some description"/>)}
                  </FormItem>
              </Col>
              <Col lg={4} md={4} sm={20} xs={20}>
                <Button className="w-full m-t-25" loading={st.loader} type="primary" htmlType="submit">Update</Button>
              </Col>
              <Col lg={1} md={1} sm={4} xs={4}>
                <Tooltip placement="top" title={"Close"}>
                  <Button style={{
                    'width':'100%',
                    'marginTop':'25px',
                    'padding':'0px',
                    'border':'none',
                    'lineHeight':'2.4'
                  }} type="primary" disabled={st.loader} onClick={() => this.setState({toggleEdit : !st.toggleEdit})}><Icon type="close-circle" theme="filled"/></Button>
                </Tooltip>
              </Col>
            </Row>
          </Form>
        : data.list_name && 
          <div>
            <h3 className="pageTitle" style={{'marginBottom': '0px'}}> {data.list_name}</h3>
            {data.description}&nbsp;&nbsp;
            <Tooltip placement="top" title={"Edit list name and description"}>
              <button onClick={() => this.setState({toggleEdit : !st.toggleEdit})} className="btnToAnchor btaColor fs-18-imp"><Icon type="edit" theme="twoTone" /></button>
            </Tooltip>
          </div>
        }
      </div>
    );//end return
  }//End render
}//End class

export default Form.create()(UpdateListName);