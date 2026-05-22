<?php
  
  $app_post_data = true;
  include "../../../others/config.php";

  $_POST['permission_ref_ids'] = implode(",",$_POST['permission_ref_ids']);
    
  if(@$_POST['hideForOthers']){
    $_POST['hideForOthers'] = 'true';
  }else{
    $_POST['hideForOthers'] = '';
  }//End if condition
  //print_r($_POST);exit();

  $res = dbQuery('post',$_POST,$users_role_table);
  
  $res['successNotify'] = true;
  if(@$_POST['id']){
    $res['successMsg'] = "Role has been updated successfully.";
  }else{
    $res['successMsg'] = "Role has been added successfully.";
  }//End if condition

  echo json_encode($res);
  
 ?>