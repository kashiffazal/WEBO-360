import React, { Component } from 'react';
import { Form, Input, Button, Icon, Radio, Upload, Row, Col, Checkbox, Spin } from 'antd';
import CampaignServices from '../../../campaign_services';
import Header from '../../header';
import '../../../styles.css';
import Services from '../../../../../services';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CreateCampaignStep2 extends Component {
	constructor(props) {
		super(props); 
		this.state = {
			nextBtnLoader: false,
			loader: false,
			template_type: 'importFromPC',
			template_url: '',
			uploadableFile: null,
			template_file_name: null,
			fileTypeError: null,
			//preview: null,
			holdRadioValue: null,
			fileMissingError : null,
			refetchFromURL : false,
			recreateTemplate : false,
		};
	}//End constructor

	submitForm = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) { console.log(err); }//End if condition
			const st = this.state;
			//If nothing is changed then do not hit server API --------------------//
			if((st.template_type === st.holdRadioValue && st.template_file_name)){
				if(
					(st.template_type === 'importFromPC' && !st.uploadableFile) || 
					(st.template_type === 'importFromURL' && !st.refetchFromURL) ||
					(st.template_type === 'composeHTML' && !st.recreateTemplate)
				){
					//CampaignServices.localStorageDecode().snp ? 
					//this.props.history.push('/app/createCampaign/step3/snapshot') : 
					this.props.history.push('/app/createCampaign/step2/template');
					return false
				}else{
					if(st.template_type === 'composeHTML' && st.recreateTemplate){
						this.props.history.push('/app/createCampaign/step2/editor');
						return false
					}//End if condition
				}//End if condition
			}//End if condition
			//----------------------------------------------------------------------//

			//Showing error if file or url is not provided -------------------------//
			if(st.template_type !== st.holdRadioValue){
				if(st.template_type === 'importFromPC' && !st.uploadableFile){
					this.setState({fileMissingError : 'Please upload template'});return false;
				}//End if condition
			}//End if condition
			if(st.template_type === 'importFromURL' && !st.template_url){
				this.setState({fileMissingError : 'Please provide url'});return false;
			}//End if condition
			this.setState({fileMissingError : null});
			//---------------------------------------------------------------------//

			values.template_type = st.template_type;
			values.template_url = st.template_url;
			values.refetchFromURL = st.refetchFromURL;
			values.id = CampaignServices.localStorageDecode().cid;

			let postObj = {};
			if(st.template_type === 'importFromPC') {
				postObj = Services.post_obj(values,st.uploadableFile,'template_file_name');
			}else{
				postObj = new FormData();
				Object.keys(values).forEach(function (key) { postObj.append(key, values[key]); });
			}//End if condition

			this.setState({ nextBtnLoader: true });
			Services.http('post','campaign/post/step_2/index.php', postObj).then(res => {
				this.setState({ nextBtnLoader: false});
				if(!res){return false;}
				this.setState({uploadableFile: null });
				if(st.template_type === 'composeHTML'){
					this.props.history.push('/app/createCampaign/step2/editor');
				}else{
					this.props.history.push('/app/createCampaign/step2/template');
				}//end if condition
			});

		});//End form properties
	}//End fucntion


	_handleRadioOnChange = (value) => {
		this.setState({ template_type: value });
		if(value === 'importFromPC'){this.setState({ uploadableFile: null })}
	}//End function


	render() {

		const props = {
			onRemove: (file) => { this.setState({ uploadableFile: null }); },
			accept : "text/html",
			beforeUpload: (file) => { 
				if(file.type === 'text/html'){
					this.setState({ uploadableFile: file, fileTypeError:'' });
				}else{
					this.setState({ template_type: null }, () => {
						this.setState({ uploadableFile: null, template_type: 'importFromPC', fileTypeError:'Selected file is not an HTML template'})
					})
				}//End if condition
				return false;
			}
		};
		const st = this.state;
		const campaign_id = CampaignServices.localStorageDecode().cid;
		return (
			<div className="c_c_container">
				<Spin spinning={st.nextBtnLoader || st.loader}>
					<Header title="Choose a starting point" desc={CampaignServices.localStorageDecode().cn} stepNumber={2} />
					<Form onSubmit={this.submitForm}>
						<Row gutter={20}>
							<Col lg={2} md={1} sm={24} xs={24}></Col>
							<Col lg={20} md={22} sm={24} xs={24}>

								<RadioGroup className="w-full" onChange={(e) => this._handleRadioOnChange(e.target.value)} value={st.template_type}>
									<Row gutter={10}>
										<Col lg={8} md={12}>
											<RadioButton className="radio_block" value={'importFromPC'}>
												<h2 className="m-0 dis-inline-block">Import from my computer</h2>
												<p>Your HTML page must contain as 'ubsubscribe tag', otherwise we will add one for you.</p>

												{st.template_type === 'importFromPC' ? 
													<span>
														{st.holdRadioValue === 'importFromPC' ? (st.template_file_name ? <p className="dis-block"><br/><b>Uploaded Template</b><br/> <a onClick={() => CampaignServices.openPreview(campaign_id)}>View Template</a></p> : '') : ''}
														<Upload {...props}><Button type="primary" disabled={st.uploadableFile}><Icon type="upload" /> Select File </Button></Upload>
														{st.fileTypeError ? <div className="fs-11" style={{'color':'red'}}>{st.fileTypeError}</div> : ''}
													</span>
													: ''
												}												
											</RadioButton>
										</Col>
										<Col lg={8} md={12}>
											<RadioButton className="radio_block" value={'importFromURL'}>
												<h2 className="m-0 dis-inline-block">Import from the web</h2>
												<p>This is the current address of your campaign on the web.</p>

												{st.template_type === 'importFromURL' ? 
													<span>
														{st.holdRadioValue === 'importFromURL' ? (st.template_file_name ? <p className="dis-block"><br/><b>Provided URL Template</b><br/> <a onClick={() => CampaignServices.openPreview(campaign_id)}>View Template</a></p> : '') : ''}
														<Input type="url" disabled={st.holdRadioValue && !st.refetchFromURL} className="text-center" placeholder="https://www.demo.com/templates" value={st.template_url} onChange={(e) => this.setState({ 'template_url': e.target.value })} />
														{st.template_type === st.holdRadioValue &&
															<div className="text-left">
																<Checkbox onChange={(e) => this.setState({refetchFromURL : e.target.checked})}>Refetch template from url</Checkbox>
															</div>
														}
													</span>
													:''
												}
											</RadioButton>
										</Col>
										<Col lg={8} md={24}>
											<RadioButton className="radio_block" value={'composeHTML'}>
												<h2 className="m-0 dis-inline-block">Create Template</h2>
												<p>You can create your own template using Text or HTML editor</p>
												{st.holdRadioValue === 'composeHTML' ? 
													<span>
														{st.template_file_name ? <p className="dis-block"><br/><b>Created Template</b><br/> <a onClick={() => CampaignServices.openPreview(campaign_id)}>View Template</a></p> : ''}
														{st.template_type === st.holdRadioValue &&
															<Checkbox onChange={(e) => this.setState({recreateTemplate : e.target.checked})}>Edit created template?</Checkbox>
														}
													</span>
												: ''}

											</RadioButton>
										</Col>
									</Row>
								</RadioGroup>

								
								<hr className="hr-dashed m-t-0 m-b-30"/>
								
								<Row gutter={30} className="btn_container">
									<Col lg={4} md={6} sm={9} xs={24}>
										{CampaignServices.localStorageDecode().snp ?
											<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step3/snapshot')}> <Icon type="left" />Back </Button> : 
											<Button className="w-full" size="large" type="primary" onClick={() => this.props.history.push('/app/createCampaign/step1')}> <Icon type="left" />Previous </Button>
										}{/** End snapshot edit condition*/}

									</Col>
									<Col lg={16} md={12} sm={6} xs={24}>
										<div>{st.fileMissingError}</div>
									</Col>
									<Col lg={4} md={6} sm={9} xs={24}>
										<Button className="w-full" size="large" type="primary" loading={st.nextBtnLoader} htmlType="submit">
											<span>Import{st.nextBtnLoader ? '' : <Icon type="right" />}</span>
										</Button>
									</Col>
								</Row>

							</Col>
							<Col lg={2} md={1} sm={24} xs={24}></Col>
						</Row>
					</Form>
				</Spin>
			</div>
		)//End return
	}//End render

	componentWillMount() {

		const id = CampaignServices.localStorageDecode().cid;
		if(!id || id === '0') { return false; }

		this.setState({ loader: true })
		Services.http('get','campaign/get/create_form/step_2/index.php?id='+id).then(res => {
			this.setState({ loader: false });
			if(!res){return false;}
			res = res.data;
			//console.log(res);
			if(res.template_type){
				this.setState({
					template_type: res.template_type,
					template_file_name: res.template_file_name,
					template_url: res.template_url,
					//preview : res.preview,
					holdRadioValue: res.template_type
				});
				//Remove url from input field if it's not selected
				if(this.state.holdRadioValue !== 'importFromURL'){this.setState({template_url : '',refetchFromURL : true });}//End if condition
			}//End if condition
		});
		this.setState({ campaign_name: CampaignServices.localStorageDecode().cn });
	}//End componentWillMount


}//End class

export default Form.create()(CreateCampaignStep2);