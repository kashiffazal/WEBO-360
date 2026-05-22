<?php
  
  $app_post_data = true;
  include "../../../others/config.php";

  //print_r($_POST);
  $list_name = $_POST['list_name'];
  $_POST['status'] = 'active';

  $data = checkDataFromDB("SELECT id FROM $subscriber_list_table WHERE list_name = '$list_name' AND status 'active' AND inserted_by = '$session_user_id'");

  $res = array();
  if($data['status']){
    $res['status'] = false;
    $res['errorTitle'] = 'Duplicate List';
    $res['errorMsg'] = 'List already exists.';
  }else{
    $res = dbQuery('post',$_POST,$subscriber_list_table);
    @$res['id'] = @encrypt_decrypt('encrypt',$res['id']);
  }//End if condition

  //print_r($res);
  echo json_encode($res);

?>