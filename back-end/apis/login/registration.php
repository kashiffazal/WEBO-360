<?php
  
  $app_no_session = true;
  $app_post_data = true;
  include "../../others/config.php";
  require_once('../../plugins/PHPMailer_v5.1/class.phpmailer.php'); //library added in download source
  
  $_POST['full_name'] = split_name($_POST['full_name']);
  $_POST['first_name'] = $_POST['full_name'][0];
  $_POST['last_name'] = $_POST['full_name'][1];
  unset($_POST['full_name']);

  $_POST['role'] = 5;//Client ref id
  $_POST['status'] = 4;//Unverified email
  $_POST['default_smtp_id'] = 2;

  $email = $_POST['email'];
  $fullName = $_POST['first_name']." ".$_POST['last_name'];

  $_POST['fromName'] = $fullName;
  $_POST['fromEmail'] = $email;
  $_POST['replayToName'] = $fullName;
  $_POST['replayToEmail'] = $email;
  $_POST['testEmail'] = $email;
  $_POST['confirmationEmail'] = $email;

  

  //Checking email
  $res = dbQuery("SELECT email FROM $users_table WHERE email = '$email'",array('noRecordMsg' => true));

  if($res['status']){
    $res['emailError'] = "Not available.";
  }else{
    $res['emailError'] = false;
    $_POST['username'] = $_POST['email'];
    $res = dbQuery('post',$_POST,$users_table);

    if($res['status']){
      $verificationLink = $clientDomainForLink."/verifyEmail.php?e=".encrypt_decrypt('encrypt',$_POST['email'])."&s=";
      $receiverArr = array(array('email' => $_POST['email'], 'name' => $fullName));
      include "./confirmationEmailTemplate.php";
      $content = array(
        'subject' => 'Confirm your email address',
        'body' => $emailMsg,
        'plaintext' => 'This is the plain text version of the email content'
      );
      $res = emailPHPMailer($emailSenderArr,$receiverArr,$content,$SMTPCred);
    }//End if condition
  }//End if condition

  echo json_encode($res);

?>