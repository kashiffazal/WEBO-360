<?php
    $app_post_data = true;
    include "../../../others/config.php";

    $data = $_POST;    
    //print_r($data);die();

    //Temp Array
    // $data = array();
    // $data['esps_sr_id'] = '1';
    // $data['from_date'] = '2020-07-23T19:00:00.000Z';
    // $data['to_date'] = '2020-08-05T16:01:56.810Z';
    // $data['action'] = 'Opened';
    // $data['esps_sr_ac_id'] = '1';
    // $data['campaign_ref_id'] = '5788';
    // $data['esps_sr_name'] = 'SendGrid';
    // $data['esps_sr_ac_name'] = 'Haris Hassan';
    // $data['campaign_name'] = 'SG-BPO-FFG2-Creative-1B-2-YH-OSO';
    // $data['list_name'] = 'SG_BPO_FFG-2';
    // $data['single_list'] = '1';
    // $data['list_ref_ids'] = '';

    $fromDate = date('Y-m-d',strtotime($data['from_date'])).' 00:00:00';
    $toDate = date('Y-m-d',strtotime($data['to_date'])).' 00:00:00';

    if(!$data['action'] OR $data['action'] === 'Not Open'){
        include "./not_open_all_list_and_mutual/index.php";//print_r($list_total_sub_arr);die();
    }//End if condition
    
    $cols = "SELECT crt.email_ref_id,crt.action_date,crt.action_time,st.full_name,st.email,crt.action";
    $query = "
        FROM $campaign_report_table AS crt
        INNER JOIN $subscribers_table AS st ON crt.email_ref_id = st.id
        INNER JOIN $campaign_table AS ct ON crt.campaign_ref_id = ct.id AND ct.inserted_by = '$session_user_id'
    ";
    $where = "WHERE (DATE(action_date) BETWEEN '$fromDate' AND '$toDate')";
    #If has ESPS Server
    include "./not_open_all_list_and_mutual/1_esps_condition.php";
    #If has ESPS Account
    include "./not_open_all_list_and_mutual/2_esps_sc_condition.php";
    #If has campaign
    include "./not_open_all_list_and_mutual/3-2-campaign_condition.php";

    #If has list
    if(!$data['single_list']){
        if(@$data['list_ref_id']){
            $where .= " AND st.list_ref_id LIKE '%".$data['list_ref_id']."%'";
        }else{
            $cols .=',st.list_ref_id';
            if(@$data['campaign_ref_id']){
                if(!isset($list_names_np)){$list_names = getListNamesByids($data['list_ref_ids']);}else{$list_names = $list_names_np;}
            }else{
                $list_names = getAllListNames();
            }//End if condition
        }//End if condition
    }//End if condition






    #If has action 
    $itJustUnsubscribedData = false; #(If action is just 'Unsubscribed')
    if($data['action'] AND $data['action'] !== 'Not Open'){
        #$meargeUnsubscribeData is a variable for mearge unsubscribed data in response array (When no action is selected from front-end)
        $meargeUnsubscribeData = false;
        if($data['action'] === 'Unsubscribed'){
            $itJustUnsubscribedData = true;
            $where .= " AND (action = '".$data['action']."')";
        }else{
            $where .= " AND (action = '".$data['action']."' OR action = 'Unsubscribed')";
        }//End if condition        
    }else{
        $meargeUnsubscribeData = true;
    }//End if condition







    

    #Gettind data from DB and Unique Opens and Clicks
    $query = $cols.' '.$query.' '.$where;

    $arr = array();
    $arrTime = array();
    $pdo_res = executePDO($query);
    //echo $pdo_res['errorMsg'];
    while($row = $pdo_res['data']->fetch()){
        $arrTime[$row['email']] = date('M jS Y',strtotime($row['action_date'])).', '.$row['action_time'];
        unset($row['action_date']);
        unset($row['action_time']);
        $arr[] = $row;
    }//End while loop
    //print_r($arrTime);
    //print_r($arr);die();
    //echo sizeof($arr);die();
    $arr = array_unique_multidimensional($arr);#Array unique by email address (single subscriber may have more then one open or clicked)
    $arr = array_values($arr);//Reset
    //print_r($arr);
?>