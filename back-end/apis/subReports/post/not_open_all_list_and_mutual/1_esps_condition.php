<?php
    #If has ESPS Server
    if(@$data['esps_sr_id']){
        $where .= " AND ct.esps_sr_id = '".$data['esps_sr_id']."'";
    }else{
        $cols .=',esps.server_name';
        $query .="INNER JOIN $esps_table AS esps ON esps.id = ct.esps_sr_id ";
    }//End if condition
?>