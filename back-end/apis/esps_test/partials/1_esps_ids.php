<?php
    #Set ESPS server and account id, also set To email for check email validation
    $user_id = $session_user_id;
    if(!isset($_POST)){
      $ud = getUserData($user_id,'first_name,last_name,testEmail,default_esps_sr_id,default_esps_sr_ac_id');
      //$ud = dbQuery("SELECT first_name,last_name,testEmail,default_esps_sr_id,default_esps_sr_ac_id FROM $users_table WHERE id = '$user_id'");
      //$ud = $ud['data'][0];
      $espsId =  $ud['default_esps_sr_id'];
      $espsAcId = $ud['default_esps_sr_ac_id'];
      $toEmail = $ud['testEmail'];
      $toName = $ud['first_name']." ".$ud['last_name'];
      $firstName = $ud['first_name'];
      $lastName = $ud['last_name'];
      $subDomain = $ud['subDomain'];
  }else{
      $espsId =  @$_POST['espsDetails'] ? $_POST['espsDetails']['esps_server_id'] : $_POST['esps_sr_id'];
      $espsAcId = @$_POST['espsDetails']['id'] ? @$_POST['espsDetails']['id'] : @$_POST['esps_sr_ac_id'];
      $toEmail = $_POST['to_email'];
      #Getting User Name
      if(!isset($_POST['to_name'])){
        $ud = getUserData($user_id,'first_name,last_name');
        //$ud = dbQuery("SELECT first_name,last_name FROM $users_table WHERE id = '$user_id'");
        //$ud = $ud['data'][0];
        $toName = $ud['first_name']." ".$ud['last_name'];
        $firstName = $ud['first_name'];
        $lastName = $ud['last_name'];
      }else{
        $toName = @$_POST['to_name'];
        $n = splitName(@$_POST['to_name']);
        $firstName = $n[0];
        $lastName = $n[1];
      }//End if condition
      #Getting Sub Domain
      $ud = getUserData($user_id,'id');
      //$ud = dbQuery("SELECT id FROM $users_table WHERE id = '$user_id'");
      $subDomain = $ud['subDomain'];

  }//End if condition

  #Checking email validation
  if(!filter_var($toEmail, FILTER_VALIDATE_EMAIL)){
    echo json_encode(array('status' => false, 'errorTitle' => 'Invalid Email', 'errorMsg' => "It's not a valid email"));
    die();        
  }//End if condition
?>