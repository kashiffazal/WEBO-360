<?php
    $cols = 'SELECT ct.list_ref_id,ct.sent_date';
    $query = "FROM $campaign_table AS ct ";
    $where = "WHERE (DATE(ct.sent_date) BETWEEN '$fromDate' AND '$toDate') AND ct.status = 'sent' AND ct.inserted_by = '$session_user_id'";
    //AND COALESCE(ct.log_status,'') != 'archive'
    #If has ESPS Server
    include "./not_open_all_list_and_mutual/1_esps_condition.php";
    #If has ESPS Account
    include "./not_open_all_list_and_mutual/2_esps_sc_condition.php";
    #If has campaign
    include "./not_open_all_list_and_mutual/3-1-campaign_condition_not_opener.php";
    #Just run campaign query for not opener
    include "./not_open_all_list_and_mutual/4-run-query-for-not-opener.php";
    #Get all subscriers used in campaign(s)
    include "./not_open_all_list_and_mutual/5-get-email-for-not-openers.php";
    
?>