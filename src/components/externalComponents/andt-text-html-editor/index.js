import React, { Component } from 'react';
import { Tabs } from 'antd';
//Editor # 1
//import { Editor } from '@tinymce/tinymce-react';
//Editor # 2 - CKEditor - 4
import CKEditor from 'ckeditor4-react';
//Editor # 3 - CKEditor - 5
//import CKEditor from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@kashiffazal/ckeditor5-build';

//CodeMirror editor -----------------------//
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';
//import 'codemirror/keymap/emacs';
//import 'codemirror/keymap/vim';
//-----------------------------------------//
import "./css/styles.css";

const TabPane = Tabs.TabPane;

//Editor # 2 - CKEditor - 4 configuration
CKEditor.editorUrl = `${process.env.PUBLIC_URL}/lib/ckeditor4/ckeditor.js`;




class HTMLEditor extends Component {

	state = {
		apiKey: 'zvk0g5o1ku41uigk1i66of6md5s0x4x6jpm32tpfsnobfkgp',
		editorPlugins: 'preview fullpage directionality fullscreen image link table charmap hr insertdatetime advlist lists wordcount',
		editorToolbar: 'formatselect | bold italic underline removeformat strikethrough forecolor | image table charmap hr insertdatetime | link unlink | numlist bullist | alignleft aligncenter alignright alignjustify | fontselect | fontsizeselect | preview fullpage directionality fullscreen wordcount',
		htmlCode: '',
		transferCode: '',
		htmlHold: this.props.value,
		CKEditor4Toolbar: {
			toolbar: [
				{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'RemoveFormat'] },
				{ name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'PageBreak'] },
				{ name: 'links', items: ['Link', 'Unlink'] },
				{ name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
				{ name: 'styles', items: ['Format', 'Font', 'FontSize', 'TextColor'] },
				{ name: 'document', items: [/*'Source', */'Preview'] },
			]
		},
		CKEditor4Refresh: true
		//allowChangeInHTML: true
	}

	codeMirrorOptions = {
		mode: 'htmlembedded',
		keyMap: 'sublime',
		//mode: 'javascript',
		//mode: 'string',
		//theme: 'darcula',
		lineNumbers: true,
		lineWrapping: true
	}

	tagConvert = (html, type) => {
		if (this.props.tagConvert) {
			var tags = this.props.tagConvert;
			if (html) {
				if (type === 'html') {
					tags.forEach((i) => { html = html.split(i.template).join(i.html); });
				} else {
					tags.forEach((i) => { html = html.split(i.html).join(i.template); });
				}//End if condition
			}
		}//End if condition
		return html;
	}//End if condition

	_handleOnChange = (value, type) => {
		if (type === 'editor') {
			//Change line break from <p>&nbsp;</p> to <br/>
			//value = value.replace(/<p>&nbsp;<\/p>/g, '<br/>');
			//this.setState({ allowChangeInHTML: true });
		}//End if condition
		//console.log(value);
		this.setState({ htmlCode: value, htmlHold: value }, () => { this.props.onChange(value); });
	}//End function
	_handleOnTabChange = (key) => {
		//console.log(this.state.htmlCode);
		if (this.state.htmlCode) {
			var data = '';
			if (key === '1') {//Text Editor
				data = this.tagConvert(this.state.htmlCode, 'template');
				//data = data.replace(/<br\/>/g, '<p>&nbsp;</p>');
				this.setState({ transferCode: data });
			} else {//HTML Editor
				data = this.tagConvert(this.state.htmlCode, 'html');
				//data = data.replace(/<\/p><p>/g, '</p>\n<p>');
				//data = this.changeInHTML(data);
				this.setState({ htmlCode: data });
			}//End if condition
			if (this.props.tabChangeHandle) { this.props.tabChangeHandle(key); }
		}//End if condition
	}//End function

	CKEditor4RefreshOnLoad = () => {
		this.setState({ CKEditor4Refresh: false }, () => {
			this.setState({ CKEditor4Refresh: true });
		})
	}//End function

	// changeInHTML = (html) => {
	// 	if (this.state.allowChangeInHTML) {
	// 		//Adding line break after each paragraph
	// 		// html = html.replace(/<\/p>/g,'</p>\n');
	// 		this.setState({ changedInHTML: false });
	// 	}//End if condition
	// 	return html;
	// }//End function

	render() {
		return (
			<div className="c_k_editor_0">
				{this.props.get === 'text-editor' &&
					<div className="singleContainer">
						{this.props.label && <div className="singleCodeEditorTitle">{this.props.label}</div>}
						{/* <Editor
							apiKey={this.state.apiKey}
							//initialValue=""
							init={{ menubar: false, height: this.props.height ? this.props.height : '480px', plugins: this.state.editorPlugins, toolbar: this.state.editorToolbar }}
							value={this.state.transferCode}
							onChange={(e) => this._handleOnChange(e.target.getContent(), 'editor')}
						/> */}

						{/* <div style={{ height: (this.props.height ? this.props.height : '460px') }} className="CKEditor5_styles">
							<CKEditor
								editor={ClassicEditor}
								data={this.state.transferCode}
								// You can store the "editor" and use when it is needed.
								//onInit={editor => {console.log('Editor is ready to use!', editor);}}
								//onChange={(event, editor) => { }}
								onBlur={(event, editor) => {
									let data = editor.getData();
									this._handleOnChange(data, 'editor')
								}}
							//onFocus={(event, editor) => {console.log('Focus.', editor);}}
							/>
						</div> */}
						<div style={{ height: (this.props.height ? this.props.height : '460px') }} className="CKEditor4_styles">
							{this.state.CKEditor4Refresh &&
								<CKEditor
									onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
									data={this.state.transferCode}
									//type="classic" //type="inline"
									config={this.state.CKEditor4Toolbar}
									//onBlur={(event) => { this._handleOnChange(event.editor.getData(), 'editor') }}
									onChange={(event) => { this._handleOnChange(event.editor.getData(), 'editor') }}
								/>
							}
						</div>
					</div>
				}
				{this.props.get === 'code-editor' &&
					<div className="singleContainer">
						{this.props.label && <div className="singleCodeEditorTitle">{this.props.label}</div>}

						<div style={{ 'height': this.props.height ? this.props.height : '480px', 'border': '1px solid #e8e8e8' }}>
							<CodeMirror
								className="htmlCodeEditor"
								value={this.state.htmlCode}
								options={this.codeMirrorOptions}
								onBeforeChange={(e, d, v) => { this._handleOnChange(v, 'html') }}
							//onChange={(editor, data, value) => {this._handleOnChange(value)}}
							/>
						</div>
					</div>
				}

				{!this.props.get &&
					<Tabs defaultActiveKey="1" onChange={this._handleOnTabChange} type={this.props.tabType}>
						<TabPane tab={this.props.tabNames ? this.props.tabNames[0] : 'Text Editor'} key="1">

							<div className="container">
								<div className="subContainer">
									{/* <Editor
										apiKey={this.state.apiKey}
										//initialValue=""
										init={{ menubar: false, height: this.props.height ? this.props.height : '480px', plugins: this.state.editorPlugins, toolbar: this.state.editorToolbar }}
										value={this.state.transferCode}
										onChange={(e) => this._handleOnChange(e.target.getContent(), 'editor')}
									/> */}

									{/* <div style={{ height: (this.props.height ? this.props.height : '460px') }} className="CKEditor5_styles">
										<CKEditor
											editor={ClassicEditor}
											data={this.state.transferCode}
											// You can store the "editor" and use when it is needed.
											//onInit={editor => {console.log('Editor is ready to use!', editor);}}
											//onChange={(event, editor) => { }}
											onBlur={(event, editor) => {
												let data = editor.getData();
												this._handleOnChange(data, 'editor')
											}}
										//onFocus={(event, editor) => {console.log('Focus.', editor);}}
										/>
									</div> */}
									<div style={{ height: (this.props.height ? this.props.height : '460px') }} className="CKEditor4_styles">
										{this.state.CKEditor4Refresh &&
											<CKEditor
												onBeforeLoad={(CKEDITOR) => { (CKEDITOR.disableAutoInline = false) }}
												data={this.state.transferCode}
												//type="classic" //type="inline"
												config={this.state.CKEditor4Toolbar}
												//onBlur={(event) => { this._handleOnChange(event.editor.getData(), 'editor') }}
												onChange={(event) => { this._handleOnChange(event.editor.getData(), 'editor') }}
											/>
										}
									</div>

								</div>
							</div>

						</TabPane>
						<TabPane tab={this.props.tabNames ? (this.props.tabNames[1] ? this.props.tabNames[1] : 'Code Editor') : 'Code Editor'} key="2">

							<div className="container">
								<div className="subContainer" style={{ 'padding': '0px' }}>

									<div style={{ 'height': this.props.height ? this.props.height : '480px' }}>
										<CodeMirror
											className="htmlCodeEditor"
											value={this.state.htmlCode}
											options={this.codeMirrorOptions}
											onBeforeChange={(e, d, v) => { this._handleOnChange(v, 'html') }}
										//onChange={(editor, data, value) => {/*this._handleOnChange(value)*/}}
										/>
									</div>

								</div>
							</div>

						</TabPane>
					</Tabs>
				}
			</div>
		);//End return
	}//End render


	componentWillReceiveProps(nextProps, state) {
		//Update state after dataSource of table (update table after add and delete record)
		if (this.state.htmlHold !== nextProps.value) {
			if (nextProps.value) {
				//console.log(nextProps.value);
				this.setState({
					htmlHold: nextProps.value,
					htmlCode: this.tagConvert(nextProps.value, 'html'),
					transferCode: this.tagConvert(nextProps.value, 'template')
				});
				this.CKEditor4RefreshOnLoad();
			}//End if condition
		}//End if condition
	}//End componentWillReceiveProps.




}//End class



export default HTMLEditor;