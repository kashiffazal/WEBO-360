<?php
    //error_reporting(0);
    $app_post_data = true;
    include "../../../../others/config.php";

    $_POST['inserted_by'] = $session_user_id;
    $_POST['status'] = 'draft';//Default status


    #If there is no reply-to email then set it as sender name and email
    if(!isset($_POST['replayToName'])){$_POST['replayToName'] = $_POST['fromName'];}//End if condition
    if(!isset($_POST['replayToEmail'])){$_POST['replayToEmail'] = $_POST['fromEmail'];}//End if condition

    //print_r($_POST);exit();

    //If it's resend campaign then just duplicate data and skip;
    if(isset($_POST['resend'])){
        $res = callAPI("POST",$domainPath."/apis/campaign/post/step_1/resend.php?session_user_id=".$session_user_id."&app_no_session=true",$_POST,true);
    }else{
        //print_r($_POST);
        //exit();
        $res = dbQuery('post',$_POST,$campaign_table,'id,step,resend');
    }//End resend condition

    //print_r($res);
    echo json_encode($res);
?>