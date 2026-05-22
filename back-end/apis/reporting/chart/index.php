<?php
    include "../../../others/config.php";
    include "../functions_chart.php";

    $campaign_id            = $_GET['id'];
    $type                   = $_GET['type'];

    #Get campaign and campaign report data
    include "./campaign_and_report_data.php";

    $infoArr = array(
        'color'             => array('#4a9e05','#468dc7','red'),
        'name'              => array('opens','clicks','unsubscribe'),
        'lineWidth'         => array(4,4,4),
        'labelIndex'        => array('Opened','Clicked','Unsubscribed'),
        'other'             => array('tickInterval' => 5, 'height' => 200)
    );

    if($type == '1'){       #Getting graph (for 2 days) -----------------------------#
        $xAxis              = xAxisListOfDateTime(@$c_data['sent_date']." ".@$c_data['sent_time']);//print_r($xAxis);exit();
        $res                = getOpenClickUnsubscribeChartArr($xAxis,$cr_data,$c_data['sent_date']);//print_r($res);exit();

        //Getting Bounce or Spam
        include "../bounce_spam/index.php";//print_r($bs);die();
        $res['pieGraph'] = campaign_report(false,$c_data,$cr_data);//print_r($res);exit();

    }//End if condition

    if($type == '2'){       #Getting graph (day wise)
        $infoArr['other']   = array('tickInterval' => 0, 'height' => 250);
        $res                = getOpenClickUnsubscribeChartArrFull($cr_data,$c_data['sent_date']);
    }//End if condition
    $res['status'] = true;


    //print_r($res);
    echo json_encode($res);

?>