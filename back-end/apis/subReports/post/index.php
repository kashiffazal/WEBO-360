<?php
    include "./fetchDB.php";
    $arr = array_reverse($arr);
    $i = 1;
    $unsubEmail = array();
    foreach($arr as $key => $row){
        $row['key'] = $i;
        $row['action_date'] = $arrTime[$row['email']];
        #Add List name if there is more then one list
        if(@$list_names){foreach($list_names as $vl){if(strpos($row['list_ref_id'],$vl['id']) !== false ){$row['list_name'] = $vl['list_name'];}}}//End if condition
        
        if(@$espsData){
            $row['account_name'] = $espsData[$row['esps_sr_id']][$row['esps_sr_ac_id']];
            unset($row['esps_sr_id']);
            unset($row['esps_sr_ac_id']);
        }//End if condition

        #if there is subscriber list for not opener 
        if(isset($list_total_sub_arr)){unset($list_total_sub_arr[$row['email_ref_id']]);}//End if condition
        unset($row['email_ref_id']);

                
        #Get and Avoid All Unsubscribed row form array
        if(!$itJustUnsubscribedData){
            if($row['action'] === 'Unsubscribed'){
                $unsubEmail[] = $row;
                unset($arr[$key]);
            }else{
                $arr[$key] = $row;
                $i++;
            }//End if condition
        }else{
            $arr[$key] = $row;
            $i++;
        }//End if condition


    }//End foreach
    //print_r($arr);die();

    #Remove Unsubscriber 'Opened' and 'Clicked' data if exists (If subscriber has unsubscribe then don't show His Opened and Click Data)
    if(!$itJustUnsubscribedData){
        $dt = $arr;
        foreach($arr as $key => $value){
            #Search email in $unsubEmail array (Multidimensional) array
            $exists = array_search($value['email'], array_column($unsubEmail, 'email'));
            if($exists !== false){unset($dt[$key]);}
        }//End foreach
        $arr = $dt;
        if($meargeUnsubscribeData){
        // if($meargeUnsubscribeData){
            $arr = array_merge($arr,$unsubEmail);
            $arr = array_values($arr);
            #Sort by Date
            usort($arr, function ($ar1, $ar2) { 
                $datetime1 = strtotime($ar1['action_date']); 
                $datetime2 = strtotime($ar2['action_date']); 
                return $datetime1 - $datetime2; 
            }); 
            $arr = array_reverse($arr);
        }else{
            $arr = array_values($arr);
            $arr = array_reverse($arr);
        }//End if condition
    }//End if condition
    //print_r($arr);die();
    //--------------------------------------------------------------------------------------------------------//

    #If there is subscriber list for not opener then mearge and set keys again for front-end table 'Sr'
    if(isset($list_total_sub_arr)){
        if($data['action'] === 'Not Open'){
            $arr = array_values($list_total_sub_arr);
        }else{
            $arr = array_merge($arr,$list_total_sub_arr);
            $i = 1;
            foreach($arr as $key => $row){$arr[$key]['key'] = $i++;}//End foreach
        }//End if condition
    }//End if condition


    //print_r($list_total_sub_arr);
    //print_r($arr);
    if(@!$exportIn){echo json_encode(array('status' => true, 'data' => $arr));}
?>