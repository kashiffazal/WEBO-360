<?php

  include "../../../../../others/config.php";

  $campaign_id = $_GET['id'];
  $res = dbQuery("SELECT template_type,template_file_name,template_url FROM $campaign_table WHERE id = '$campaign_id' AND inserted_by = '$session_user_id'");

  if($res['status']){
    $res['data'] = $res['data'][0];
    //$res['data']['preview'] = @getTemplateAndPlainText('template',$campaign_id,"../../../../../uploaded_files/");
  }//End if condition

  echo json_encode($res);

?>
