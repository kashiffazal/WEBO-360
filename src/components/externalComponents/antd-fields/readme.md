/*Select*/
<AntInput 
name="description" 
label="Description" 
formProps={fp} 
placeholder="Add some description" 
noRequired={true} />

<AntInput 
filter={true}
type="select"
label="Select ESPS Server"
name="esps_server_name"
formProps={fp}
options={st.esps_server_list} 
setValueLabel={['id','server_name']}
mode={true} //Hide -Select- option (default is false)
/>

<AntInput
  name="anotherSourceOfFunding"
  type="radio"
  label="Will another source of funding be used (either instead of or in addtion to NDIS funding)?"
  vertical
  radioOptions={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ]}
  formProps={props.formProps}
/>


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
  format = "DD/MM/YYYY",
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