import React, { Component } from "react";
import { Icon, Button, Row, Col } from "antd";
import { AntInput } from "../antd-fields";

import "./style.less";
//let uuid1 = 0;

class DynamicField extends Component {
  remove = k => {
    const keys = this.props.formProps.getFieldValue("_dynamic_keys");
    if (keys.length === 1) {
      return;
    }
    this.props.formProps.setFieldsValue({
      _dynamic_keys: keys.filter(key => key !== k)
    });
  };

  add = index => {
    //console.log(index);
    let keys = this.props.formProps.getFieldValue("_dynamic_keys");
    if (index >= 0) {
      keys.splice(index + 1, 0, keys.length);
      //console.log(keys);
    } else {
      keys.splice(keys.length, 0, this.append_unique(keys));
    } //End if condition
    this.props.formProps.setFieldsValue({ _dynamic_keys: keys });
  };

  removeNested = (k, l) => {
    const newkeys = this.props.formProps.getFieldValue(
      "_dynamic_nestedKey" + k
    );
    this.props.formProps.setFieldsValue({
      ["_dynamic_nestedKey" + k]: newkeys.filter(key => key !== l)
    });
  };

  addNested = (k, l) => {
    //Can use data-binding to get
    const newkeys = this.props.formProps.getFieldValue(
      "_dynamic_nestedKey" + k
    );
    //console.log(newkeys);
    newkeys.splice(l + 1, 0, this.append_unique(newkeys));
    this.props.formProps.setFieldsValue({
      ["_dynamic_nestedKey" + k]: newkeys
    });
  };

  num_to_arr = (num, index = false) => {
    let initialRows = [];
    if (num.rows) {
      num = num.rows[index];
    } //End if condition
    for (var i = 0; i < num; i++) {
      initialRows.push(i);
    } //End for
    return initialRows;
  }; //End function

  append_unique = (arr, num = false) => {
    let newNum = num ? num : arr.length;
    //#Find newNum in array , if found recall with new numNum+1 again #//
    return arr.includes(newNum) ? this.append_unique(arr, newNum + 1) : newNum;
  }; //End if condition

  check_nested_key = (k, allow = true) => {
    if (!allow) return false;
    let checkNested = this.props.formProps.getFieldValue(
      "_dynamic_nestedKey" + k
    );
    if (checkNested && checkNested.length > 0) {
      return true;
    } else {
      return false;
    }
  }; //End function


  field = (data, name, fp) => {
    return (
      <AntInput
        type={data.field}
        name={name} //Assigning name with indexes
        formProps={fp}
        label={data.label}
        options={data.options}
        emailErrorMsg={data.emailError}
      />
    )
  }//End function

  fields_render = (fieldRender, k, index, fp) => {
    //console.log(fieldRender);
    let fr = fieldRender;

    let frini = fr.initial;
    let cols = fr.fields.map((data, i) => {
      return (
        <Col key={i} lg={fr.col_set[i].lg} md={fr.col_set[i].md} sm={fr.col_set[i].sm} xs={fr.col_set[i].xs}>
          {data.field && (this.field(data, `_dynamic_field_${data.name}[${k}]`, fp))}
          {data.text && (
            <div className="col_box">
              <div className="text" style={data.text_align && { textAlign: data.text_align }}>
                {this.replace_string(data.text, index)}
              </div>
            </div>
          )}
          {data.nestedFields && (
            <div className="col_box" style={{ paddingBottom: "0px" }}>
              <Button onClick={() => this.addNested(k)} style={{ width: "100%" }} type={data.bnt_type ? data.bnt_type : "default"}
                //Just for disable after first child added
                disabled={this.check_nested_key(k, data.disableAfterOne)}
              >
                {data.btn_text ? (data.btn_text) : (<span><Icon type="plus" /> Add Child </span>)}
              </Button>
            </div>
          )}
        </Col>
      ); //End return
    });

    //If action button is allowed
    if (fr.action_config && fr.action_config.btn) {
      let frac = fr.action_config.col_set;
      let fra = fr.action_config;
      return (
        <Row style={frini.style} className={frini.className} gutter={frac.gutter}>
          <Col lg={frac[0].lg} md={frac[0].md} sm={frac[0].sm} xs={frac[0].xs}>
            <Row gutter={fr.col_set.gutter}>{cols}</Row>
          </Col>
          <Col lg={frac[1].lg} md={frac[1].md} sm={frac[1].sm} xs={frac[1].xs}>
            <div className="col_box">
              {!fra.less && !fra.add_bottom && (
                <Icon
                  className="add"
                  title="Add"
                  type="plus-circle-o"
                  onClick={() => this.add(index)}
                />
              )}
              <Icon
                className={index === 0 ? "action_disabled remove" : "remove"}
                title="Remove"
                type="close-circle-o"
                onClick={() => this.remove(k)}
              />
            </div>
          </Col>
        </Row>
      );

    } else {
      return (
        <Row
          style={frini.style}
          className={frini.className}
          gutter={fr.col_set.gutter}
        >
          {cols}
        </Row>
      );
    } //End if condition
  }; //End function

