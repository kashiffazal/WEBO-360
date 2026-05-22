import React, { Component } from 'react';
import { Form, Input, Icon, Button, Row, Col } from 'antd';
import { AntInput } from '../antd-fields';

import './style.less';
//let id = 0;

class DynamicField extends Component {

  state = { initialRows : [0] };

  remove = k => {
    const keys = this.props.formProps.getFieldValue('keys');
    if (keys.length === 1) {return;}
    this.props.formProps.setFieldsValue({keys: keys.filter(key => key !== k)});
  };

  add = (index) => {
		let keys = this.props.formProps.getFieldValue('keys');
		if(index){
			keys.splice(index, 0, keys.length);
		}else{
			keys.splice(keys.length, 0, keys.length);
		}//End if condition
		this.props.formProps.setFieldsValue({keys: keys});
  };

  setVal = () => {
    this.props.formProps.setFieldsValue({
      username : 'kashif',
      "danish[0]" : 'aa'
    });
  }

  add_nested_field = () => {
    alert('dd');
  }


  field_with_col_render = (item,k,index,fp) => {
      
      let cols = item.fields.map((data,i) => {
				return (
          <Col key={i} lg={item.col_set[i].lg} md={item.col_set[i].md} sm={item.col_set[i].sm} xs={item.col_set[i].xs}>
            {data.field && 
              <AntInput
                type={data.field}
                name={`${data.name}[${k}]`}//Assigning name with indexes
                formProps={fp}
                label={data.label}
                options={data.options}
              />
            }
            {data.text && 
              <div className="col_box">
                <div className="text" style={data.text_align && {textAlign : data.text_align}}>
                  {this.replace_string(data.text,index)}
                </div>
              </div>
            }
            {data.nestedFields && 
              <div className="col_box" style={{paddingBottom:'0px'}}>
                <Button onClick={() => this.add_nested_field(index)} style={{width:'100%'}} type={data.bnt_type ? data.bnt_type : 'default'}>
                  {data.btn_text ? data.btn_text : <span><Icon type="plus" />Add Child</span>}
                </Button>
              </div>
            }
          </Col>
				)//End return
      });
      
      let cols_with_action_btn = (
				<Row gutter={item.action_gutter}>
					<Col lg={item.action_col_set[0].lg} md={item.action_col_set[0].md} sm={item.action_col_set[0].sm} xs={item.action_col_set[0].xs}>
            <Row gutter={item.gutter}>
              {cols}
            </Row>
          </Col>
					<Col lg={item.action_col_set[1].lg} md={item.action_col_set[1].md} sm={item.action_col_set[1].sm} xs={item.action_col_set[1].xs}>
            <div className="col_box">
              {(!item.action_less && !item.action_allow_add_bottom) &&
                <Icon className={index === 0 ? "action_disabled add" : "add"} title="Add" type="plus-circle-o" onClick={() => this.add(index)}/>
              }
              <Icon className={index === 0 ? "action_disabled remove" : "remove"} title="Remove" type="close-circle-o" onClick={() => this.remove(k)}/>
            </div>
					</Col>
        </Row>
      );

      //If action button is allowed
      if(item.action_btn){
        return cols_with_action_btn;
      }else{
        return (<Row gutter={item.gutter}>{cols}</Row>);
      }//End if condition

  }//End function


  replace_string = (str,index) => {
    if(str.props){
      //Replace in JSX object
      return {...str, props : { children : str.props.children.replace("%i%", index+1)}};
    }else{
      //Replace in normal text
      return str.replace("%i%", index+1);
    }//End if condition
  }//End function

  render() {
    const st = this.state;
    const pr = this.props;
    const fp = pr.formProps;
    const { getFieldDecorator, getFieldValue } = fp;
    getFieldDecorator('keys', { initialValue: st.initialRows });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (

      <React.Fragment key={k}>
        {this.field_with_col_render(pr.fieldRender,k,index,fp)}
      </React.Fragment>


      // <React.Fragment key={k}>
      //   <AntInput name={`names[${k}]`} style={{ width: '97%'}} formProps={fp} label="kashif"/>
      //   {keys.length > 1 ? (<Icon title="remove" type="minus-circle-o" style={{ width: '3%', textAlign:'right'}} onClick={() => this.remove(k)}/>) : null}
      // </React.Fragment>

      // <Form.Item label={index === 0 ? 'Passengers' : ''} key={k}>
      //   {/* {getFieldDecorator(`names[${k}]`, {rules: [{required: true, message: "Please input passenger's name or delete this field."}]})
      //   (<Input placeholder="passenger name" style={{ width: '97%'}} />)} */}
      //   {keys.length > 1 ? (<Icon title="remove" type="minus-circle-o" style={{ width: '3%', textAlign:'right'}} onClick={() => this.remove(k)}/>) : null}
      // </Form.Item>
    ));
      //console.log(pr.fieldRender);
    return (
      <div className="antd-dynamic-field-com">
        <button onClick={() => this.setVal()}>asdf</button>
        <Form.Item>
          {getFieldDecorator('username', {rules: [{ required: true, message: 'Please input your username!' }],
          })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username"/>,)}
        </Form.Item>
        {formItems}
        {pr.fieldRender.action_allow_add_bottom && 
          <div className="action_add_bottom">
            <Button type="dashed" onClick={() => this.add()}><Icon type="plus" /> {pr.fieldRender.action_bottom_btn_text ? pr.fieldRender.action_bottom_btn_text : "Add field"}</Button>
          </div>
        }
      </div>
    );//End return
  }//End render
  componentDidMount(){
    const pr = this.props;
    //Set initial Row count otherwise default is 1 
    /*It's create array e.g if pr.fieldRender.initialRows is 3 then it will create [0,1,2]*/
    if(pr.fieldRender.initialRows){
      let initialRows = [];
      for(var i=0; i<pr.fieldRender.initialRows; i++){initialRows.push(i);}//End for
      this.setState({initialRows});
    }//End if condition
  }//End componentDidMount
}//End class

export default DynamicField;