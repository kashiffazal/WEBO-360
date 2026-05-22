/*eslint-disable no-useless-escape*/
/*eslint-disable no-unused-expressions*/
/*eslint-disable array-callback-return*/
import React from "react";
import {
  Form,
  Icon,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Upload
} from "antd";


import DynamicField, { AntDynamicFieldSet, AntDynamicFieldGet, AntDynamicFieldOpen } from "../antd-dynamic-fields";

import moment from "moment";
import $ from "jquery";

const { Option } = Select;
const { TextArea } = Input;

$(document).ready(function () {
  $(".typeNumber").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if (
      $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  });
});

var numberPrefixPostfix = (prefix, postfix, value) => {
  value = value.toString();
  if (prefix && postfix) {
    let regex = new RegExp("\\" + prefix + "s?|(,*)" + postfix, "g");
    let res = {
      formatter: `${prefix} ${value}${postfix}`.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      ),
      parser: value.replace(regex, "").trim()
    };
    return res;
  } else if (prefix) {
    let regex = new RegExp("\\" + prefix.trim() + "s?|(,*)", "g");
    let res = {
      formatter: `${prefix} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      parser: value.replace(regex, "").trim()
    };
    return res;
  } else if (postfix) {
    let res = {
      formatter: `${value}${postfix}`,
      parser: value.replace(postfix, "")
    };
    return res;
  } else {
    let res = {
      formatter: value,
      parser: value
    };
    return res;
  } //End if condition
}; //End function

const nameError = {
  border: "1px solid #d8d8d8",
  padding: "5px 12px",
  borderRadius: "4px",
  background: "#ffeaea",
  color: "#d40000"
};
const radioVerticalStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
  margin: "0px"
};
const checkboxVerticalStyle = radioVerticalStyle;

export const AntInput = ({
  //Essentials
  type = "text",
  name,
  placeholder,
  value,
  label,
  noRequired = false,
  reqMsg = "Required",
  className = "",
  style,
  containerStyle,
  containerClassName,
  onChange,
  disabled,
  //Text and password
  preIcon = false,
  preIconColor = "rgba(0,0,0,.25)",
  sufIcon = false,
  sufIconColor = "rgba(0,0,0,.25)",
  //Email 
  emailErrorMsg = "The input is not valid E-mail!",
  //Number
  min = 0,
  max = 1000000000000000000000 * 1000000000000000000000,
  step = 0.1,
  numPreFix = false,
  numPostFix = false,
  //Select
  options = [],
  setValueLabel = false,
  filter = false,
  mode = false,
  //Datepicker
  format = "MM-DD-YYYY",
  disabledDate = () => {},
  //Radio
  radioOptions = [],
  vertical = false,
  //checkbox
  group = false,
  text,
  indeterminate = false,
  //Textarea
  rows,
  minRows = 4,
  maxRows, //Fix
  //Antd Essentials
  size = "default",
  formProps,
  help = undefined,
  feedback
}) => {
  let validateKeyword = undefined;
  let checkboxGroupInitialValues = [];
  let validateStausErrorMsg = (
    <div style={nameError}>
      feedback could be 'success', 'warning', 'error', 'validating' and could be
      empty without quotes
    </div>
  );
  if (!formProps) {
    return (
      <div style={nameError}>
        Please provide formProps attribute.
      </div>
    )
  }//End if condition
  //Default is required
  if (!name) {
    return <div style={nameError}>Please provide name attribute</div>;
  } //End if condition
  //If feedback is available validationStatus value then allow 'validateStatus'
  if (feedback && feedback !== true) {
    if (
      feedback !== "success" &&
      feedback !== "warning" &&
      feedback !== "error" &&
      feedback !== "validating"
    ) {
      return validateStausErrorMsg;
    } //End if condition
    validateKeyword = feedback;
    feedback = true;
  } else {
    //If feedback is like feedback="" then show error
    feedback = feedback !== true ? undefined : feedback;
    //return validateStausErrorMsg;
  } //End if condition

  //Checking input type
  if (type === "number") {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value,
          rules: [{ required: !noRequired, message: reqMsg }]
        })(
          <InputNumber
            style={{ width: "100%", ...style }}
            className={className ? className + " typeNumber" : "typeNumber"}
            size={size}
            formatter={value =>
              numberPrefixPostfix(numPreFix, numPostFix, value).formatter
            }
            parser={value =>
              numberPrefixPostfix(numPreFix, numPostFix, value).parser
            }
            onChange={e => {
              onChange ? onChange(e) : "";
            }}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder ? placeholder : label}
          />
        )}
      </Form.Item>
    ); //End return
  } else if (type === "email") {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value,
          rules: [{
            type: 'email',
            message: emailErrorMsg,
          },
          { required: !noRequired, message: reqMsg }]
        })(
          <Input
            style={style}
            className={className}
            size={size}
            prefix={
              preIcon ? <Icon type={preIcon} style={{ color: preIconColor }} /> : ""
            }
            suffix={
              sufIcon ? <Icon type={sufIcon} style={{ color: sufIconColor }} /> : ""
            }
            placeholder={placeholder ? placeholder : label}
            onChange={e => {
              onChange ? onChange(e) : "";
            }}
          />
        )}
      </Form.Item>
    ); //End of text and password
  } else if (type === "select") {
    if (!value || value === 'undefined' || value === '') { value = ""; }
    if (mode) { value = []; }
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value,
          rules: [{ required: !noRequired, message: reqMsg }]
        })(
          <Select
            style={style}
            className={className}
            onChange={e => { onChange ? onChange(e) : ""; }}
            showSearch={filter}
            mode={mode}
            placeholder={placeholder ? placeholder : label}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            disabled={disabled ? true : false}
          >
            {!mode && <Option value="">-Select-</Option>}
            {options.length > 0 && options.map((item, i) => {

              if (setValueLabel && setValueLabel.length > 0) {
                var value = item[setValueLabel[0]];
                var label = item[setValueLabel[1]];
              }//End if condition

              return (
                <Option
                  key={item.key ? item.key : item.id ? item.id : i}
                  value={value ? value : (item.value ? item.value : label)}
                >
                  {item.label ? item.label : (label ? label : (value ? value : item.value))}
                </Option>
              );
            })}
          </Select>
        )}
      </Form.Item>
    );
  } else if (type === "datepicker") {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value ? moment(value, format) : undefined,
          rules: [{ required: !noRequired, message: reqMsg }]
        })(
          <DatePicker
            style={{ width: "100%", ...style }}
            onChange={onChange}
            format={format}
            disabled={disabled ? true : false}
            disabledDate={disabledDate}
          />
        )}
      </Form.Item>
    );
  } else if (type === "radio") {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value,
          rules: [{ required: !noRequired, message: reqMsg }]
        })(
          <Radio.Group
            onChange={e => {
              onChange ? onChange(e.target.value) : "";
            }}
            disabled={disabled ? true : false}
          >
            {radioOptions.map((item, i) => {
              return (
                <Radio
                  style={vertical ? { ...radioVerticalStyle, ...style } : style}
                  className={className}
                  key={item.key ? item.key : item.id ? item.id : i}
                  value={item.value ? item.value : item.label}
                >
                  {item.label}
                </Radio>
              );
            })}
          </Radio.Group>
        )}
      </Form.Item>
    );
  } else if (type === "checkbox") {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {group ?
          <React.Fragment>
            {/* Set Group initial value */}
            {!value && group.map(item => { item.checked && checkboxGroupInitialValues.push(item.value ? item.value : item.label) })}
            {
              formProps.getFieldDecorator(name, {
                initialValue: (value ? value : checkboxGroupInitialValues), //Array
                rules: [{ required: !noRequired, message: reqMsg }]
              })(
                <Checkbox.Group
                  onChange={e => { onChange ? onChange(e) : ""; }}>
                  {group.map(item => {
                    return (
                      <Checkbox
                        key={item.label}
                        //style={vertical ? { ...checkboxVerticalStyle, ...style } : style}
                        style={vertical ? { ...checkboxVerticalStyle, ...style, ...item.style } : { ...style, ...item.style }}
                        className={className ? className + ' ' + item.className : item.className}
                        disabled={item.disabled ? true : false}
                        onChange={e => { item.onChange ? item.onChange(e.target.checked) : ""; }}
                        value={item.value ? item.value : item.label}
                      >{item.label ? item.label : label}
                      </Checkbox>
                    )//End return
                  })}
                </Checkbox.Group>
              )
            }
          </React.Fragment>
          :
          formProps.getFieldDecorator(name, {
            valuePropName: 'checked',
            initialValue: value,
            rules: [{
              required: !noRequired, message: reqMsg,
              transform: vl => (vl || undefined),  // Those two lines
              type: 'boolean',                           // Do the magic
            }]
          })(
            <Checkbox
              style={style}
              className={className}
              indeterminate={indeterminate}
              disabled={disabled ? true : false}
              onChange={e => { onChange ? onChange(e.target.checked) : ""; }}
            >
              {text ? text : label}
            </Checkbox>
          )
        }{/*End single checkbox*/}
      </Form.Item >
    );
  } else if (type === "textarea") {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value,
          rules: [{ required: !noRequired, message: reqMsg }]
        })(
          <TextArea
            style={style}
            rows={rows}
            autoSize={!rows && { minRows: minRows, maxRows: maxRows }}
            className={className}
            size={size}
            placeholder={placeholder ? placeholder : label}
            onChange={e => {
              onChange ? onChange(e) : "";
            }}
          />
        )}
      </Form.Item>
    );
  } else {
    return (
      <Form.Item
        label={label}
        validateStatus={validateKeyword}
        hasFeedback={feedback}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {type === "password"
          ? formProps.getFieldDecorator(name, {
            initialValue: value,
            rules: [{ required: !noRequired, message: reqMsg }]
          })(
            <Input.Password
              style={style}
              className={className}
              size={size}
              prefix={
                preIcon ? <Icon type={preIcon} style={{ color: preIconColor }} /> : ""
              }
              suffix={
                sufIcon ? <Icon type={sufIcon} style={{ color: sufIconColor }} /> : ""
              }
              placeholder={placeholder ? placeholder : label}
              onChange={e => {
                onChange ? onChange(e) : "";
              }}
            />
          )
          : formProps.getFieldDecorator(name, {
            initialValue: value,
            rules: [{ required: !noRequired, message: reqMsg }]
          })(
            <Input
              style={style}
              className={className}
              size={size}
              prefix={
                preIcon ? <Icon type={preIcon} style={{ color: preIconColor }} /> : ""
              }
              suffix={
                sufIcon ? <Icon type={sufIcon} style={{ color: sufIconColor }} /> : ""
              }
              placeholder={placeholder ? placeholder : label}
              onChange={e => {
                onChange ? onChange(e) : "";
              }}
            />
          )}
      </Form.Item>
    ); //End of text and password
  } //End if condition
}; //End function

export const AntFileUpload = ({
  label = false,
  icon = 'cloud-upload',
  heading = 'Click or drag file to upload',
  para = '',
  multiple = false,
  listType = 'text',
  onChange = false,
  name,
  noRequired = false,
  reqMsg = "Please upload file",
  containerStyle,
  containerClassName,
  formProps,
  help,
  value = false
}) => {

  if (!name) { return <div style={nameError}>Please provide name attribute</div>; }//End if condition
  if (!formProps) { return <div style={nameError}>Please provide formProps attribute.</div> }//End if condition
  const Dragger = Upload.Dragger;
  const props = {
    multiple: multiple,
    listType: listType,
    //listType: 'text',
    //listType: 'picture',
    //listType: 'picture-card',
    //onRemove: (file) => {for(var i=0; i<fileList.length;i++){if(fileList[i].uid === file.uid){fileList.splice(i, 1);break;}}},
    beforeUpload: (file) => {
      //fileList.push(file);
      return false;
    },
    //onChange : () => {onChange && onChange(fileList);}
  };//End documents upload props
  const normFile = e => {
    //console.log(e);
    //if (Array.isArray(e)) {return e;}
    onChange && onChange(e.fileList);
    return e.fileList;
  };
  return (
    <React.Fragment>
      <Form.Item
        label={label}
        help={help}
        style={containerStyle}
        className={containerClassName}
      >
        {formProps.getFieldDecorator(name, {
          initialValue: value,
          rules: [{ required: !noRequired, message: reqMsg }],
          valuePropName: 'fileList',
          getValueFromEvent: normFile,
        })(
          <Dragger {...props}>
            <p className="ant-upload-drag-icon" style={{ margin: '0px' }}><Icon type={icon} /></p>
            {heading && <p style={{ fontSize: '18px' }}>{heading}</p>}
            {para && <p>{para}</p>}
          </Dragger>
        )}
      </Form.Item>
    </React.Fragment>
  )
}//End function

//It's return fields name as array
export const AntFieldsName = (object, dynamicObjName = false) => {
  //#Adding specific class on every form element which is given-------------------#//
  var form = document.querySelector("form");
  var elements = form.querySelectorAll(
    ".ant-select, input, textarea, select, .ant-calendar-picker, .ant-radio-group"
  );
  //Add class in every element
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.add("_form_field");
  } //End for loop
  //#------------------------------------------------------------------------------#//

  //#Getting ids of added is because id is the name in Antd form ----#//
  elements = document.querySelectorAll("._form_field");
  var names = [].map.call(elements, elem => {
    return elem.id;
  });
  //#----------------------------------------------------------------#//

  //If object has value then fetch specific object values according to field names
  if (object) {
    let obj = {};
    for (i = 0; i < names.length; i++) {
      obj[names[i]] = object[names[i]];
    } //End for loop

    if (dynamicObjName && object[dynamicObjName]) {
      obj = { ...obj, ...AntDynamicFieldsGet(object, dynamicObjName) };
    }//End if condition

    return obj;
  } else {
    return names;
  } //End if condition
}; //End function

export const AntDynamicField = ({ name, formProps, fieldRender, label }) => {
  return (
    <DynamicField name={name} label={label} formProps={formProps} fieldRender={fieldRender} />
  );
};

export const AntDynamicFieldsGet = (data, objName) => {
  return AntDynamicFieldGet(data, objName);
}

export const AntDynamicFieldsSet = (values, dynamicFieldName) => {
  return AntDynamicFieldSet(values, dynamicFieldName);
}

export const AntDynamicFieldsOpen = (values) => {
  return AntDynamicFieldOpen(values);
}
//export default Form.create()(FormServices);