  nested_fields_render = (nested_fields, k, l, nested_index, fp) => {
    //console.log(nested_fields);
    let nf = nested_fields;
    let nfini = nf.initial;
    let cols = nf.fields.map((data, i) => {
      return (
        <Col key={i} lg={nf.col_set[i].lg} md={nf.col_set[i].md} sm={nf.col_set[i].sm} xs={nf.col_set[i].xs}>
          {data.field && (this.field(data, `_dynamic_nested_${data.name}[${k}][${l}]`, fp))}
          {data.text && (
            <div className="col_box">
              <div className="text" style={data.text_align && { textAlign: data.text_align }} >
                {this.replace_string(data.text, nested_index)}
              </div>
            </div>
          )}
        </Col>
      ); //End return
    });

    //If action button is allowed
    if (nested_fields.action_config && nested_fields.action_config.btn) {
      let nfac = nested_fields.action_config.col_set;
      return (
        <Row key={nested_index} style={nfini.style} className={nfini.className} gutter={nfac.gutter}>
          <Col lg={nfac[0].lg} md={nfac[0].md} sm={nfac[0].sm} xs={nfac[0].xs}>
            <Row gutter={nf.col_set.gutter}>{cols}</Row>
          </Col>
          <Col lg={nfac[1].lg} md={nfac[1].md} sm={nfac[1].sm} xs={nfac[1].xs}>
            <div className="col_box">
              <Icon className="add nested_icon" title="Add" type="plus-square-o" onClick={() => this.addNested(k, nested_index)} />
              <Icon className="remove nested_icon" title="Remove" type="close-square-o" onClick={() => this.removeNested(k, l)} />
            </div>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row key={nested_index} style={nfini.style} className={nfini.className} gutter={nf.col_set.gutter}>
          {cols}
        </Row>
      );
    } //End if condition
  }; //End function

  replace_string = (str, index) => {
    if (str.props) {
      //Replace in JSX object
      return { ...str, props: { children: str.props.children.replace("%i%", index + 1) } };
    } else {
      //Replace in normal text
      return str.replace("%i%", index + 1);
    } //End if condition
  }; //End function

  render() {
    const fieldRender = this.props.fieldRender;
    const fp = this.props.formProps;
    const { getFieldDecorator, getFieldValue } = fp;
    getFieldDecorator("_dynamic_keys", { initialValue: this.num_to_arr(fieldRender.initial.rows) });
    const keys = getFieldValue("_dynamic_keys");

    var nestedKeys = []; //Create array for child dynamic fields

    const formItems = keys.map((k, index) => {
      //Add Dynamic child fields--------------------------------------------//
      if (fieldRender.nested_config) {//If nested fields is available
        getFieldDecorator("_dynamic_nestedKey" + index, { initialValue: this.num_to_arr(fieldRender.nested_config.initial, index) });
        //this.initial_value_nested(index);
        nestedKeys = getFieldValue("_dynamic_nestedKey" + k);
        //if(nestedKeys === undefined || nestedKeys === null || nestedKeys.length === 0){nestedKeys = [];}
      }//End if condition
      //---------------------------------------------------------------------//
      //console.log(fieldRender);
      return (
        <React.Fragment key={k}>
          {this.fields_render(fieldRender, k, index, fp)}
          {/* Child Dynamic fields */}
          {nestedKeys && nestedKeys.length > 0 && nestedKeys.map((l, nested_index) =>
            this.nested_fields_render(fieldRender.nested_config, k, l, nested_index, fp)
          )}
        </React.Fragment>
      ); //End return
    });

    return (
      <div className="antd-dynamic-field-com">
        {this.props.label && <label className="label" style={{ paddingBottom: '10px', display: 'inline-block' }}>{this.props.label}</label>}
        {this.props.name ? (
          <React.Fragment>
            <AntInput type="text" name={this.props.name} formProps={fp} container_className="hidden" value={this.props.name} />
            {formItems}
            {(fieldRender.action_config && fieldRender.action_config.add_bottom) && (
              <div className="action_add_bottom">
                <Button type="dashed" onClick={() => this.add()}>
                  <Icon type="plus" /> {fieldRender.action_config.bottom_btn_text ? fieldRender.action_config.bottom_btn_text : "Add field"}
                </Button>
              </div>
            )}
          </React.Fragment>
        ) : (
            "Please provide name attribute"
          )}
      </div>
    ); //End return
  } //End render
  componentDidMount() {
    //Set name on mount if any reason it could not be set
    setTimeout(() => { let obj = {}; obj[this.props.name] = this.props.name; this.props.formProps.setFieldsValue(obj); }, 10)
  }//End componentDidMount
} //End class  

