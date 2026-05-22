/*eslint-disable no-script-url*/
import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from 'jquery';
import AccessControl from '../../externalComponents/user-base-access-control';
import './header.css';

const PrimaryHeader = () =>{
  $(".unCheck").click(function(){
    $("#menu").prop("checked", false);
  });
  return(
    <div className="primaryHeader">

      <label htmlFor="menu" className="icon">
        <span>Navigation Menu</span>
        <i className="fa fa-bars"></i>
      </label> 
      <input type="checkbox" id="menu"/>

      <div id="navigation" className="navigationMenuMob">
        <NavLink className="link unCheck" exact to="/app/overview"><i className="fa fa-th"></i> Overview</NavLink>
        <AccessControl>
          <NavLink ubac_id={16} className="link unCheck" exact to="/app/campaign"><i className="fa fa-send"></i> Campaign</NavLink>
          <NavLink ubac_id={12} className="link unCheck" to="/app/subscribers"><i className="fa fa-user-plus"></i> List & Subscribers</NavLink>
          <NavLink ubac_id={32} className="link unCheck" to="/app/reports"><i className="fa fa-th-list"></i> Reports</NavLink>
        </AccessControl>
      </div>
    </div>
  );
}

export default PrimaryHeader;
