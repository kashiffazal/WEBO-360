<?php
  
  if(@$_GET['app_no_session'] == 'true'){
      $app_no_session = true;
      $session_user_id = @$_GET['session_user_id'];
      $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition
  include "../../../../../others/config.php";

  $id = $_GET['id'];

  if(isset($id)){
    $campaign_data = get_campaign_data("list_ref_id",$id);
    $campaign_data = @$campaign_data['list_ref_id'];
    $campaign_data = explode(",",$campaign_data);
  }else{
    $campaign_data = array();
  }//End if condition

  $list_data = dbQuery("SELECT id,list_name FROM $subscriber_list_table WHERE status = 'active' AND inserted_by = '$session_user_id'");

  if($list_data['status']){
    $totalEmails = 0;
    $index = 0;
    foreach($list_data['data'] as $key => $value){
      $list_id = $value['id'];
      $listCount = dbQuery("SELECT COUNT(id) AS count FROM $subscribers_table WHERE list_ref_id LIKE '%$list_id%' AND status = '1'");
      $value['count'] = $listCount['data'][0]['count'];

      #Default check and uncheck ------------------------------//
      $value['checked'] = in_array($value['id'],$campaign_data);
      $value['index'] = $index;
      $index++;
      if($value['checked']){
        $totalEmails = $totalEmails + $value['count'];
      }//End if condition
      #--------------------------------------------------------//

      $list_data['data'][$key] = $value;
    }//End foreach
    $list_data['totalEmails'] = $totalEmails;
  }//End if condition
  echo json_encode($list_data);
?>
