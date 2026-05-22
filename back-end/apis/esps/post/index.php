<?php
  $app_post_data = true;
  include "../../../others/config.php";
  //print_r($_POST);exit();
  $table_name = $_POST['esps_table_name'];
  unset($_POST['esps_server_id']);
  unset($_POST['esps_table_name']);
  
  //die();
  $res = dbQuery('post',$_POST,$table_name);

  $res['successNotify'] = true;
  if(@$_POST['id']){
    $res['successMsg'] = 'ESPS account has been updated successfully';
  }else{
    $res['successMsg'] = 'New ESPS account has been added successfully';
  }//End if condition

  echo json_encode($res);
?>