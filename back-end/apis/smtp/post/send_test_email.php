<?php

    $app_post_data = true;
    include "../../../others/config.php";

    require_once('../../../plugins/PHPMailer_v5.1/class.phpmailer.php'); //library added in download source
    include "../../campaign/post/step_4/send_campaign/1_functions.php";
    include "../../campaign/post/step_4/send_campaign/2_sendCampaignFunction.php";

    //print_r($_POST);
    $email = trim($_POST['email']);
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo json_encode(array('status' => false, 'errorTitle' => 'Invalid Email', 'errorMsg' => "It's not a valid email"));
        die();        
    }//End if condition


    $user_id = $session_user_id;
    
    #Getting User details --------------------------------#
    $userDataCurrent = dbQuery("SELECT first_name,last_name FROM $users_table WHERE id = '$user_id'");
    $userDataCurrent = $userDataCurrent['data'][0];
    //----------------------------------------------------#

    #Getting user test template data -----------------------------------#
    $testTemplate = "../../../uploaded_files/templates/test_template/".$user_id.".html";
    if(!file_exists($testTemplate)){
        $testTemplate = "../../../uploaded_files/templates/test_template/default.html";
    }//End if condition
    $testTemplate = companyTagsDecode(file_get_contents($testTemplate));
    $template = $testTemplate;
    //echo $testTemplate;exit();
    //------------------------------------------------------------------//

    #Getting SMTP data -----------------------------------#
    $SMTP_cred = getSMTPData('',false,true,$_POST['smtpDetails']);//print_r($SMTP_cred);exit();


    #Create Email Array for send function ----------------#
    $email_arr = array();
    $email_arr[] = array(
        'id' => $user_id,
        'email' => $email,
        'first_name' => $userDataCurrent['first_name'],
        'last_name' => $userDataCurrent['last_name'],
        'full_name' => $userDataCurrent['first_name']." ".$userDataCurrent['last_name'],
        'cid' => 0
    );//End array
    //print_r($email_arr);exit();
    #-----------------------------------------------------#

    #Setting email variables ----------------------------------------------------#
    $reveiversEmails  = $email_arr;
    $subject          = "SMTP test email";
    //$senderName       = $email_arr[0]['full_name'];//'connect@studentgraduates.com';
    //$senderEmail      = $email;//'connect@studentgraduates.com';
    $message          = $template;
    $planText         = '';
    #----------------------------------------------------------------------------#
    
    $senderArr = array(
        'fromName' => $email_arr[0]['full_name'],
        'fromEmail' => $email,
        'replayTo' => true
    );

    $res = sendCampaign($reveiversEmails,$senderArr,$subject,$message,$planText,$SMTP_cred,false,false);
    $resData = $res[0]['status'];

    if($resData == 'true'){
        echo json_encode(array(
            'status' => true,
            'successMsg' => 'Email has been sent, Please check your inbox',
            'successNotify' => true
        ));
    }else{
        echo json_encode($res[0]);
    }//End if condition



?>