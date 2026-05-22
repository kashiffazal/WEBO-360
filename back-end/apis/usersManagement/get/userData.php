<?php

  include "../../../others/config.php";
  $id = $_GET['id'];
  $data = dbQuery("SELECT id,first_name,last_name,company_name,email,role,status,username,password,default_esps_sr_id,default_esps_sr_ac_id FROM $users_table WHERE id = '$id'");
  $data['data'] = $data['data'][0];

  $data['data']['full_name'] = $data['data']['first_name']." ".$data['data']['last_name'];
  unset($data['data']['first_name']);
  unset($data['data']['last_name']);
  unset($data['data']['key']);

  echo json_encode($data);

?>