<?php
    #If has ESPS Account
    if(@$data['esps_sr_ac_id']){
        $cols .=',ct.esps_sr_id,ct.esps_sr_ac_id';
        $where .= " AND ct.esps_sr_id = '".$data['esps_sr_id']."' AND ct.esps_sr_ac_id = '".$data['esps_sr_ac_id']."'";
    }else{
        $cols .=',ct.esps_sr_id,ct.esps_sr_ac_id';
        #Get and set ESPS Server and Account Name array from DB to set Account Name in array
        if(!isset($espsData)){
            $espsData = getESPSserverAndAccountList();
            $espsData = $espsData['data'];
            if(isset($espsData)){
                $arr = array();
                foreach($espsData as $vl){foreach($vl['data'] as $v){$arr[$vl['id']][$v['id']] = $v['account_name'];}}//End foreach
            }//End if condition
            $espsData = $arr;
        }//End fi condition
        //print_r($espsData);die();
    }//End if condition
?>