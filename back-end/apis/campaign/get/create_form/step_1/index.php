<?php

    include "../../../../../others/config.php";

    $campaign_id = @$_GET['id'];
    $res = array();
    $res['status'] = true;
    //Get last subject line
    $subject = dbQuery("SELECT subject_line AS last_subject FROM $campaign_table ORDER BY id DESC LIMIT 1");
    $res['data']['last_subject'] = (@$subject['data'][0] ? @$subject['data'][0]['last_subject'] : null);

    //Getting Tags
    $res['data']['tags'] = json_decode(file_get_contents("../../../../campaign/personalization_tags.json"),true);

    if($campaign_id){
      $cd = dbQuery("SELECT campaign_name,subject_line,fromName,fromEmail,replayToName,replayToEmail FROM $campaign_table WHERE id = '$campaign_id' AND inserted_by = '$session_user_id'");
      $res['data']['campaign_name'] = (@$cd['data'][0] ? @$cd['data'][0]['campaign_name'] : '');
      $res['data']['fromName'] = (@$cd['data'][0] ? @$cd['data'][0]['fromName'] : '');
      $res['data']['fromEmail'] = (@$cd['data'][0] ? @$cd['data'][0]['fromEmail'] : '');
      $res['data']['replayToName'] = (@$cd['data'][0] ? @$cd['data'][0]['replayToName'] : '');
      $res['data']['replayToEmail'] = (@$cd['data'][0] ? @$cd['data'][0]['replayToEmail'] : '');
      $res['data']['subject_line'] = (@$cd['data'][0] ? @$cd['data'][0]['subject_line'] : '');
      $res['data']['last_subject'] = null;
    }else{
      //Get user Data
      $ud = dbQuery("SELECT fromName,fromEmail,replayToName,replayToEmail FROM $users_table WHERE id = '$session_user_id'");
      $res['data']['fromName'] = (@$ud['data'][0] ? @$ud['data'][0]['fromName'] : '');
      $res['data']['fromEmail'] = (@$ud['data'][0] ? @$ud['data'][0]['fromEmail'] : '');
      $res['data']['replayToName'] = (@$ud['data'][0] ? @$ud['data'][0]['replayToName'] : '');
      $res['data']['replayToEmail'] = (@$ud['data'][0] ? @$ud['data'][0]['replayToEmail'] : '');
    }//End if condition

    echo json_encode($res);

?>