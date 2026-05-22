<?php
  $app_post_data = true;
  include "../../../others/config.php";
  //print_r($_POST);exit();
  $res = dbQuery('post',$_POST,$smtp_table);

  $res['successNotify'] = true;
  if(@$_POST['id']){
    $res['successMsg'] = 'SMTP has been updated successfully';
  }else{
    $res['successMsg'] = 'New SMTP has been added successfully';
  }//End if condition

  echo json_encode($res);
?>