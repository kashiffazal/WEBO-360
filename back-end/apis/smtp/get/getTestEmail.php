<?php

  include "../../../others/config.php";

  $response = array();

  /** Get user test email ----------------*/
  $res = dbQuery("SELECT email,testEmail FROM $users_table WHERE id = '$session_user_id'");
  if($res['status']){
    $res['status'] = true;
    $res['email'] = ($res['data'][0]['testEmail'] ? $res['data'][0]['testEmail'] : $res['data'][0]['email']);
    unset($res['data']);
  }//End if condition
  
  echo json_encode($res);
  
?>