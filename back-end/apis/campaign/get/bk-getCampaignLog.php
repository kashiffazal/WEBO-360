<?php
  //error_reporting(0);
  include "../../../others/config.php";
  include "../../reporting/functions_chart.php";
  //echo $session_user_id;

  $status = $_GET['status'];
  $sendType = @$_GET['st'];

  if($status == 'sent'){
    $sql = "SELECT id,campaign_name,inserted_date,inserted_time,sent_date,sent_time,recipientsCount FROM $campaign_table WHERE status = 'sent' AND inserted_by = '$session_user_id' ORDER BY id DESC";
  }else{
    if($sendType == 'schedule'){
      $sql = "SELECT id,campaign_name,scheduleDateTime,inserted_date,inserted_time FROM $campaign_table WHERE status != 'sent' AND sendType = 'schedule' AND inserted_by = '$session_user_id' ORDER BY id DESC";
    }else{
      $sql = "SELECT id,campaign_name,inserted_date,inserted_time,template_type,template_file_name,template_url,list_ref_id FROM $campaign_table WHERE status != 'sent' AND (sendType IS NULL OR sendType != 'schedule') AND inserted_by = '$session_user_id' ORDER BY id DESC";
    }//End if condition
  }//End if condition

  $res = dbQuery($sql);
  //print_r($res);
  if($res['status']){

    //$res['data'] = addKeyInArray($res['data']);
    foreach($res['data'] as $key => $value){

      if($status == 'sent'){
        $perData = campaign_report($value['id']);
        $value['openerPer'] = $perData['Opened']['unique_open'];
        $value['clickerPer'] = $perData['Clicked']['click_percent'];
      }//End if condition
      
      if($sendType == 'schedule'){
        $value['scheduleDateTime'] = setScheduleDate($value['scheduleDateTime']);
      }//End if condition

      $value['inserted_date'] = set_date($value['inserted_date']." ".$value['inserted_time'],true,true);
      $value['sent_date'] = set_date(@$value['sent_date']." ".@$value['sent_time'],true,true);
      $res['data'][$key] = $value;
    }//End foreach

  }//end if condition
  echo json_encode($res);

?>
