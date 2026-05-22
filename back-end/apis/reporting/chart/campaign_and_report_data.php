<?php
    //$c_data                 = get_campaign_data('list_ref_id,template_file_name,sent_date,sent_time,recipientsCount,bounceCount,spamCount,esps_sr_id,esps_sr_ac_id,server_campaign_id',$campaign_id);
    //$cr_data                = get_campaign_report_data("*",$campaign_id);
    #Get campaign and campaign report data in single query
    $campaignData = dbQuery("
        SELECT 
        c.id,c.list_ref_id,c.template_file_name,c.sent_date,c.sent_time,c.recipientsCount,c.bounceCount,c.spamCount,c.esps_sr_id,c.esps_sr_ac_id,c.server_campaign_id,
        cr.id AS crid,cr.email_ref_id,cr.action,cr.action_date,cr.action_time,cr.click_url,cr.location
        FROM $campaign_table AS c
        LEFT JOIN $campaign_report_table AS cr ON c.id = cr.campaign_ref_id
        WHERE c.id = '$campaign_id' AND c.inserted_by = '$session_user_id'
    ");

    $c_data = array();
    $cr_data = array();
    #Seprate campaign and campaign report data into variables
    foreach($campaignData['data'] as $value){
        $temp = array();
        $temp['id'] = $value['crid'];
        $temp['email_ref_id'] = $value['email_ref_id'];
        $temp['action'] = $value['action'];
        $temp['action_date'] = $value['action_date'];
        $temp['action_time'] = $value['action_time'];
        $temp['click_url'] = $value['click_url'];
        $temp['location'] = $value['location'];
        $temp['key'] = $value['key'];
        $cr_data[] = $temp;
        $c_data[$value['id']] = $value;
    }//End foreach
    #Set and delete unwanted data from campaign data;
    $c_data = array_values($c_data);
    $c_data = $c_data[0];
    unset($c_data['crid']);
    unset($c_data['email_ref_id']);
    unset($c_data['action']);
    unset($c_data['action_date']);
    unset($c_data['action_time']);
    unset($c_data['click_url']);
    unset($c_data['location']);
    unset($c_data['key']);

    #Adding list names
    $c_data['list_names']   = getListNamesByids($c_data['list_ref_id']);

    //print_r($cr_data);
    //print_r($c_data);
    //die();

?>