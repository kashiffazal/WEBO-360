<?php

    $app_post_data = true;
    include "../../../others/config.php";

    $email = trim($_POST['test_email']);
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
    if(!file_exists($testTemplate)){$testTemplate = "../../../uploaded_files/templates/test_template/default.html";}//End if condition
    $testTemplate = companyTagsDecode(file_get_contents($testTemplate));
    $template = $testTemplate;
    //echo $testTemplate;exit();
    //------------------------------------------------------------------//


    if($_POST['espsDetails']['esps_server_id'] == '1'){
        include "../../../ESPS_apis/sendgrid/functions.php";
    }//End if condition



    print_r($_POST);

    die();

    $data = sendEmailToSingleRecipient(
        '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',
        $arr = array(
            'from' => array('kashiffazal99@gmail.com','Kashif Fazal 99'),
            'to' => array('innotechcloud@gmail.com','Yushin Technologies'),
            'subject' => 'Sending with SendGrid is Fun',
            'plaintext' => 'and easy to do anywhere, even with PHP',
            'content' => '<strong>and easy to do anywhere, even with PHP</strong>'
        )
    );








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