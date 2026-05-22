<?php

    if(@$_GET['app_no_session'] == 'true'){
        $app_no_session = true;
        $session_user_id = @$_GET['session_user_id'];
        $DIRECT_ACCESS_PAGE = 'true';
    }//End if condition

    include "../../../../others/config.php";

    $id = $_GET['id'];
    $res = array();

    include "./personal_details.php";//print_r($data);exit();
    $res['personal_data'] = $data;
    include "./activities.php";//print_r($activity);exit();
    $res['activity_data'] = $activity;
    include "./opeClickPercentage.php";//print_r($percentageData);exit();
    $res['percentageData'] = $percentageData;

    //Getting Status Data From DB
    $statusData = dbQuery("SELECT id,status FROM $subscriber_status_table");
    $res['statusData'] = $statusData['data'];
    #Adding bulkAction list-------------------------#


    
    $res['status'] = true;
    echo json_encode($res);

?>