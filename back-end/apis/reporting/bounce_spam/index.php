<?php

  #Get bounce and spam within given days
  # - When get from API it will update in DB
  # - Otherwise it will get just from DB
  $checkingDays = '5';
  $daysAfterSent = getDaysByDate($c_data['sent_date'].' '.$c_data['sent_time']);

  if($daysAfterSent <= $checkingDays){
    include "../../../ESPS_apis/functions.php";
    $espsCred = getESPScred($c_data['esps_sr_id'], $c_data['esps_sr_ac_id']);//print_r($c_data);die();
    $bs = esps_bounce_or_spam(
      $c_data['esps_sr_id'],
      $espsCred,
      $c_data['server_campaign_id'],
      $c_data['sent_date'].' '.$c_data['sent_time']
    );//print_r($res);die();
    // $bs = array(
    //   'bounce' => array(
    //     'kashiffazal9999900000@yahoo.com', 'kashiffazaldemo990099@gmail.com'
    //     //'yushincms@gmail.com', 'yousufsme2018@gmail.com'
    //   ),
    //   //'bounce' => array(),
    //   'spam' => array(
    //     'kashiffazal99@gmail.com'
    //     )
    // );

    updateBounceOrSpamInDB($bs['bounce'],$campaign_id,$c_data['bounceCount'],$c_data['list_ref_id'],'bounce');
    updateBounceOrSpamInDB($bs['spam'],$campaign_id,$c_data['spamCount'],$c_data['list_ref_id'],'spam');
    $c_data['bounceCount']  = sizeof($bs['bounce']);
    $c_data['spamCount']    = sizeof($bs['spam']);
  }//End if condition


?>