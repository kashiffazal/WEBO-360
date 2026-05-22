<?php
    include "../../../others/config.php";
    include "../../../cPanel/function.php";
    $id = $_GET['id'];
    $cid = $_GET['cronJob_id'];
    $res = remove_cron_job($cid);
    if($res['status']){
        $data = array('id' => $id, 'cronJob_status' => 'remove', 'sendType' => '','scheduleDateTime' => '');
        $res = dbQuery('post',$data,$campaign_table);
    }//End if condition  

    //$res = array('status' => true);

    $res['successNotify'] = true;
    $res['successMsg'] = 'Campaign has been unscheduled successfully.';
    echo json_encode($res);
?>