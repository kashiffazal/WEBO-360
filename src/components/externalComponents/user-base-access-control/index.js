/*eslint-disable no-unreachable*/
import React, { Component } from 'react';
import Services from '../../services';

class UserBaseAccessControl extends Component {


  returnOnPermissionId = () => {
    const ch = this.props.children;
    if(ch !== undefined){
      if(ch.length && ch.length > 1){
        let arr = [];
        for(var i=0; i<ch.length;i++){
          if(this.permissionCheck(ch[i].props.ubac_id)){arr.push(ch[i]);}
        }//End for loop
        return arr;
        //alert('array');
      }else{
        return this.permissionCheck(ch.props.ubac_id) ? ch : false;
      }
    }//End if condition
    return false  
  }//End function
  

  permissionCheck = (pid) => {
    if(pid){
      var permissions = "";
      if(this.props.temper){
        permissions = this.props.temper;
      }else{
        permissions = Services.getUserData().pc;
      }//End if condition
      if(!permissions){return false;}
      if(permissions.trim() === 'all'){return true}
      permissions = permissions.split(',');

      for(var i = 0; i < permissions.length; i++){
        if(pid === parseInt(permissions[i],0)){return true;break;}//end if condition
      }//End for loop
      return false;
    }else{return true;}
  }//end function

  render() {
    return (<React.Fragment>{this.returnOnPermissionId()}</React.Fragment>);//End return
  }//End render
}//End class

export default UserBaseAccessControl;