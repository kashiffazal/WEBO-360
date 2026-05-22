/*eslint-disable no-useless-escape*/
/*eslint-disable no-unreachable*/

//import React from 'react';
//import { Link } from 'react-router-dom';

import axios from 'axios';
import { notification, message } from 'antd';

const Services = {
  http: (method, url, data, raffData, hideErrorMsg = false) => {
    url = window.domainPath + '/apis/' + url;
    return axios({
      method, url, data,
      //Send browser cookies created by php session (withCredentials: true)
      //If you remove this then php session will not be pass to another php page
      withCredentials: true,
    }).then(res => {
      //console.log(res.data);
      res = res.data;
      if (raffData) { console.log(res); }//Show raff data in console
      if (res.consoleLog) {
        console.log(url);
        console.log(res);
      }//End if condition
      if (res.status) {
        return Services.handelRequest(res, 200, url);
      } else {
        return hideErrorMsg ? false : Services.handelRequest(res, 400, url);
      }//End if condition
    }).catch(error => {
      return hideErrorMsg ? false : Services.handelRequest(error, 404, url);
    });
  },//End function
  handelRequest: (res, statusCode, url = '') => {
    if (statusCode === 200) {
      /** If it's allow to show message/notification */
      if (res.successNotify) {
        if (res.successNotifyType === 'notify') {
          notification['success']({ message: res.successTitle || 'Success', description: res.successMsg || 'Request has been completed.', duration: res.successDuration || 5 });
        } else {
          message.success(res.successMsg || 'Request has been completed.', res.successDuration || 5);
        }//End if condition
      }//End if condition
      return res;
    }//End if condition for statusCode 200

    if (statusCode === 400) {
      console.log(url);
      console.log(res);
      /** If it has database error then redirect to Error page*/
      if (res.errorType === 'db-error') {
        window.location.href = "#/error";
        /** If it has session error then popup login screen*/
      } else if (res.errorType === 'session-error') {
        window.sessionExpire = true;
        return false;
      } else {

        /** Define the notify type as message/notification */
        if (res.errorNotifyType && res.errorNotifyType === 'message') {
          message.error(res.errorMsg || 'There are some error.', res.errorDuration || 10);
        } else {
          notification['error']({ message: res.errorTitle || 'Error', description: res.errorMsg || 'There are some error', duration: res.errorDuration || 10 });
        }//End if condition
        return false;
      }//End if condition
    }//End if condition for statusCode 400

    if (statusCode === 404) {
      //console.log(res);
      //console.log(url);
      notification['error']({
        message: 'Error: Could not connect to Host',
        description: 'Please check your internet connection and try again',
        duration: 10,
        style: { width: 450, marginLeft: 335 - 400 },
      });
      return false;
    }//End if condition for statusCode 404
  },//End function
  filterArray: (value, arr, filterBy, holdVariableName) => {
    if (value.length === 1) {
      if (!window[holdVariableName]) { window[holdVariableName] = arr; }//End if condition
    }//End if condition
    //console.log(window.holdFilterData);
    arr = window[holdVariableName];
    const filteredData = arr.filter(function (item) { return item[filterBy].toLowerCase().search(value.toLowerCase()) !== -1; });
    return filteredData;
  },//End function
  randomAlphaNumber: (count, upperCase) => {
    if (!count) { count = 5; }
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < count; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
    if (upperCase) {
      return text.toUpperCase();
    } else {
      return text;
    }//End if condition
  },//End function
  secToTime: (sec) => {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  },//End function

  encode64: (input) => {
    input = escape(input);
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
  },//End function

  decode64: (input) => {
    if (!input) { return false; }
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return unescape(output);
  },//End function

  saveArrLocalStorage: (arr, redirect = false, storageName = false) => {
    let storageData = Services.checkStorageOrCreate();
    //If storageName is available then use is otherwise create it.
    if (!storageName) { storageName = Services.randomAlphaNumber(6, true); }
    storageData[storageName] = arr;
    localStorage.setItem(window.appLocalStorage, Services.encode64(JSON.stringify(storageData)));
    if (redirect) {
      window.location.href = "/#" + redirect + "/" + storageName;
    } else {
      return storageName;
    }//End if condition
  },//End function

  loadArrLocalStorage: (storageName, redirect = true, routeName = false) => {
    let storageData = Services.checkStorageOrCreate();
    if (!storageData[storageName]) {
      if (redirect) {
        routeName ? window.location.href = "/#" + routeName : window.history.go(-2);
      }//End if condition
      return false;
    }
    return storageData[storageName];
  },//End function

  setUserData: (userData) => {
    let storageData = Services.checkStorageOrCreate();
    storageData.ud = userData;
    storageData = Services.encode64(JSON.stringify(storageData));
    localStorage.setItem(window.appLocalStorage, storageData);
  },//End function

  getUserData: () => {
    let ud = JSON.parse(Services.decode64(localStorage.getItem(window.appLocalStorage))).ud;
    if (!ud) {
      window.location.href = "#/login";
      return false;
    }//End if condition
    return ud;
  },//End function

  /*Check Storage is just inner function for services to check main app storage is created or not
  If is not created the create it with empty object*/
  checkStorageOrCreate: () => {
    let storageData = Services.decode64(localStorage.getItem(window.appLocalStorage));
    storageData = (storageData ? JSON.parse(storageData) : {});
    return storageData;
  },//End function

  fileDownload: (path, fileName) => {
    var element = document.createElement('a');
    element.setAttribute('href', path);
    element.setAttribute('target', '_blank');
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    //console.log(element);
    element.click();
    document.body.removeChild(element);
  },//End function

  accessControl: (ubac_id) => {
    var permissions = Services.getUserData().pc;
    if (!permissions) { return false; }
    if (permissions.trim() === 'all') { return true }
    permissions = permissions.split(',');
    for (var i = 0; i < permissions.length; i++) {
      if (ubac_id === parseInt(permissions[i], 0)) { return true; break; }//end if condition
    }//End for loop
    return false;
  },//end function

  post_obj: (values, uploadable_file, colName) => {
    const postObj = new FormData();
    if (uploadable_file) { postObj.append(colName, uploadable_file, uploadable_file.name); }//End if condition//Adding file if available
    Object.keys(values).forEach(function (key) { postObj.append(key, values[key]); });//Appending values in postObj
    return postObj;
  },//End function

  getCurrentYear: () => {
    const dt = new Date();
    return dt.getFullYear();
  },//End function

  validateEmail: (inputText) => {
    if (inputText.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return true;
    } else { return false; }
  },//End function

  find_duplicate_in_array: (array, skipDuplicateSingleValue = false) => {
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
    //console.log(findDuplicates(array)) // All duplicates
    let duplicateValues = [...new Set(findDuplicates(array))]// Unique duplicates
    if (skipDuplicateSingleValue) {
      for (var i = 0; i < duplicateValues.length; i++) {
        if (duplicateValues[i].trim() === skipDuplicateSingleValue.trim()) {
          duplicateValues.splice(i, 1);
          break;
        }//End if condition
      }//End for loop
    }//End if condition
    return duplicateValues;
  },//End function

  copyOnClick: (e) => {
    var inp = document.createElement('input');
    document.body.appendChild(inp);
    inp.value = e.target.textContent;
    inp.select();
    document.execCommand('copy', false);
    inp.remove();
    message.config({ duration: 5, maxCount: 3, });
    message.success(e.target.textContent + ' copied.');
  },//End function

  numbersToLettersAscii: (num) => {
    return num
      .toString()    // convert number to string
      .split('')     // convert string to array of characters
      .map(Number)   // parse characters as numbers
      //.map(n => (n || 10))   // convert to char code, correcting for J
      .map(c => {
        //alert(c);
        if (c === 0) {
          //Converting 0 to @
          return String.fromCharCode(c + 64);
        } else {
          return String.fromCharCode(c + 96);
        }//End if condition

      })   // convert char codes to strings
      .join('');     // join values together
  },//End function

  getObjectFromArr: (value, equalTo, arr) => {
    for (var i = 0; i <= arr.length; i++) {
      if (value.toString().trim() === arr[i][equalTo].toString().trim()) {
        return arr[i];
        break;
      }//End if condition
    }//End for loop
  },//End function


  deleteRowFromArrById: (arr, id) => {
    let data = [...arr];
    var dataIndex = data.findIndex(x => x['id'] === id);
    delete data[dataIndex];
    data = data.filter(function (val) { return val });
    return data;
  },//End function

  updateRowInList: (row, listArr, idName = 'id') => {
    listArr = [...listArr];
    var dataIndex = listArr.findIndex(x => x[idName] === row[idName]);
    listArr[dataIndex] = { ...listArr[dataIndex], ...row };
    //console.log(listArr);
    return listArr;
  }//End function


}//End Services

export default Services;
