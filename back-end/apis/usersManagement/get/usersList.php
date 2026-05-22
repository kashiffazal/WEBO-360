<?php
  include "../../../others/config.php";
  $data = dbQuery("
    SELECT $users_table.*, $esps_table.server_name AS esps_server_name, $esps_table.table_name AS esps_table_name_ac, $users_role_table.id AS role_id, $users_role_table.role AS role_name
    FROM $users_table
    INNER JOIN $users_role_table
    ON $users_table.role = $users_role_table.id
    INNER JOIN $esps_table
    ON $users_table.default_esps_sr_id = $esps_table.id 
    WHERE $users_table.inserted_by = '$session_user_id' AND $users_table.id != '$session_user_id'
  ");

  if(sizeof($data['data']) > 0){
    foreach($data['data'] as $key => $value){
      $esps_ac_table = $value['esps_table_name_ac'];
      $esps_sc_ac_id = $value['default_esps_sr_ac_id'];
      $d = dbQuery("SELECT account_name FROM $esps_ac_table WHERE id = '$esps_sc_ac_id'");
      $data['data'][$key]['esps_account_name'] = $d['data'][0]['account_name'];
    }//End foreach
  }//End if condition

  echo json_encode($data);
?>
