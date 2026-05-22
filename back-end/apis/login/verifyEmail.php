<?php
  
  $DIRECT_ACCESS_PAGE = 'true';
  $app_no_session = true;
  include "../../others/config.php";
  //include "./confirmationEmailTemplate.php";

  $email = trim(encrypt_decrypt('decrypt',$_GET['e']));
  $session = $_GET['s'];
  $res = dbQuery("UPDATE $users_table SET status = '1' WHERE email = '$email'");
  if(!$session){$session = 'e';}
  $res['redirectPath'] = $redirectPath."/thankYou/$session";
  $res['redirectPathError'] = $redirectPath."/error";
  echo json_encode($res);
?>