<?php
  //error_reporting(0);
  include "../../../others/config.php";
  //include "../../reporting/functions_chart.php";

  $sql = "
    SELECT 
    ct.id,ct.campaign_name,ct.sent_date,ct.sent_time,ct.recipientsCount,ct.bounceCount,
    crt.action, crt.email_ref_id
    FROM $campaign_table AS ct
    LEFT JOIN $campaign_report_table AS crt ON ct.id = crt.campaign_ref_id
    WHERE COALESCE(log_status,'') = 'archive' AND ct.inserted_by = '$session_user_id' ORDER BY ct.id DESC
  ";
  
  $pdo_res = executePDO($sql);
  $i = 1;
  $arr = array();
  $ids = array();
  while($row = $pdo_res['data']->fetch()){
    $row['sent_date'] = set_date(@$row['sent_date']." ".@$row['sent_time'],true,true);
    $row['key'] = $i;
    $arr[$row['id']] = $row;
    $ids[$row['id']][$row['action']][] = $row['email_ref_id'];
    $i++;
  }//End while loop
//print_r($arr);die();
  foreach($arr as $key => $value){
    $total_open = @sizeof(@array_unique(@$ids[$value['id']]['Opened']));
    $total_click = @sizeof(@array_unique(@$ids[$value['id']]['Clicked']));
    $total_unsub = @sizeof(@array_unique(@$ids[$value['id']]['Unsubscribed']));
    $total_sub = $value['recipientsCount'] - $value['bounceCount'];

    $value['openerPer'] = round((($total_open / $total_sub) * 100),2);
    $value['clickerPer'] = round((($total_click / $total_sub) * 100),2);
    $value['unsubPer'] = round((($total_unsub / $total_sub) * 100),2);
    
    $arr[$key] = $value;
  }//End foreach

  $arr = @array_values($arr);
  
  $res = array();
  $res['status'] = true;
  $res['data'] = $arr;
  echo json_encode($res);

?>
