<?php

  $DIRECT_ACCESS_PAGE = 'true';
  $app_no_session = true;
  include "../../../others/config.php";

  $email_id     = $_GET['ei'];
  $campaignId   = $_GET['cid'];
  $lid          = $_GET['lid'];
  $preview      = $_GET['preview'];
  

  $click_url    = dbQuery("SELECT link_url FROM $template_links_table WHERE id = '$lid'");
  $click_url    = $click_url['data'][0]['link_url'];

  #If preview is false then add record in DB otherwise just return original URL for preview in front-end
  if(!$preview){
    $location = ip_info('visitor');
    //Convert array to string with keys
    if($location){$location = http_build_query($location);}//End if condition
    $res = dbQuery("INSERT INTO $campaign_report_table(`campaign_ref_id`,`email_ref_id`,`action`,`action_date`,`action_time`,`click_url`,`location`)VALUES('$campaignId','$email_id','Clicked','$server_date','$server_time','$click_url','$location')");
    $res['click_url'] = $click_url;
  }else{
    $res = array('click_url' => $click_url);
  }//End if condition

  echo json_encode($res); 

?>
