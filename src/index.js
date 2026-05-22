import React from 'react';
import ReactDOM from 'react-dom';

//import Redux methods
import { Provider } from 'react-redux';
import Store from './store';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import './css/ant-modified.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import HttpsRedirect from 'react-https-redirect';


//Set domain path into browser variable
if(process.env.NODE_ENV !== 'production'){
  window.domainPath = process.env.REACT_APP_DOMAIN_DEV;
  window.domainPathLink = process.env.REACT_APP_LINK_DOMAIN_DEV;
}else{
  window.domainPath = process.env.REACT_APP_DOMAIN_PRO;
  window.domainPathLink = process.env.REACT_APP_LINK_DOMAIN_PRO;
}//End if condition
window.appLocalStorage = process.env.REACT_APP_LOCALSTORAGE;
window.htmlTagsLocalStorage = '3jdk#di3';

ReactDOM.render(
  <Provider store={Store}>
    <HttpsRedirect>
      <App />
    </HttpsRedirect>
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
