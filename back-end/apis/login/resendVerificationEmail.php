<?php

  $app_no_session = true;
  $app_post_data = true;
  include "../../others/config.php";
  require_once('../../plugins/PHPMailer_v5.1/class.phpmailer.php'); //library added in download source

  //print_r($_POST);exit();
  
  $verificationLink = $clientDomainForLink."/verifyEmail.php?e=".encrypt_decrypt('encrypt',$_POST['email'])."&s=".$_POST['sessionName'];
  $receiverArr = array(array('email' => $_POST['email'], 'name' => $_POST['full_name']));
  include "./confirmationEmailTemplate.php";
  $content = array(
    'subject' => 'Confirm your email address',
    'body' => $emailMsg,
    'plaintext' => 'This is the plain text version of the email content'
  );
  $res = emailPHPMailer($emailSenderArr,$receiverArr,$content,$SMTPCred);

  $res['successNotify'] = true;
  $res['successTitle'] = 'Sent!';
  $res['successMsg'] = 'Verification email has been sent.';
  $res['successNotifyType'] = 'notify';
  
  echo json_encode($res);

?>