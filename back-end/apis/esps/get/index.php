<?php

  if(@$_GET['app_no_session'] == 'true'){
    $app_no_session = true;
    $session_user_id = @$_GET['session_user_id'];
    $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition
  
  include "../../../others/config.php";

  $id = @$_GET['id'];
  // $cols = @$_GET['cols'];
  // if(!$cols){$cols = "*";}//End if condition

  if(isset($id)){
    if($id == 'all'){
      //If user is not a developer then get specific user's SMTP oterwise get all SMTP
      if(!check_role_id(2,$session_user_id)){$where_con = " WHERE inserted_by = '$session_user_id'";}//End if condition
    }else{
      //If user is not a developer then get specific user's SMTP otherwise get all SMTP
      if(!check_role_id(2,$session_user_id)){
        $where_con = " WHERE id = '$id' AND inserted_by = '$session_user_id'";
      }else{
        $where_con = " WHERE id = '$id'";
      }//End if condition
    }//End if condition

    //GET ESPS Server List
    $res = dbQuery("SELECT id,server_name,table_name FROM $esps_table");


    $arr = array();
    foreach($res['data'] as $key => $esps){
      $table_name = $esps["table_name"];
      $data = dbQuery("SELECT * FROM $table_name".@$where_con,array('reverse' => true));
      if(gettype($data['data']) === 'array' AND sizeof($data['data'])>0){
        $arr[] = array(
          'key' => ($key+1),
          'esps_server_id' => $esps['id'],
          'table_name' => $esps['table_name'],
          'tab_name' => $esps['server_name'],
          'data' => $data['data']
        );
      }//End if condition
    }//End foreach

    $res['status'] = true;
    $res['data'] = $arr;
  //print_r($res);

  }else{
    $res = array();
    $res['status'] = false;
    $res['errorTitle'] = 'Required ID';
    $res['errorMsg'] = 'Please provide valid id';
  }//End if condition

  echo json_encode($res);

?>
