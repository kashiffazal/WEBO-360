import React, { Component } from 'react';
import { Row, Col, Form, Button, Spin, Icon } from 'antd';
import SideNavigation from '../../mutual/sideNavigation';
import Services from '../../services';
import { AntInput } from '../../externalComponents/antd-fields';


class UsersManagement extends Component {
  state = {
    loader: false,
    btnLoader: false,
    roleListArr: [],
    selectedRole: '',
    statusListArr: [],
    esps_data: [],
    updateStatus: false,
  };

  submitForm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ btnLoader: true });
        Services.http('post', 'usersManagement/post/addUser.php', values).then(res => {
          //console.log(values);
          this.setState({ btnLoader: false });
          if (!res) { return false; }
          if (this.state.updateStatus) {
            this.props.history.push('/app/usersList');
          } else {
            this.props.form.resetFields();
          }//End if condition
        });
      }//End if condition
    });//End form properties
  }//End function

  getRoles = () => {
    this.setState({ loader: true });
    Services.http('get', 'usersManagement/get/roleList.php').then(res => {
      this.setState({ loader: false });
      if (!res) { return false; }
      //console.log(res);
      this.setState({
        'roleListArr': res.data,
        'statusListArr': res.status_data,
        'esps_data': res.esps.data,
        'esps_account_list' : {},
      });
    });
  }//End function

  getUserData = (id) => {
    this.setState({ loader: true });
    Services.http('get', 'usersManagement/get/userData.php?id=' + id).then(res => {
      if (res.data.role === '5') {//If role is client then show ESPS field
        this.setState({ selectedRole: res.data.role })
      }//End if condition
      this.setState({ loader: false });
      if (!res) { return false; }
      this.props.form.setFieldsValue(res.data);
      this.setESPSaccountList();
			setTimeout(() => {this.props.form.setFieldsValue({ default_esps_sr_ac_id : res.data.default_esps_sr_ac_id});},100);
    });
  }//End function

	setESPSaccountList = () => {
		setTimeout(() => {
			this.props.form.setFieldsValue({ 'default_esps_sr_ac_id': '' });
			let esps_sr_id = this.props.form.getFieldValue('default_esps_sr_id');
			if (esps_sr_id) {
				this.setState({ esps_account_list: Services.getObjectFromArr(esps_sr_id, 'id', this.state.esps_data).data });
			} else {
				this.setState({ esps_account_list: {} });
			}//End if condition
		}, 10);
	}//End function

  render() {
    const fp = this.props.form;
    const st = this.state;
    return (
      <div>
        <Row gutter={40}>
          <Col lg={19} md={24} sm={24} xs={24}>
            <h3 className="pageTitle"><Icon type="usergroup-add" /> Create New User</h3>
            <p className="fs-14">Use lists to organize separate groups of subscribers e.g. customers and employees. Correctly managing your lists and using segments will allow you to get the most out of your email marketing as campaigns, segments, subscriber data and engagement are not shared across lists.</p>
            <div className="container_3">
              <Spin spinning={st.loader} tip="Loading, Please wait...">
                <Form className="step_1" onSubmit={this.submitForm}>
                  <AntInput name="id" className="dis-none-imp" formProps={fp} noRequired={true} />
                  <Row gutter={20}>
                    <Col lg={6} md={6} sm={24} xs={24}>
                      <AntInput label="Full Name" type="text" name="full_name" formProps={fp} placeholder="Please type first name" />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                      <AntInput label="Company Name" type="text" name="company_name" formProps={fp} placeholder="Please type company name" />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                      <AntInput label="Email" type="email" name="email" formProps={fp} placeholder="Please type your email" />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                      <AntInput filter={true} type="select" label="Role" name="role" formProps={fp} options={st.roleListArr} setValueLabel={['id', 'role']} 
                        onChange={() => setTimeout(() => this.setState({ selectedRole: this.props.form.getFieldsValue().role }), 100)}
                      />
                    </Col>
                    

                    {st.selectedRole === '5' &&
                      <React.Fragment>
                        <Col lg={6} md={6} sm={24} xs={24} className="p-t-20">
                            <AntInput filter={true} type="select" label="ESPS Server" name="default_esps_sr_id" formProps={fp} options={st.esps_data} setValueLabel={['id', 'server_name']} onChange={() => this.setESPSaccountList()} />
                          </Col>
                          <Col lg={6} md={6} sm={24} xs={24} className="p-t-20">
                          <AntInput filter={true} type="select" label="ESPS Account Name" name="default_esps_sr_ac_id" formProps={fp} options={st.esps_account_list} setValueLabel={['id', 'account_name']} />
                        </Col>
                      </React.Fragment>
                    }
                    <Col lg={6} md={6} sm={24} xs={24} className="p-t-20">
                      <AntInput filter={true} type="select" label="Account Status" name="status" formProps={fp} options={st.statusListArr} setValueLabel={['id', 'status']} />
                    </Col>

                    <Col lg={6} md={6} sm={24} xs={24} className="p-t-20">
                      <AntInput label="Username" type="text" name="username" formProps={fp} placeholder="Please type username" />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24} className="p-t-20">
                      <AntInput label="Password" type="password" name="password" formProps={fp} placeholder="Please type password" />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24} className={st.selectedRole === '5' ? "float-l-imp p-t-44" : "float-r-imp p-t-44"}>
                      <Button className="w-full" type="primary" htmlType="submit" loading={st.btnLoader}>
                        {st.updateStatus ? 'Update User' : 'Add User'}
                      </Button>
                    </Col>
                  </Row>
                </Form>

              </Spin>
            </div>

          </Col>
          <Col lg={5} md={24} sm={24} xs={24}>
            <SideNavigation title="Related & Other Links" links="umul,umcr,ac,ms" />
          </Col>
        </Row>
      </div>
    );//End return
  }//End render
  componentDidMount() {
    this.getRoles();
    if (this.props.match.params.id) {
      this.setState({ updateStatus: true }, () => {
        this.getUserData(this.props.match.params.id);
      });
    }//End if condition

  }// End componentDidMount
}//End class

export default Form.create()(UsersManagement);