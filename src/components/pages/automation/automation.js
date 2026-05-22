import React, { Component } from 'react';
//import CKEditor from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@kashiffazal/ckeditor5-build';

import CKEditor from 'ckeditor4-react';
import './styles.css';

CKEditor.editorUrl = `${process.env.PUBLIC_URL}/lib/ckeditor4/ckeditor.js`;
//CKEditor.editorUrl = './ckeditor4/ckeditor.js';
console.log(`${process.env.PUBLIC_URL}/lib/ckeditor4/ckeditor.js`);


class Automation extends Component {

  render() {

    return (
      <div className="App">
        <h2>Using CKEditor 5 build in React</h2>
        {/* <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          // You can store the "editor" and use when it is needed.
          //onInit={editor => {console.log('Editor is ready to use!', editor);}}
          onChange={(event, editor) => {
            let data = editor.getData();
            //Change line break from <p>&nbsp;</p> to <br/>
            data = data.replace(/<p>&nbsp;<\/p>/g, '<br/>\n');
            //console.log({ event, editor, data });
            console.log(data);
          }}
        //onBlur={(event, editor) => {console.log('Blur.', editor);}}
        //onFocus={(event, editor) => {console.log('Focus.', editor);}}
        /> */}


        <div className="App">
          <h2>Using CKEditor 4 in React</h2>
          <CKEditor
            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
            data="<p>Hello from CKEditor 4!</p>"
            //type="classic"
            //type="inline"
            config={{
              toolbar: [
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'RemoveFormat'] },
                { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'PageBreak'] },
                { name: 'links', items: ['Link', 'Unlink'] },
                { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                { name: 'styles', items: ['Format', 'Font', 'FontSize', 'TextColor'] },
                { name: 'document', items: ['Source', 'Preview'] },
              ]
            }}
          // onBlur={(event) => {
          //   //let data = editor.getData();
          //   console.log(event.editor.getData());
          //   //this._handleOnChange(data, 'editor')
          // }}
          />
        </div>


      </div>
    );
  }
}

export default Automation;
