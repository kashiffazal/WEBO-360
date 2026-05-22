<?php 
    
    $app_post_data = true;
    include "../../../others/config.php";
    //print_r($_POST);exit();

    $user_id    = $session_user_id;
    $id         = $_POST['id'];
    $list_id    = $_POST['list_ref_id'];
    $full_name  = $_POST['full_name'];
    $email      = $_POST['email'];
    $status     = $_POST['status'];
    $pre_status = $_POST['pre_status'];

    //Split name
    $splitName      = split_name($full_name);
    $first_name     = $splitName[0];
    $last_name      = $splitName[1];

    if(trim($pre_status) === trim($status)){
        $sql = "UPDATE $subscribers_table SET `full_name` = '$full_name', `first_name` = '$first_name', `last_name` = '$last_name', `email` = '$email', `status` = '$status' WHERE id = $id";
    }else{
        $status_history = create_status_history_var($id,$status,$user_id,$list_id,$server_date,$server_time);
        $sql = "UPDATE $subscribers_table SET `full_name` = '$full_name', `first_name` = '$first_name', `last_name` = '$last_name', `email` = '$email', `status` = '$status', `status_history` = '$status_history' WHERE id = $id";
    }//End if condition

    $data = dbQuery($sql,$id);

    if($data['status']){
        $data['user_personal_data'] = callAPI("GET",$domainPath."/apis/subscribers/get/subscriber_details/index.php?app_no_session=true&session_userid=".$session_user_id."&id=".$id,false,true);
        $data['successNotify'] = true;
        $data['successMsg'] = 'Subscriber has been updated.';
    }//End if condition

    echo json_encode($data);





?>