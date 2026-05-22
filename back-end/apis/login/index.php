<?php
  
  $app_post_data = true;
  $app_no_session = true;
  include "../../others/config.php";
  $res = login_with_session($_POST,"first_name,last_name,email,company_name,profileImage,role AS kc");

  if($res['status']){
    $data = $res['data'];
    $data['sub_domain'] = company_as_sub_domain($res['data']['company_name']);
    $role_id = $data['kc'];
    $resPer = dbQuery("SELECT role,permission_ref_ids AS pc FROM $users_role_table WHERE id = '$role_id'");
    $res['data'] = array_merge($data,$resPer['data'][0]);
  }//End if condition
  //print_r($res);  
  echo json_encode($res);

?>
