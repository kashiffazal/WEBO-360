<?php
  
  $app_post_data = true;
  include "../../../others/config.php";

  //print_r($_POST);exit();
  $role_id = $_POST['id'];
  $data = dbQuery("SELECT id FROM $users_table WHERE role = '$role_id'",array('reverse' => true));

  if(sizeof($data['data']) >= 1){
    $res = array(
      'status' => false,
      'data' => [],
      'errorTitle' => 'Can\'t Delete',
      'errorMsg' => 'This role is used by some users'
    );
  }else{
    $res = dbQuery("DELETE FROM $users_role_table WHERE id = '$role_id'");
    $res['successNotify'] = true;
    $res['successMsg'] = "Role has been deleted successfully.";
  }//End if condition

  echo json_encode($res);

?>