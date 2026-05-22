<?php

    $ct = $campaign_table;
    $crt = $campaign_report_table;

    //Getting personal details
    $activity = dbQuery("SELECT $ct.id, $ct.inserted_by, $crt.* FROM $ct, $crt WHERE $ct.inserted_by = '$session_user_id' AND $ct.id = $crt.campaign_ref_id AND $crt.email_ref_id = '$id'");
    $activity = $activity['data'];
    //print_r($activity);

    //Getting all unique campaign ids5
    $campaignIds = array();
    foreach($activity as $key => $value){
        parse_str($value['location'], $value['location']);
        $campaignIds[] = $value['campaign_ref_id'];
        $activity[$key] = $value;
    }//End foreach
    $campaignIds = array_unique($campaignIds);
    //print_r($campaignIds);


    //Getting campaign data
    $campaignData = array();
    foreach($campaignIds as $value){
        $cam_data = dbQuery("SELECT id,campaign_name,sent_date,sent_time,recipientsCount,bounceCount FROM $campaign_table WHERE id = '$value'");
        $cam_data = $cam_data['data'][0];
        //Date difference label --------------------//
        $cam_data['leftTime'] = "Sent ";
        $cam_data['leftTime'] .= dateDifference($cam_data['sent_date'].$cam_data['sent_time']);
        $cam_data['leftTime'] .= "Ago at ".$cam_data['sent_time'];
        //------------------------------------------//
        $campaignData[$value] = $cam_data;
    }//End foreach
    //print_r($campaignData);


    $resData = array();
    $i = 0;
    foreach($campaignData as $value){
        $resData[$i]['campaign_data'] = $value;
        $temp = array();
        $dateArr = array();
        foreach($activity as $dv){
            if($dv['campaign_ref_id'] === $value['id']){
                $temp[$dv['action_date']][] = $dv;//Push data in temp array date wise
                $dateArr[] = $dv['action_date'];
            }//End if condition
        }//End foreach
        //Getting unique dates of specific campaign
        $dateArr = array_values(array_unique($dateArr));
        $newArr = array();
        foreach($dateArr as $k => $v){
            $newArr[$k]['date'] = date('d M, Y', strtotime($v));
            $newArr[$k]['details'] = $temp[$v];
        }//End foreach
        $resData[$i]['data'] = $newArr;
        $i++;
    }//End foreach
    $activity = $resData;

?>