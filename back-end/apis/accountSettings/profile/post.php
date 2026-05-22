<?php
    $app_post_data = true;
    include "../../../others/config.php";
    //if(!isset($_POST['data'])){exit();}
    //print_r($_POST);
    //print_r($_FILES);
    //exit();
    $id = $session_user_id;

    $res = postDataWithFile(
        $_POST,$users_table,'update',array('kc'),"id = '$id'",$id,
        @$_FILES['user_profile_image'],"../../../uploaded_files/user_profile/",$id."_".randCode(5),"profileImage"
    );//End calling function

    if($res['status']){
        $userData = dbQuery("SELECT id,status,first_name,last_name,email,company_name,profileImage,role AS kc FROM $users_table WHERE id = '$id'");
        $data = $userData['data'][0];
        $role_id = $data['kc'];
        
        $resPer = dbQuery("SELECT role,permission_ref_ids AS pc FROM $users_role_table WHERE id = '$role_id'");
        $res['data'] = array_merge($data,$resPer['data'][0]);

        $res['successNotify'] = true;
        $res['successMsg'] = "Profile has been updated successfully";
    }//End if condition
    //print_r($res);
    echo json_encode($res);

?>