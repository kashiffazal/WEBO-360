<?php
  include "../../../others/config.php";
  $res = getESPSserverAndAccountList();
  //Test testEmail,from name and email
  $data = dbQuery("SELECT fromName,fromEmail,email,testEmail FROM $users_table WHERE id = '$session_user_id'");
  if ($data['status']) {
      $data = $data['data'][0];
      $test_res['to_email'] = ($data['testEmail'] ? $data['testEmail'] : $data['email']);
      $test_res['from_name'] = $data['fromName'];
      $test_res['from_email'] = $data['fromEmail'];
  } //End if condition
  $res['test_data'] = $test_res;
  echo json_encode($res);
?>
