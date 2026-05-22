import Services from '../../services'
const CampaignServices = {

  renderTemplate: () => {
    const id = CampaignServices.localStorageDecode().cid;
    if (!id || id === '0') { return false; }
    return Services.http('get', 'campaign/get/create_form/mutual/getTemplate.php?id=' + id).then(res => {
      if (!res) { return false; }
      return res.data;
    });
  },//End fucntion

  // tagDecode : (tempHTML) => {
  //   let tagList = Services.loadArrLocalStorage(window.htmlTagsLocalStorage,false);
  //   if(tagList){
  //     tagList.forEach((i) => {tempHTML = tempHTML.split(i.html).join(i.template);});
  //   }//End if condition
  //   return tempHTML;
  // },//End fucntion

  localStorageEncode: (obj) => {
    localStorage.setItem("stdata", Services.encode64(JSON.stringify(obj)));
  },//End fucntion

  localStorageDecode: () => {
    let data = localStorage.getItem('stdata');
    let snapEdit = localStorage.getItem('snp');
    let htmlEditor = localStorage.getItem('hted');
    data = JSON.parse(Services.decode64(data));
    data['snp'] = snapEdit;
    data['hted'] = htmlEditor;
    return data;
  },//End fucntion

  openPreview: (campaign_id, keyword) => {
    if (!campaign_id) {
      alert('Template file is not available.');
      return false;
    }//End if condition
    // let add = `<p>This email was sent to [email address suppressed]. If you are no longer interested you can <unsubscribe class="autokpq" style="background-color:#fff;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;padding-top:5px;padding-bottom:5px;padding-right:5px;margin-top:10px;margin-bottom:10px;margin-right:10px;position:relative;z-index:9999;color:#4277c4;text-decoration:underline;font-weight:bold;">unsubscribe instantly.</unsubscribe></p>`;
    // let html = preview.split('</body>');
    // let parse1 = html[0];
    // let parse2 = html[1];
    //console.log(html);
    //let previewUnsubscribed = parse1+add+"\n</body>"+(parse2 ? parse2 : '');
    //console.log(preview);


    //let previewUnsubscribe = preview;

    // var x = null;
    // if(keyword === 'addsubscribe'){
    //   x = window.open('', '',windowVar);
    //   x.document.body.innerHTML = CampaignServices.tagDecode(previewUnsubscribed);
    // }else if(keyword === 'addsubscribehtml'){
    //   return previewUnsubscribed;
    // }else{

    //let type = 'h';
    //type = 't';
    //type = 'b';
    let windowVar = "location=no,toolbar=0,height=603,width=950";
    let unsubscribe = 's'
    if (keyword === 'view_unsubscribe_tag') {
      unsubscribe = 'u';
    }//End function

    if (keyword === 'current_html_preview') {

      //For current preview html will be at the place of campaign_id
      let current_html_preview = campaign_id;
      var x = window.open('', '', windowVar);
      x.document.body.innerHTML = current_html_preview;

    } else {

      campaign_id = Services.numbersToLettersAscii(campaign_id);
      let user_id = Services.numbersToLettersAscii(Services.getUserData().id);
      let domainPathLinkPrefix = "";
      if (process.env.NODE_ENV === 'production') {
        domainPathLinkPrefix = "https://" + (Services.getUserData().sub_domain ? Services.getUserData().sub_domain + '.' : '');
      }//End if condition
      window.open(domainPathLinkPrefix + window.domainPathLink + '/' + unsubscribe + '-' + user_id + '-' + campaign_id + '/p', '', windowVar);

    }//End if condition




    //}//End if condition

  },//End function

  sendCampaignProgress: (emailList, estimatedTimePerEmailInSecond) => {
    window.progressData = {
      timer: '00:00:00',
      sendingEmailToShow: '',
      percent: 0,
      progressStatus: 'active',
      stopStatus: false
    };
    const emailCount = emailList.length;
    const totalEstimatedTime = (emailCount * estimatedTimePerEmailInSecond); //75sec
    const totalPartial = (100 / totalEstimatedTime) / 5; // per second 1.3333333
    //Timer ------------------------------------------------------//
    let timeCounter = totalEstimatedTime - 1;
    let timeInterval = setInterval(() => {
      if (window.progressData.stopStatus) { clearInterval(timeInterval); }//If stop status is true then stop it
      let timer = Services.secToTime(timeCounter);
      if (timer === '00:00:00') { window.progressData.timer = 'Completed'; clearInterval(timeInterval); } else { window.progressData.timer = timer; }//End if condition
      timeCounter = (timeCounter - 1);
    }, 1000);
    //------------------------------------------------------------//
    //Email ------------------------------------------------------//
    let i = 1;
    window.progressData.sendingEmailToShow = emailList[0]['email'];
    let emailInterval = setInterval(() => {
      if (window.progressData.stopStatus) { clearInterval(emailInterval); }//If stop status is true then stop it
      if (i < emailCount) { window.progressData.sendingEmailToShow = emailList[i]['email']; } else { clearInterval(emailInterval); }//end if condition
      i++;
    }, (estimatedTimePerEmailInSecond * 1000));
    //------------------------------------------------------------//
    //Progress bar -----------------------------------------------//
    let interal = setInterval(() => {
      if (window.progressData.stopStatus) { clearInterval(interal); }//If stop status is true then stop it
      let percent = window.progressData.percent + totalPartial;
      if (percent > 101) {
        percent = 100;
        window.progressData.percent = percent;
        window.progressData.progressStatus = 'success';
        clearInterval(interal);
        //alert('done');
      } else { window.progressData.percent = percent; }//End if condition
    }, 200);
    //------------------------------------------------------------//  

    setTimeout(() => {
      if (window.progressData.stopStatus) {
        window.progressData.percent = 100;
        window.progressData.progressStatus = 'success';
        //this.props.history.push('/app/campaign/1');
      }//If stop status is true then stop it
    }, 3000);

  },//End function

}//End Services

export default CampaignServices;