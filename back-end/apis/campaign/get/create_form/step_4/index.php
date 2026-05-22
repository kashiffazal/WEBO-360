<?php
    include "../../../../../others/config.php";
    include "./schedule_fields_list.php"; //print_r($schedule_fields_list);
    
    $id = $_GET['id'];
    #Get Confirmation Email ------------------------------------------
    $user_cEmail = dbQuery("SELECT confirmationEmail FROM $users_table WHERE id = '$session_user_id'");
    $user_cEmail = $user_cEmail['data'][0]['confirmationEmail'];
    #------------------------------------------------------------------

    $campaign_data = dbQuery("SELECT id,campaign_name,confirmationEmail,esps_sr_id,esps_sr_ac_id,list_ref_id,sendType,scheduleDateTime FROM $campaign_table WHERE id = '$id' AND inserted_by = '$session_user_id'");

    if($campaign_data['status']){
        $cd = $campaign_data['data'][0];
        if($cd['scheduleDateTime']){parse_str($cd['scheduleDateTime'],$cd['scheduleDateTime']);}
        #Set Default Date Time for Schedult fields
        $userTimeZone = "Asia/Karachi";
        date_default_timezone_set($userTimeZone);
        $cd['defaultDateTime']['date'] = array(
            'day' => date('d'),
            'month' => date('m'),
            'year' => date('Y')
        );
        $cd['defaultDateTime']['time'] = array(
            'hour' => date('g'),
            'min' => date('i',ceil(time()/300)*300),//round datetime to nearest 5 interval
            'ampm' => date('a'),
            'timeZone' => $userTimeZone
        );

        $cd['recipientsCount'] = getEmailListCountByList_ref_id($cd['list_ref_id']);
        #If there is no confirmation email in Campaign table then get it from User table
        if(!$cd['confirmationEmail']){$cd['confirmationEmail'] = $user_cEmail;}//End if condition
        $campaign_data['data'] = $cd;
        $campaign_data['data']['esps_servers'] = getESPSserverAndAccountList();
        $campaign_data['data']['schedule_fields_list'] = $schedule_fields_list;
    }//End if condition

    echo json_encode($campaign_data);

?>
