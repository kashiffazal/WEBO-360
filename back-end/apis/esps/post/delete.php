<?php
  include "../../../others/config.php";

  $esps_id = $_GET['id'];
  $esps_table = $_GET['table_name'];
  $res = dbQuery("DELETE FROM $esps_table WHERE id = '$esps_id' AND inserted_by = '$session_user_id'");
  $res['successNotify'] = true;
  $res['successMsg'] = 'ESPS Account has been deleted successfully';
  echo json_encode($res);
  //print_r($data);
  //print_r($_POST);
?>
