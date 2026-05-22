<?php

  include "../../../../../others/config.php";
  //$id = $_GET['id'];

  $response = array();

  /** Get user test email ----------------*/
  $res = dbQuery("SELECT email,testEmail FROM $users_table WHERE id = '$session_user_id'");
  if($res['status']){
    $response['status'] = true;
    $response['email'] = ($res['data'][0]['testEmail'] ? $res['data'][0]['testEmail'] : $res['data'][0]['email']);
    /** Get SMTP List ----------------------*/
    $smtp = callAPI("GET",$domainPath."/apis/smtp/get/index.php?id=all&cols=id,name&app_no_session=true&session_id=".$session_user_id,false,true);
    $response['smtp'] = $smtp['data'];
    $res = $response;
  }//End if condition
  
  echo json_encode($res);
  
?>