export default DynamicField;

export const AntDynamicFieldSet = (vl, dynamicFieldName) => {

  //If there is no data in dynamic object then return normal values
  if (!dynamicFieldName || !vl[dynamicFieldName]) { return vl; }

  let properties = Object.keys(vl);
  vl[dynamicFieldName] = {};

  properties.forEach(item => {
    //Deleting all _dynamic_nestedKey.. properties
    if (item.search("_dynamic_nestedKey") !== -1) {
      delete vl[item];
    } //End if condition
    //Deleting _dynamic_keys property
    if (item === "_dynamic_keys") {
      delete vl[item];
    } //End if condition

    //Set dynamic field array
    if (item.search("_dynamic_field_") !== -1) {
      //Set property name as field name
      vl[dynamicFieldName][item.split("_field_")[1]] = vl[item];
      delete vl[item];
    } //End if condition

    //Set dynamic nested field array
    if (item.search("_dynamic_nested_") !== -1) {
      //Set property name as field name
      vl[dynamicFieldName][item.split("_dynamic_")[1]] = vl[item];
      delete vl[item];
    } //End if condition
  }); //End foreach

  vl[dynamicFieldName] = JSON.stringify(vl[dynamicFieldName]);

  //Delete name property after set name as dynamic object name
  //delete vl.name;

  return vl;
}; //End function

export const AntDynamicFieldGet = (data, objName) => {
  if (!data) return false;
  //If dynamic object is empty or not found then just return normal values or data
  if (!data[objName]) return data;
  //return false;
  data = JSON.parse(data[objName]);
  let resObj = {};
  let properties = Object.keys(data);

  properties.forEach(item => {
    if (item.search("nested_") !== -1) {
      data[item].forEach((it, i) => {
        //Set nested field object
        it.forEach((dt, k) => {
          resObj[`_dynamic_${item}[${i}][${k}]`] = dt;
        });
      });
    } else {
      //Set field object
      data[item].forEach((it, i) => {
        resObj[`_dynamic_field_${item}[${i}]`] = it;
      });
    } //End if condition
  });
  //console.log(resObj)
  return resObj;
}; //End function

export const AntDynamicFieldOpen = (vl) => {
  //console.log(vl)
  let properties = Object.keys(vl);

  //If it could not found any dynamic field then return false
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].search("_dynamic_field_") === -1) { return false; }
  }//End for loop


  let row = [];
  let nested_row = [];
  properties.forEach(item => {
    if (item.search("_dynamic_field_") !== -1) {
      row.push(item.substr(item.length - 3, 3));
    }//End if condition
    if (item.search("_dynamic_nested_") !== -1) {
      nested_row.push(item.substr(item.length - 6, 6));
    }//End if condition
  })
  row = [...new Set(row)];//Make array unique
  row = row.length;

  nested_row = [...new Set(nested_row)];//Make array unique
  //Result :- ["[0][0]", "[0][1]", "[1][0]"]

  let nested = {};
  nested_row.forEach(item => {
    var it = item.substr(1, 1);
    nested[it] = (nested[it] ? (nested[it] + ",") : '') + it;
  })
  nested_row = nested;
  //Resule :- {0: "0,0", 1: "1"}

  let nested_keys = Object.keys(nested);
  nested_keys.forEach(item => { nested[item] = nested[item].split(',').length; })
  //Result :- {0: 2, 1: 1}

  return { rows: row, nested_rows: nested_row };
}//End function