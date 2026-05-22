const INITIAL_STATE = {
  showLoginScreen: false,
  application_data: {
    app_name: 'WEBO 360 Mailer',
    app_title: 'WEBO 360 Mailer',
    site_url: 'https://www.webo360mailer.com/',
    blockHTML: '<h1>Blocked</h1>',
    blockStatus: false,
    maintenanceHTML: '<h1>Maintenance</h1>',
    maintenanceStatus: false,
    powered_by_link: 'https://www.weboinboxingsolutions.com/',
    powered_by_name: 'WEBO Inboxing Solutions'
  },
  developedByRouteName: 'developedBy',
  /*Other app values*/
  ud: {},
}

export default (states = INITIAL_STATE, action) => {
  var res = { ...states };
  res[action.type] = action.payload;
  return (res ? res : states);
  // switch(action.type){
  //   case 'name' : return({...states,name : action.payload}); break
  //   case 'broName' : return({...states,broName : action.payload}); break
  //   default: return states;
  // }
}
