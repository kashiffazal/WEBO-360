<?php

  if(@$_GET['app_no_session'] == 'true'){
    $app_no_session = true;
    $session_user_id = @$_GET['session_user_id'];
    $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition
  
  $campaign_id = @$_GET['id'];
  $keyword = $_GET['keyword'];

  //Allow POST just for 'uniquePersonClicked' keyword
  if($keyword === 'uniquePersonClicked'){
    $app_post_data = true;
  }//End if condition
  
  include "../../../others/config.php";
  include "../functions_chart.php";
  
  if($keyword === 'uniqueOpen'){
    $res = unique_opened($campaign_id);
  }//End if condition

  if($keyword === 'notOpened'){
    $res = not_opened($campaign_id);
    //print_r($res);
  }//End if condition

  if($keyword === 'openedSoFar'){
    $res = opened_all($campaign_id);
  }//End if condition

  if($keyword === 'clickedALink'){
    $res = clicked_links($campaign_id);
  }//End if condition

  if($keyword === 'unsubscribed'){
    $res = unsubscribed($campaign_id);
  }//End if condition
  
  if($keyword === 'uniquePersonClicked'){
    $list_id_array = $_POST['data'];
    $res = unique_link_per_person($list_id_array);
  }//End if condition

  if($keyword === 'bounced'){
    $res = bounced($campaign_id);
  }//End if condition

  if($keyword === 'spam'){
    $res = spam($campaign_id);
    //print_r($res);die();
  }//End if condition

  echo json_encode($res);

?>