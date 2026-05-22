<?php
  #Explode second last param for details
  $second_last_param = $params[count($params)-2];
  $second_last_param = explode("-",$second_last_param);
// print_r($second_last_param[1]);
  //Get unsubscribe status (preview unsubscribe tag in html (just preview))
  $unsubscribe = $second_last_param[0];
  //Get user id for session)
  $session_user_id = letterToNumberAscii($second_last_param[1]);
  //Get campaign id
  $campaign_id = letterToNumberAscii($second_last_param[2]);
  $preview_content = callAPI("GET",$domainPath."get/preview_template_and_plaintext.php?campaign_id=".$campaign_id."&unsubscribe=".$unsubscribe."&app_no_session=true&session_user_id=".$session_user_id,false);
?>