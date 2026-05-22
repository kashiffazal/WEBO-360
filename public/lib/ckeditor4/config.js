/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.extraPlugins = 'codemirror';
	//config.extraPlugins = 'filebrowser';
	config.filebrowserBrowseUrl = 'http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/uploaded_files/t-i/';
	config.filebrowserUploadUrl = 'http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/apis/campaign/post/ckeditor4FileUpload.php';
	config.filebrowserUploadMethod = "form";
	//config.extraPlugins = 'imageuploader';

	config.fillEmptyBlocks = false;//Avoiding '&nbsp';
	//config.autoParagraph = false;
	//config.ignoreEmptyParagraph = true;

	//config.enterMode = CKEDITOR.ENTER_BR;
	//config.shiftEnterMode = false;

	CKEDITOR.on('instanceReady', function (ev) {
		var writer = ev.editor.dataProcessor.writer;
		// The character sequence to use for every indentation step.
		writer.indentationChars = '  ';
		var dtd = CKEDITOR.dtd;
		// Elements taken as an example are: block-level elements (div or p), list items (li, dd), and table elements (td, tbody).
		for (var e in CKEDITOR.tools.extend({}, dtd.$block, dtd.$listItem, dtd.$tableContent)) {
			ev.editor.dataProcessor.writer.setRules(e, {
				// Indicates that an element creates indentation on line breaks that it contains.
				indent: false,
				// Inserts a line break before a tag.
				//breakBeforeOpen: false,
				// Inserts a line break after a tag.
				//breakAfterOpen: false,
				// Inserts a line break before the closing tag.
				breakBeforeClose: false,
				// Inserts a line break after the closing tag.
				breakAfterClose: false
			});
		}//for loop
		for (var e in CKEDITOR.tools.extend({}, dtd.$list, dtd.$listItem, dtd.$tableContent)) {
			ev.editor.dataProcessor.writer.setRules(e, { indent: true, });
		}
	});

	config.fullPage = true;//Create full HTML document
	config.allowedContent = true;
	config.font_names = 'Arial;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana';
	config.extraAllowedContent = 'unsubscribe';

};
