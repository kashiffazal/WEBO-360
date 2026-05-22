<?php
  //error_reporting(0);
  include "../../../others/config.php";
  //include "../../reporting/functions_chart.php";

  $sql = "
    SELECT 
    ct.id,ct.campaign_name,ct.inserted_date,ct.inserted_time,ct.sent_date,ct.sent_time,ct.recipientsCount,ct.bounceCount,ct.status,
    ct.scheduleDateTime,ct.sendType,ct.list_ref_id,ct.template_url,ct.template_file_name,ct.template_type,ct.cronJob_id,
    crt.action, crt.email_ref_id
    FROM $campaign_table AS ct
    LEFT JOIN $campaign_report_table AS crt ON ct.id = crt.campaign_ref_id
    WHERE COALESCE(ct.log_status,'') != 'archive' AND ct.inserted_by = '$session_user_id' ORDER BY ct.id DESC
  ";
  
  $pdo_res = executePDO($sql);
  $i = 1;
  $arr = array();
  $ids = array();
  while($row = $pdo_res['data']->fetch()){

    if($row['sendType'] === 'schedule' AND $row['status'] !== 'sent'){
      $row['scheduleDateTime'] = setScheduleDate($row['scheduleDateTime']);
      $row['status'] = 'schedule';
    }//End if condition
    $row['inserted_date'] = set_date($row['inserted_date']." ".$row['inserted_time'],true,true);
    $row['sent_date'] = set_date(@$row['sent_date']." ".@$row['sent_time'],true,true);

    $row['key'] = $i;
    $arr[$row['status']][$row['id']] = $row;
    $ids[$row['id']][$row['action']][] = $row['email_ref_id'];
    $i++;
  }//End while loop

  if(@$arr['sent']){
    foreach($arr['sent'] as $key => $value){
      $total_open = sizeof(array_unique(gettype(@$ids[$value['id']]['Opened']) === 'array' ? $ids[$value['id']]['Opened'] : []));
      $total_click = sizeof(array_unique(gettype(@$ids[$value['id']]['Clicked']) === 'array' ? $ids[$value['id']]['Clicked'] : []));
      $total_unsub = sizeof(array_unique(gettype(@$ids[$value['id']]['Unsubscribed']) === 'array' ? $ids[$value['id']]['Unsubscribed'] : []));
      $total_sub = $value['recipientsCount'] - $value['bounceCount'];

      $value['openerPer'] = round((($total_open / $total_sub) * 100),2);
      $value['clickerPer'] = round((($total_click / $total_sub) * 100),2);
      $value['unsubPer'] = round((($total_unsub / $total_sub) * 100),2);
      
      $arr['sent'][$key] = $value;
    }//End foreach
  }//End if condition
  $arr['draft'] = @array_values($arr['draft']);
  $arr['sent'] = @array_values($arr['sent']);
  $arr['schedule'] = @array_values($arr['schedule']);
  

  #Getting archive count
  $archveCount = dbQuery("SELECT COUNT(id) AS ck FROM $campaign_table WHERE COALESCE(log_status,'') = 'archive'");
  $archveCount = $archveCount['data'][0]['ck'];

  $res = array();
  $res['status'] = true;
  $res['data'] = $arr;
  $res['archiveCount'] = $archveCount;
  //$res = dbQuery($sql);
  //echo "<pre>";print_r($ids['1665']['Opened']);echo "</pre>";
  //echo "<pre>";print_r($res);echo "</pre>";
  //echo sizeof($res);die();
  
  echo json_encode($res);

?>
