<?php
    include "../../../../../others/config.php";

    $id = $_GET['id'];
    $cd = dbQuery("SELECT * FROM $campaign_table WHERE id = '$id' AND inserted_by = '$session_user_id'");
    $cd = $cd['data'][0];
    if($cd['scheduleDateTime']){$cd['scheduleDateTime'] = setScheduleDate($cd['scheduleDateTime']);}
    
    $cd['listData'] = callAPI("GET",$domainPath."/apis/campaign/get/create_form/step_3/get_recipient_list.php?id=".$id."&app_no_session=true&session_user_id=".$session_user_id,false,true);
    $cd['html'] = @getTemplateAndPlainText('template',$id,"../../../../../uploaded_files");
    $cd['plaintext'] = @getTemplateAndPlainText('plaintext',$id,"../../../../../uploaded_files");

    //Getting Tags
    $tags = json_decode(file_get_contents("../../../../campaign/personalization_tags.json"),true);

    $res = array('status' => true, 'data' => $cd, 'tags' => $tags);
    echo json_encode($res);
    
?>