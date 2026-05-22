<?php
    $query = $cols.' '.$query.' '.$where;
    $pdo_res = executePDO($query);
    //echo $pdo_res['errorMsg'];
    $cdata = array();
    $list_ids = array();
    while($row = $pdo_res['data']->fetch()){
        $list_ids = array_merge($list_ids,explode(',',$row['list_ref_id']));
        $cdata[] = $row;
    }//End while loop
    $list_ids = array_unique($list_ids);
    //print_r($cdata);die();
?>