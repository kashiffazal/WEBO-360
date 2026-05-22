<?php

  include "../../../others/config.php";

  $id = $_GET['id'];
  $list_data = dbQuery("SELECT * FROM $campaign_table WHERE id = '$id' inserted_by = '$session_user_id'");
  if($list_data['status']){
    $list_data['data'] = $list_data['data'][0];
  }//End if condition
  echo json_encode($list_data);

?>
