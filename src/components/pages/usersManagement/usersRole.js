/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, Button, Spin, Popconfirm, Checkbox, Icon } from 'antd';
import AccessControl from '../../externalComponents/user-base-access-control';
import SideNavigation from '../../mutual/sideNavigation';
import Services from '../../services';
import "./styles.css";

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

class UsersRole extends Component {
  state = {
    loader : false,
    btnLoader : false,
    permissionListArr: [],
    roleListArr : [],
    update_role_status : false,
    checkbox_checked : false,
  };

  submitForm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.setState({btnLoader : true});
        Services.http('post','usersManagement/post/addRole.php',values).then(res => {
          this.setState({btnLoader : false});
          if(!res){return false;}
          if(this.state.update_role_status){this.setState({'update_role_status' : false});}//End if condition
          this.setState({checkbox_checked : false});
          this.props.form.resetFields();
          this.getRoles();
        });
      }//End if condition
    });//End form properties
  }//End function

  getRoles = () => {
    this.setState({getLoader : true});
    Services.http('get','usersManagement/get/roleList.php?permission=true').then(res => {
      this.setState({getLoader : false});
      if(!res){return false;}
      this.setState({'roleListArr' : res.data});
    });
  }//End function

  delete_role = (role_id) => {
    this.setState({loader : true});
    Services.http('post','usersManagement/post/deleteRole.php',{id : role_id}).then(res => {
      this.setState({loader : false});
      if(!res){return false;}
      this.getRoles();
    });
  }//End function

  edit_role = (role_data) => {
    this.setState({'update_role_status' : true});
    var resArr = {
      id:role_data.id,
      role : role_data.role,
      permission_ref_ids : role_data.permission_ref_ids.split(','),
      description : role_data.description,
    };
    this.setState({checkbox_checked : (role_data.hideForOthers ? true : false)});
    this.props.form.setFieldsValue(resArr);
  }//End function

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <h3 className="pageTitle">Users Role</h3>
            <p className="fs-14">Use lists to organize separate groups of subscribers e.g. customers and employees. Correctly managing your lists and using segments will allow you to get the most out of your email marketing as campaigns, segments, subscriber data and engagement are not shared across lists.</p>
            <div className="container_3">

              <Row gutter={20}>
                <Col lg={8} md={12} sm={24} xs={24}>
                  <Spin spinning={this.state.loader}>
                    <Form onSubmit={this.submitForm} className="formStyle_2">

                      <FormItem label="id" style={{'display':'none'}}>{getFieldDecorator('id')(<Input/>)}</FormItem>
                      <FormItem label="Role">{getFieldDecorator('role', {rules: [{required: true, message: 'Please input role name'}],})(<Input placeholder="Please type role name"/>)}</FormItem>
                      <FormItem label="Select permissions">{getFieldDecorator('permission_ref_ids', {initialValue: [], rules: [{ required: true, message: 'Please select permission'}]})(
                          <Select mode="multiple" placeholder="Please select permission">
                            {this.state.permissionListArr}
                          </Select>
                        )}
                      </FormItem>
                      <FormItem label="Description">{getFieldDecorator('description', {rules: [{required: true, message: 'Please input description'}],})(<TextArea placeholder="Please type description" autosize={{ minRows: 3, maxRows: 6 }} />)}</FormItem>
                      <FormItem label="" className="checkbox_lines">{getFieldDecorator('hideForOthers')(<Checkbox onChange={() => this.setState({checkbox_checked : !this.state.checkbox_checked})} checked={this.state.checkbox_checked}>Hide role for others e.g. role like developer, super admin etc.</Checkbox>)}</FormItem>
                      


                      <FormItem className="float-r">
                        {
                          this.state.update_role_status && 
                          <Button onClick={() => {
                            this.setState({'update_role_status' : false}, () =>{
                              this.props.form.resetFields();
                            })
                          }}>Reset</Button>
                        }
                        &nbsp;
                        <Button type="primary" htmlType="submit" loading={this.state.btnLoader}>
                          {this.state.update_role_status ? 'Update' : 'Create'}
                        </Button> 
                      </FormItem>
                    </Form>
                  </Spin>
                </Col>
                <Col lg={16} md={12} sm={24} xs={24}>

                  <p className="m-b-4"><em>List of users role</em></p>
                  <Spin spinning={this.state.getLoader}>
                    <div className="role_container h-338" id="scroll-style-1">
                        {
                          this.state.roleListArr.map((item,i) => {
                            return(
                              <div className="role_list" key={i}>
                                <Row gutter={20}>
                                  <Col lg={20} md={24} sm={24} xs={24}>
                                    <b>{item.hideForOthers === 'true' ? <Icon type="lock" /> : <Icon type="user" />} {item.role}&nbsp;</b>
                                    <span className="m-0 fs-12">{item.description}</span><br/>
                                    {
                                      item.permissions.split('|').map((item_inner, i_inner) => {
                                        return(<span className="role_blocks" key={i_inner}>{item_inner}</span>)
                                      })
                                    }
                                    </Col>
                                    <Col lg={4} md={24} sm={24} xs={24}>
                                        <div className="fs-12 p-t-15 text-right">
                                          <AccessControl>
                                            <Popconfirm ubac_id={10} title="Do you want to edit role?" onConfirm={() => this.edit_role(item)} okText="Yes" cancelText="No">
                                              <a href="javascript:void(0)">Edit</a>
                                            </Popconfirm>
                                            <span ubac_id={11}>&nbsp;|&nbsp;</span>
                                            <Popconfirm ubac_id={11} title="Are you sure delete this role?" onConfirm={() => this.delete_role(item.id)} okText="Yes" cancelText="No">
                                              <a href="javascript:void(0)">Delete</a>
                                            </Popconfirm>
                                          </AccessControl>
                                        </div>
                                    </Col>
                                  </Row>
                              </div>
                            )//End return
                          })
                        }
                    </div>
                  </Spin>
                </Col>
              </Row>

            </div>
          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <SideNavigation btn="umcu" title="Related & Other Links" links="umcu,umul,ac,ms"/>
          </Col>
        </Row>
      </div>
    );//End return
  }//End render
  componentDidMount(){
    
    this.setState({'loader' : true});
    Services.http('get','usersManagement/get/permissionList.php').then(res => {
      this.setState({loader : false});
      if(!res){return false;}
      res = res.data;
      
      const children = [];
      res.forEach((data) => {children.push(<Option key={data.key} value={data.id}>{data.permission}</Option>);});
      this.setState({'permissionListArr' : children})
    });

    this.getRoles();

  }//End componentDidMount
}//End class

export default Form.create()(UsersRole);