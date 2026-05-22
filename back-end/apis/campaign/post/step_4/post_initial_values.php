<?php
  $app_post_data = true;
  include "../../../../others/config.php";
  
  $scheduleStatus = false;
  $scheduleSuccessArr = array();
  if($_POST['sendType'] != 'now'){
    if(@$_POST['scheduleDateTime']){
      // include "../../../../cPanel/function.php";
      $_POST['scheduleDateTime'] = http_build_query($_POST['scheduleDateTime']);
      $scheduleDateTime = setScheduleDate($_POST['scheduleDateTime']);
      // $cronJob = create_cron_job($_POST['scheduleDateTime'], $domainPath."/apis/campaign/post/step_4/index.php?id=".$_POST['id']."&app_no_session=true&session_user_id=".$session_user_id);
      $cronJob = array('status' => true, 'data' => array('linekey' => '1'));

      if(!$cronJob['status']){
        return array('status' => false, 'errorMsg' => 'Could not schedule campaign', 'consoleError' => $cronJob['errorMsg']);die();
      }else{
        $_POST['cronJob_id'] = $cronJob['data']['linekey'];
        $_POST['cronJob_status'] = 'added';
        $scheduleStatus = true;
        $scheduleSuccessArr = array('successNotify' => true, 'successMsg' => 'Campaign has been scheduled successfully');
      }//End if condition

    }else{
      unset($_POST['scheduleDateTime']);  
    }//End if condition
  }else{
    unset($_POST['scheduleDateTime']);
  }//End if condition
  
  $res = dbQuery('post',$_POST,$campaign_table,'id');
  $res['schedule_date'] = @$scheduleDateTime;
  $res['schedule_status'] = $scheduleStatus;
  $res = array_merge($res,$scheduleSuccessArr);
  
  echo json_encode($res);

?>

