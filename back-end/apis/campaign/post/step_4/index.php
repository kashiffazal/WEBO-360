<?php

  if(@$_GET['app_no_session'] == 'true'){
    $app_no_session = true;
    $session_user_id = @$_GET['session_user_id'];
    $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition
    
  include "../../../../others/config.php";
  include "../../../../ESPS_apis/functions.php";
  include "./functions.php";
  require_once('../../../../plugins/PHPMailer_v5.1/class.phpmailer.php'); //library added in download source

  $campaign_id = $_GET['id'];
  
  #Getting campaign data -------------------------------#
  $cd = get_campaign_data('*',$campaign_id);//print_r($cd);die();

  #Getting user data -------------------------------#
  $ud = getUserData($cd['inserted_by']);//print_r($ud);die();

  #Getting Template Links from DB
  $tl = getTemplateLinkFromDB($cd['id']);//print_r($tl);die();

  #Getting list of emails by list_ref_id data -------------------------------#
  $uEmails = getEmailListByList_ref_id($cd['list_ref_id'],$campaign_id,$tl);
  $uEmails = $uEmails['email_list'];//print_r($uEmails);die();

  #Getting all templates 
  $tFold = "../../../../uploaded_files";
  $cTemp = tagDecode(companyTagsDecode(getAllTemplate('template',$tFold,true)),array('subject' => $cd['subject_line']));//echo $cTemp;die();
  $cPlan = @getAllTemplate('plaintext',$tFold,true);//echo $cPlan;die();
  $eTemp = getAllTemplate('template',$tFold,false);//echo $eTemp;die();
  $ePlan = @getAllTemplate('plaintext',$tFold,false);//echo $ePlan;die();

  #Get ESPS credentials data
  $ESPSC = getESPScred($cd['esps_sr_id'], $cd['esps_sr_ac_id']);//print_r($ESPSCred);die();

  #Set Template with shorter links with DB
  $eTemp = setTemplateWithDBLinks($eTemp,getTemplateLinkFromDB($cd['id']),$ud['subDomain'],false,array(),$ESPSC['link_domain_path']);//echo $eTemp;die();

  #Set API array
  $sd = array();
  $sd['from_name']        = $cd['fromName'];
  $sd['from_email']       = $cd['fromEmail'];
  $sd['replay_to_name']   = $cd['replayToName'];
  $sd['replay_to_email']  = $cd['replayToEmail'];
  $sd['subject']          = $cd['subject_line'];
  $sd['campaign_id']      = $cd['id'].'-'.randCode(4).'-category';
  $sd['to']               = $uEmails;
  $sd['content']          = $eTemp;
  $sd['plaintext']        = $ePlan;
  #Check first ESPS $ESPSC['link_domain_path'] then $ud['subDomain'] and $clientDomainForLink
  $sd['unsubscribe_link'] = ($ESPSC['link_domain_path'] ? $ESPSC['link_domain_path'] : ($ud['subDomain'] ? $ud['subDomain'] : $clientDomainForLink))."/u/";
  $apiArr                 = createESPSarrayApi($sd);//print_r($apiArr);die();
  

  // print_r($cd['esps_sr_id']);
  // print_r($ESPSC);
  // print_r($apiArr);
  // die();

  #Send campaign
  $res = sendEmailViaESPS($cd['esps_sr_id'],$ESPSC,$apiArr);
  //print_r($res);die();
  if($res['status']){
    #Remove cronjob from cPanel if it was scheduled
    $crs = array();
    if($cd['cronJob_status'] == 'added'){
      include "../../../../cPanel/function.php";
      remove_cron_job($cd['cronJob_id']);
      $crs = array('cronJob_status' => 'remove_and_send');
    }//End if condition

    //Update other info into DB before sending campaign
    $updateArr = array_merge(array('id' => $campaign_id, 'link_domain_path' => $ESPSC['link_domain_path'],'recipientsCount' => (string) sizeof($uEmails), 'bounceCount' => '0','cronJob_status' => '','status' => 'sent', 'sent_date' => $server_date,'sent_time' => $server_time,'sent_by' => $ud['id'], 'server_campaign_id' => $res['esps_send_id']),$crs);
    $update = dbQuery("post",$updateArr,$campaign_table);
    $res = array(
      'status' => true,
      'successTitle' => 'Success',
      'successMsg' => 'Campaign has been sent successfully',
      'successNotifyType' => 'notify',
      'successNotify' => true,
      'data' => array_merge($updateArr,array(
        'sendType' => $cd['sendType'],
        'confirmationEmail' => $cd['confirmationEmail']
      ))
    );
    $res['confirmation'] = emailPHPMailer(
        array('name' => $ud['fromName'], 'email' => $ud['fromEmail']),
        array(array('name' => $ud['first_name']." ".$ud['last_name'], 'email' => $cd['confirmationEmail'])),
        array('subject' => $cd['campaign_name']." has been sent successfully",'body' => $cTemp,'plaintext' => $ePlan),
        $SMTPCred
    );//End calling function
  }//End if condition

  echo json_encode($res);

?>