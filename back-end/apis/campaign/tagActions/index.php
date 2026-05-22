<?php

  $DIRECT_ACCESS_PAGE = 'true';
  $app_no_session = true;
  include "../../../others/config.php";

  $params = $_GET['params'];
  $params = explode("-",$params);

  //$page = $params[0];//Getting page label for redirection
  //unset($params[0]);//Remove page label
  #----------------------------------#

  $res = array();
  //print_r($params);
  #If last param has p flag then any action will not record in DB like click, open and unsubscribe 
  if(end($params) == 'pr'){
    array_pop($params);//Deleting last array item
    $res['preview_link'] = true;
  }else{
    $res['preview_link'] = false;
  }//End if condition

  //Decode letter into number
  $params = explode("-",@letterToNumber(implode("-",$params)));
  
  //$res['page_label'] = $page;
  $res['campaign_id'] = $params[0];
  $res['subscriber_id'] = $params[1];
  $res['link_url'] = @$params[2];

  echo json_encode($res);

?>