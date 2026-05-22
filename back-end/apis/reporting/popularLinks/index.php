<?php
    include "../../../others/config.php";
    include "../functions_chart.php";
    $id = $_GET['id'];
    #Link details
    $res = campaign_report($id);
    $res['status'] = true;
    echo json_encode($res);
?>