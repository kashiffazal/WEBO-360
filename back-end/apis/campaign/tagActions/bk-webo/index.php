<?php

  include "./crul.php";
  
  $params = end($params);
  $data = callAPI("GET",$domainPath."/index.php?params=".$params,false,true);

  $ei     = $data['subscriber_id'];
  $cid    = $data['campaign_id'];
  $lid    = $data['link_url'];

  if($data['page_lable'] == 'l'){
    $res = callAPI("GET",$domainPath."/getClickers.php?ei=".$ei."&cid=".$cid."&lid=".$lid,false,true);
    header('Location: '.$res['click_url']);
    die();
  }//End if condition

  if($data['page_lable'] == 't'){
    $res = callAPI("GET",$domainPath."/tracker.php?ei=".$ei."&cid=".$cid);
  }//End if condition

  if($data['page_lable'] == 'u'){
    $res = callAPI("GET",$domainPath."/unsubscrib.php?ei=".$ei."&cid=".$cid);
    header('Location: ./unsubscribed.php');
    die();
  }//End if condition

?>
