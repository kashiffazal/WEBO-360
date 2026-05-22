<?php

  $data = callAPI("GET",$domainPath."tagActions/index.php?params=".$paramsVal,false,true);
  $domainPath = $domainPath."tagActions";

  $ei       = $data['subscriber_id'];
  $cid      = $data['campaign_id'];
  $lid      = $data['link_url'];
  $preview  = $data['preview_link'];

  if($data['page_label'] == 'l'){
    $res = callAPI("GET",$domainPath."/getClickers.php?ei=".$ei."&cid=".$cid."&lid=".$lid."&preview=".$preview,false,true);
    header('Location: '.$res['click_url']);
    die();
  }//End if condition

  if($data['page_label'] == 't'){
    if(!$preview){
      $res = callAPI("GET",$domainPath."/tracker.php?ei=".$ei."&cid=".$cid);
    }//End if condition
  }//End if condition

  if($data['page_label'] == 'u'){
    if(!$preview){
      $res = callAPI("GET",$domainPath."/unsubscribe.php?ei=".$ei."&cid=".$cid);
    }//End if condition
    header('Location: ./unsubscribed.php');
    die();
  }//End if condition

?>