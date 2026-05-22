<?php
include "../../../others/config.php";
$response = array();
/** Get user test email ----------------*/
$data = dbQuery("SELECT fromName,fromEmail,email,testEmail FROM $users_table WHERE id = '$session_user_id'");
if ($data['status']) {
    $data = $data['data'][0];
    $res['status'] = true;
    $res['data']['to_email'] = ($data['testEmail'] ? $data['testEmail'] : $data['email']);
    $res['data']['from_name'] = $data['fromName'];
    $res['data']['from_email'] = $data['fromEmail'];
} //End if condition

echo json_encode($res);

?>