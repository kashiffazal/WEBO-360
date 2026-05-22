<?php

    //Getting personal details
    $st = $subscribers_table;
    $sst = $subscriber_status_table;
    $data = dbQuery("SELECT $st.*, $sst.status AS s_status FROM $st INNER JOIN $sst ON $st.status = $sst.id WHERE $st.id = '$id'");
    $data = $data['data'][0];

    #Getting email read with (e.g. gmail, yahoo, etc)
    $data['email_read_with'] = getDomainFromEmail($data['email']);
    #-------------------------------------------------------#

    #Getting status data -----------------------------------#
    if($data['status_history']){
        $status_date = explode('=>',$data['status_history']);
        $status_date = explode('(%)',end($status_date));
        $status_mod_date = $status_date[0];
    }else{
        #If there is no status history then find unsubscribe date (if it's available)
        $email_ref_id = $data['id'];
        $unSubDate = dbQuery("SELECT action_date FROM $campaign_report_table WHERE action = 'Unsubscribed' AND email_ref_id = '$email_ref_id' ORDER BY ID DESC LIMIT 1");
        #if there is no unsubscribe then set inserted date as status date
        if(isset($unSubDate['data'][0])){
            $status_mod_date = $unSubDate['data'][0]['action_date'];
        }else{
            $status_mod_date = $data['inserted_date'];
        }//End if condition
    }//End if condition

    
    $data['status_date'] = $data['s_status']." since ".set_date($status_mod_date);
    $data['joining_date'] = set_date($data['inserted_date'])." ".($data['import_from_list'] === 'true' ? '(imported from a list)' : '(inserted as new subscriber)');
    #-------------------------------------------------------#

?>