<?php
  
  include "../../others/config.php";

  $sql = "SELECT id,campaign_name,list_ref_id,recipientsCount,status,inserted_date,inserted_time,bounceCount,sent_date,sent_time FROM $campaign_table WHERE status = 'sent' AND inserted_by = '$session_user_id' ORDER BY id DESC";
  $list_data = dbQuery($sql);
  if(!$list_data['error']){
    $list_data['status'] = true;

    foreach($list_data['data'] as $key => $value) {
      $value['sent_date'] = date('M jS Y',strtotime($value['sent_date']));

      //Getting all possible dates starting with sent date
      $chart_date = array($value['sent_date']);
      foreach($value['clicker'] as $cl_value){$chart_date[] = $cl_value['data'];}//end foreach
      foreach($value['opener']  as $op_value){$chart_date[] = $op_value['data'];}//end foreach
      $chart_date = sortDate($chart_date);
      $chart_date = dateByDays($chart_date[0],false,"Y-m-d",$chart_date[sizeof($chart_date)-1]);
      $value['chart_dates'] = $chart_date;

      $opValues = array();
      $clValues = array();
      foreach($chart_date as $cd_value){
        $op_temp = array();
        $cl_temp = array();
        foreach($value['opener'] as $op_value){
          if($cd_value == $op_value['data']){$op_temp[] = 1;}//End if condition
        }//End foreach
        foreach($value['clicker'] as $cl_value){
          if($cd_value == $cl_value['data']){$cl_temp[] = 1;}//End if condition
        }//End foreach
        $opValues[] = sizeof($op_temp);
        $clValues[] = sizeof($cl_temp);
      }//End foreach
      $value['chart_opens'] = $opValues;
      $value['chart_clicks'] = $clValues;

      $value['pieChartData'] = array();


      $list_data['data'][$key] = $value;


    }//End foreach

    //$list_data['chart_dates'] = array("2018-09-01","2018-09-02","2018-09-03","2018-09-19","2018-09-20","2018-09-21T05:30:00","2018-09-22T06:30:00");

  }//end if condition
  echo json_encode($list_data);

?>
