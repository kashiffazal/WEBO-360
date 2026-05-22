<?php
  
  if(@$_GET['app_no_session'] == 'true'){
      $app_no_session = true;
      $session_user_id = @$_GET['session_user_id'];
      $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition

  include "../../../../../others/config.php";

  $id = $_GET['id'];

  function uniqueElementsFromArray($mainArr,$compareArr){
    $mainArrCount = sizeof($mainArr);
    $mainArr = array_merge($mainArr,$compareArr);
    $mainArr = array_unique($mainArr);
    $uniqueCount = sizeof($mainArr) - $mainArrCount;
    if($uniqueCount < 0){$uniqueCount = 0;}
    return $uniqueCount;
  }//End function

  if(isset($id)){
    $campaign_data = get_campaign_data("list_ref_id",$id);
    $campaign_data = @$campaign_data['list_ref_id'];
    $campaign_data = explode(",",$campaign_data);
  }else{
    $campaign_data = array();
  }//End if condition
  //print_r($campaign_data);

  $list_data = dbQuery("SELECT id,list_name FROM $subscriber_list_table WHERE inserted_by = '$session_user_id'");
  //print_r($list_data);

  if($list_data['status']){
    
    $totalEmails = 0;
    $totalUniqueEmails = 0;
    $index = 0;

    
    foreach($list_data['data'] as $key => $value){
      $list_id = $value['id'];
      $listCount = dbQuery("SELECT id,email FROM $subscribers_table WHERE list_ref_id LIKE '%$list_id%' AND status = '1'");

      #Getting Unique Email count -----------------------------------//
      $allEmails = array();
      foreach($listCount['data'] as $keyEmail => $valueEmail){
        $allEmails[] = $valueEmail['email'];
      }//End foreach

      if(($key-1) < 0){
        $value['uniqueEmailcount'] = sizeof($allEmails);
      }else{
        $value['uniqueEmailcount'] = uniqueElementsFromArray($list_data['data'][0]['emailList'],$allEmails);
      }//End if condition
      
      $value['emailList'] = $allEmails;
      #-------------------------------------------------------------//

      $value['count'] = sizeof($listCount['data']);

      #Default check and uncheck ------------------------------//
      $value['checked'] = in_array($value['id'],$campaign_data);
      $value['index'] = $index;
      $index++;
      if($value['checked']){
        $totalEmails = $totalEmails + $value['count'];
        $totalUniqueEmails = $totalUniqueEmails + $value['uniqueEmailcount'];
      }//End if condition
      #--------------------------------------------------------//
      

      $list_data['data'][$key] = $value;
      
    }//End foreach
     $list_data['data'] = addKeyInArray($list_data['data']);

    $list_data['totalEmails'] = $totalEmails;
    $list_data['totalUniqueEmails'] = $totalUniqueEmails;

  }//End if condition

  echo json_encode($list_data);

?>
