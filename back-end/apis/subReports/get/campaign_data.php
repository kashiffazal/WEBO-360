<?php
    include "../../../others/config.php";

    $srid = $_GET['srid'];
    $srAcId = $_GET['srAcId'];

    #Getting campaign Name list
    $srAcIdWhere = $srAcId ? "AND esps_sr_ac_id = '$srAcId'" : '';
    $res = dbQuery("SELECT id,campaign_name,list_ref_id,sent_date FROM $campaign_table WHERE status = 'sent' AND esps_sr_id = '$srid' $srAcIdWhere AND inserted_by = '$session_user_id' ORDER BY id DESC");

    echo json_encode($res);
?>