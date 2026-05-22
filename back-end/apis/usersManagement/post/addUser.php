<?php

  $app_post_data = true;
  include "../../../others/config.php";

  $_POST['full_name'] = split_name($_POST['full_name']);
  $_POST['first_name'] = $_POST['full_name'][0];
  $_POST['last_name'] = $_POST['full_name'][1];
  unset($_POST['full_name']);

  $email = $_POST['email'];
  $fullName = $_POST['first_name']." ".$_POST['last_name'];

  $_POST['fromName'] = $fullName;
  $_POST['fromEmail'] = $email;
  $_POST['replayToName'] = $fullName;
  $_POST['replayToEmail'] = $email;
  $_POST['testEmail'] = $email;
  $_POST['confirmationEmail'] = $email;

  if(!isset($_POST['default_esps_sr_id'])){$_POST['default_esps_sr_id'] = '1';}
  if(!isset($_POST['default_esps_sr_ac_id'])){$_POST['default_esps_sr_ac_id'] = '1';}


  //print_r($_POST);exit();
  $res = dbQuery('post',$_POST,$users_table);

  $res['successNotify'] = true;
  if(@$_POST['id']){
    $res['successMsg'] = "User has been updated successfully";
  }else{
    $res['successMsg'] = "User has been added successfully";
  }//End if condition

  echo json_encode($res);

?>