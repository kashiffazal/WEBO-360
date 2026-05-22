<?php

  if(@$_GET['app_no_session'] == 'true'){
    $app_no_session = true;
    $session_user_id = @$_GET['session_user_id'];
    $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition
  
  include "../../../others/config.php";

  $id = @$_GET['id'];
  $cols = @$_GET['cols'];
  if(!$cols){$cols = "*";}//End if condition

  $where_con = "";

  if(isset($id)){
    if($id == 'all'){
      //If user is not a developer then get specific user's SMTP oterwise get all SMTP
      if(!check_role_id(2,$session_user_id)){$where_con = " WHERE inserted_by = '$session_user_id'";}//End if condition
    }else{
      //$where_con = "id = '$id' AND inserted_by = '$session_user_id'";
      //If user is not a developer then get specific user's SMTP otherwise get all SMTP
      if(!check_role_id(2,$session_user_id)){
        $where_con = " WHERE id = '$id' AND inserted_by = '$session_user_id'";
      }else{
        $where_con = " WHERE id = '$id'";
      }//End if condition
    }//End if condition

    $res = dbQuery("SELECT $cols FROM $smtp_table ".$where_con);

  }else{
    $res = array();
    $res['status'] = false;
    $res['errorTitle'] = 'Required ID';
    $res['errorMsg'] = 'Please provide id value';
  }//End if condition

  echo json_encode($res);

?>
