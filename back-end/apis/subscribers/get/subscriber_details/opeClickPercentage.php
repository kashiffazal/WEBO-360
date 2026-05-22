<?php

    #Getting percentage
    if(isset($campaignIds)){
        $total_campaign = sizeof($campaignIds);
    }else{
        $total_campaign = 0;
    }//End if condition

    #Getting unique open and click per campaign -------------------------//
    $campaignUniqueOpenClick = array();//End array
    $i = 0;
    foreach($resData as $fvalue){
        //print_r($fvalue);
        foreach($fvalue['data'] as $svalue){
            foreach($svalue['details'] as $tValue){
                if($tValue['action'] == 'Opened'){
                    $campaignUniqueOpenClick[$i]['open'] = $tValue['action'];
                }//End if condition
                if($tValue['action'] == 'Clicked'){
                    $campaignUniqueOpenClick[$i]['click'] = $tValue['action'];
                }//End if condition
            }//End foreach
        }//End foreach
        $i++;
    }//End foreach
    //-------------------------------------------------------------------//

    #Getting count of total open and total click
    $totalOpen = 0;
    $totalClick = 0;
    foreach($campaignUniqueOpenClick as $value){
        if(isset($value['open'])){
            $totalOpen = ($totalOpen + 1);
        }//End if condition
        if(isset($value['click'])){
            $totalClick = ($totalClick + 1);
        }//End if condition
    }//End foreach loop

    #Get percentage finally
    if($totalOpen){
        $openPer = ($totalOpen /  $total_campaign * 100);
    }else{
        $openPer = 0;
    }//End if condition
    if($totalClick){
        $clickPer = ($totalClick /  $total_campaign * 100);
    }else{
        $clickPer = 0;
    }//End if condition
    

    $percentageData = array();
    $percentageData['openPer']  = $openPer;
    $percentageData['clickPer'] = $clickPer;

    //print_r($percentageData);

?>