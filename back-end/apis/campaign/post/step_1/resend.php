<?php
    if(@$_GET['app_no_session'] == 'true'){
        $app_no_session = true;
        $session_user_id = @$_GET['session_user_id'];
        $DIRECT_ACCESS_PAGE = 'true';
    }//End if condition
    $app_post_data = true;
    include "../../../../others/config.php";

    //echo json_encode($_POST);exit();
    //print_r($_POST);exit();

    $id = $_POST['resend'];
    //Getting Template file name from DB
    $data = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$id'");
    $templateName = $data['data'][0]['template_file_name'];

    $res = duplicateDBRow($campaign_table,$id,array('id'),
        array(
            //'template_file_name' => $templateName_mod,
            'inserted_by' => $_POST['inserted_by'],
            'inserted_date' => $server_date,
            'inserted_time' => $server_time,
            'status' => 'draft',
            'campaign_name' => $_POST['campaign_name'],
            'subject_line' => $_POST['subject_line'],
            'fromName' => $_POST['fromName'],
            'fromEmail' => $_POST['fromEmail'],
            'replayToName' => @$_POST['replayToName'],
            'replayToEmail' => @$_POST['replayToEmail'],
            'sendType' => '',
            'scheduleDateTime' => '',
            'cronJob_id' => '',
            'cronJob_status' => '',
            'server_campaign_id' => '',
            'sent_date' => '',
            'sent_time' => '',
            'sent_by' => '',
            'updated_date' => '',
            'updated_time' => '',
            'updated_by' => ''
        )
    );
    //print_r($res);
    //Copy and update files
    if($res['status']){
        $new_id = $res['id'];
        duplicateTemplateLinks($id,$new_id);
        #Extract id from file name and add new
        $templateNameTemp = explode("-",$templateName);
        unset($templateNameTemp[0]);//Remove old from file name
        $templateNameTemp = implode("-",$templateNameTemp);
        $templateName_new = $new_id."-".$templateNameTemp;
        $path_plaintext = "../../../../uploaded_files/plaintext/";
        $path_template = "../../../../uploaded_files/templates/";
        #Copy plaintext
        @copy(
            $path_plaintext.$id."-plainText.txt",
            $path_plaintext.$new_id."-plainText.txt"
        );
        #Copy template
        @copy(
            $path_template.$templateName,
            $path_template.$templateName_new
        );
        $res = dbQuery("UPDATE $campaign_table SET `template_file_name` = '$templateName_new' WHERE id = '$new_id'",$new_id);
    }//End if condition
    echo json_encode($res);
?>