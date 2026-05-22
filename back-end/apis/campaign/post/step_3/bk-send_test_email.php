<?php

    require_once('../../../../plugins/PHPMailer_v5.1/class.phpmailer.php'); //library added in download source

    include "../../../../others/config.php";
    //include "../step_4/send_campaign/";
    include "../step_4/send_campaign/2_sendCampaignFunction.php";

    $campaign_id    = $_GET['id'];
    $email          = $_GET['email'];
    $smtp_id        = $_GET['smtp'];

    #Convert Email to Array ------------------------------#
    $email = moreThenFiveEmail($email);//print_r($email);exit();
    #Getting User details --------------------------------#
    $userData = getUserData();//print_r($userData);
    if(!($smtp_id AND $smtp_id != 'undefined')){$smtp_id  = $userData['default_smtp_id'];}//End if condition
    //print_r($smtp_id);exit();
    //----------------------------------------------------#
    include "../step_4/send_campaign/1_functions.php";
    #Getting campaign data -------------------------------#
    $campaignData = get_campaign_data("subject_line,fromName,fromEmail,replayToName,replayToEmail",$campaign_id);//print_r($campaignData);exit();
    #Getting Template and Plain Text----------------------#
    $template = @getTemplateAndPlainText('template',$campaign_id,"../../../../uploaded_files/");//print_r($template);exit();
    $emailPlainText = @getTemplateAndPlainText('plaintext',$campaign_id,"../../../../uploaded_files/");//print_r($emailPlainText);exit();    
    #Getting SMTP data -----------------------------------#
    $SMTP_cred = getSMTPData($smtp_id,false,true);//print_r($SMTP_cred);exit();
    #Create Email Array for send function ----------------#
    $email_arr = getEmailListByList_ref_id("","",$email,$userData);//print_r($email_arr);exit();
    #Setting email variables ----------------------------------------------------#
    $receiversEmails  = $email_arr['email_list'];
    $subject          = $campaignData['subject_line']." - Test";
    //$senderName       = $campaignData['fromName'];//'connect@studentgraduates.com';
    //$senderEmail      = $campaignData['fromEmail'];//'connect@studentgraduates.com';
    $message          = $template;
    $planText         = $emailPlainText;
    #----------------------------------------------------------------------------#

    $senderArr = array(
        'fromName' => $campaignData['fromName'],
        'fromEmail' => $campaignData['fromEmail'],
        'replayToName' => $campaignData['replayToName'],
        'replayToEmail' => $campaignData['replayToEmail'],
        'replayTo' => true
    );

    $res = sendCampaign($receiversEmails,$senderArr,$subject,$message,$planText,$SMTP_cred,false,false);
    $resData = $res[0]['status'];

    if($resData == true){
        echo json_encode(array(
            'status' => true,
            'successNotify' => true,
            'successTitle' => 'Sent',
            'successMsg' => 'Email has been sent, Please check your inbox.',
        ));
    }else{
        echo json_encode($res[0]);
    }//End if condition
    


?>