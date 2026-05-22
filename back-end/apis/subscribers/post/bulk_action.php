<?php
    
    $app_post_data = true;
    include "../../../others/config.php";
    $_POST['list_id'] = encrypt_decrypt('decrypt',$_POST['list_id']);

    $status = $_POST['status'];

    $successRes = array();
    $errorRes = array();
    foreach($_POST['user_ids'] as $value){
        $status_history = create_status_history_var($value,$status,$_POST['list_id']);
        $data = dbQuery("UPDATE $subscribers_table SET `status` = '$status', `status_history` = '$status_history' WHERE id = $value",$value);

        if($data['status']){
            $successRes[] =  $data['id'];
        }else{
            $errorRes[] =  $data['id'];
        }//End if condition
    }//End foreach
    $res = array('status' => true, 'success' => $successRes, 'error' => $errorRes);
    echo json_encode($res);





?>