<?php
  include "../../../../../others/config.php";
  $path = "../../../../../uploaded_files/templates/";
  $res = dbQuery("SELECT id,campaign_name,template_file_name FROM $campaign_table WHERE status = 'sent' AND inserted_by = '$session_user_id' ORDER BY id DESC LIMIT 5");
  if($res['status']){
    $temp = array();
    foreach($res['data'] as $key => $value){
        $res['data'][$key]['html'] = @file_get_contents($path.$value['template_file_name']);
      }//End foreach
  }//End if condition
  echo json_encode($res);
?>
