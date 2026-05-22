<?php
  
  $DIRECT_ACCESS_PAGE = 'true';
  $app_no_session = true;
  include "../../../others/config.php";

  $email_id = $_GET['ei'];
  $campaignId = $_GET['cid'];
  $res = dbQuery("UPDATE $subscribers_table SET status = '2' WHERE id = '$email_id'",$email_id);
  if($res['status']){

    $location = ip_info('visitor');
    if($location){
      //convert array to string with keys
      $location = http_build_query($location);
    }//End if condition
    $res = dbQuery("INSERT INTO $campaign_report_table(`campaign_ref_id`,`email_ref_id`,`action`,`action_date`,`action_time`,`location`)VALUES('$campaignId','$email_id','Unsubscribed','$server_date','$server_time','$location')");
  }//end if condition
  echo json_encode($res);

?>
