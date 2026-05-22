<?php

  include "../../../others/config.php";
  $permission = @$_GET['permission'];

  if($permission == 'true'){
    
    $data = dbQuery("SELECT * FROM $users_role_table WHERE inserted_by = '$session_user_id'",array('reverse' => true));

    foreach($data['data'] as $key => $value){
      $arr = array();
      if($value['permission_ref_ids'] == 'all'){
        $arr[] = $value['permission_ref_ids'];
      }else{
        $permission_ids = explode(",",$value['permission_ref_ids']);
        foreach($permission_ids as $key_inner => $value_inner){
          $data_inner = dbQuery("SELECT permission FROM $users_permission_table WHERE id = '$value_inner'");
          $arr[] = $data_inner['data'][0]['permission'];
        }//End foreach
      }//End if condition
      $arr = implode("|",$arr);
      $value['permissions'] = $arr;
      $data['data'][$key] = $value;
    }//End foreach

  }else{
    $data = dbQuery("SELECT id,role FROM $users_role_table WHERE hideForOthers IS NULL OR hideForOthers != 'true'",array('reverse' => true));
    $status = dbQuery("SELECT id,status FROM $users_status_table",array('reverse' => true));
    $data['status_data'] = $status['data'];
    //$data['smtp'] = getSMTPData('all','id,name');
    $data['esps'] = getESPSserverAndAccountList();
  }//End if condition
  echo json_encode($data);

?>