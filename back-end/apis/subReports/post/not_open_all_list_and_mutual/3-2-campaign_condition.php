<?php
    #If has campaign
    if(@$data['campaign_ref_id']){
        $where .= " AND campaign_ref_id = '".$data['campaign_ref_id']."'";
    }else{
        $cols .=',ct.campaign_name';
    }//End if condition
?>