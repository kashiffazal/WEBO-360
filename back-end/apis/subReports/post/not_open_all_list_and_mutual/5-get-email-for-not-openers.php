<?php

//$list_ids = array('45', '46');
//print_r($list_ids);

if(@$data['list_ref_id']){
    $list_ids = array($data['list_ref_id']);
}else if(@$data['list_ref_ids']){
    $list_ids = explode(',',$data['list_ref_ids']);
}//End if condition

$list_names_np = getListNamesByids(implode(',', $list_ids));
$list_ids = array_chunk($list_ids, 20);
//print_r($list_ids);
$query_arr = array();
$list_query = "SELECT id,full_name,email,list_ref_id FROM $subscribers_table WHERE ";
foreach ($list_ids as $vl) {
    $li_where_co_arr = array();
    foreach ($vl as $v) {$li_where_co_arr[] = "list_ref_id LIKE '%$v%'";} //End foreach
    $query_arr[] = $list_query . implode(' OR ', $li_where_co_arr) . " AND status = '1'";
} //End foreach
//print_r($query_arr);die();

$key = 1;
$list_total_sub_arr = array();
foreach ($query_arr as $query) {
    $pdo_res = executePDO($query);
    //echo $pdo_res['errorMsg'];
    while ($row = $pdo_res['data']->fetch()) {
        #Getting campaign data with list
        foreach ($cdata as $vl) {
            $vli = explode(',', $vl['list_ref_id']);
            //print_r($vl);
            foreach ($vli as $v) {
                if (strpos($row['list_ref_id'], $v) !== false) {
                    $row['server_name'] = @$vl['server_name'];
                    if (isset($espsData)) {$row['account_name'] = $espsData[$vl['esps_sr_id']][$vl['esps_sr_ac_id']];}
                    //$row['esps_sr_id']      = $vl['esps_sr_id'];
                    //$row['esps_sr_ac_id']   = $vl['esps_sr_ac_id'];
                    if(@$vl['campaign_name']){$row['campaign_name'] = $vl['campaign_name'];}//End if condition
                    //$row['list_ref_id_aaaaa']   = $vl['list_ref_id'];
                    #Add List name if there is more then one list
                    foreach ($list_names_np as $ln) {if ($v === $ln['id']) {$row['list_name'] = $ln['list_name'];}} //End if condition
                } //End if condition
            } //End foreach
        } //End foreach
        $rowId = $row['id'];
        $row['action'] = 'Not Open';
        $row['key'] = $key;
        $row['action_date'] = '-';
        unset($row['id']);
        $list_total_sub_arr[$rowId] = $row;
        $key++;
    } //End while loop
} //End fireach

//echo sizeof($list_total_sub_arr);die();
//echo json_encode($list_total_sub_arr);die();
//print_r($list_total_sub_arr);die();
