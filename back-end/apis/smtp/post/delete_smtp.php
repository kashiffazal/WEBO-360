<?php
  include "../../../others/config.php";

  $smtp_id = $_GET['id'];
  $res = dbQuery("DELETE FROM $smtp_table WHERE id = '$smtp_id' AND inserted_by = '$session_user_id'");
  $res['successNotify'] = true;
  $res['successMsg'] = 'SMTP has been deleted successfully';
  echo json_encode($res);
  //print_r($data);
  //print_r($_POST);




?>
