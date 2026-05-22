<?php
    include "../../../others/config.php";
    $id = $session_user_id;
    $data = dbQuery("SELECT first_name,last_name,gender,contact_number,email,country,city,address,profileImage FROM $users_table WHERE id = '$id'");
    if($data['status']){
        $data['data'] = $data['data'][0];
        if(@$data['data']['profileImage']){
            $data['data']['db_image'] = $domainPath."/uploaded_files/user_profile/".$data['data']['profileImage'];
        }//End if condition
        unset($data['data']['key']);
        unset($data['data']['profileImage']);
    }//End if condition
    echo json_encode($data);
?>