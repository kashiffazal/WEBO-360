<?php
    include "../../../others/config.php";
    $id = $session_user_id;
    $data = dbQuery("SELECT fromName,fromEmail,replayToName,replayToEmail,testEmail,confirmationEmail FROM $users_table WHERE id = '$id'");
    if($data['status']){
        $data['data'] = $data['data'][0];
        unset($data['data']['key']);
    }//End if condition
    
    echo json_encode($data);


?>