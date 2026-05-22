<?php

  $app_post_data = true;
  include "../../../../others/config.php";
  $path = "../../../../uploaded_files/temp_csv/";

  $data = $_POST['data'];
 // $list_ref_id = encrypt_decrypt('decrypt',$data['list_ref_id']);
  $fileName = $data['fileName'];

  $res = getCSVdata($path.$fileName,true);//Get all data from CSV
  $res = $res['data'];

  #Deleting given index from CVS data
  foreach($data['deleteKeys'] as $value){unset($res[$value]);}//End foreach

  $res = separate_insert_and_update_list($res);
  //print_r($res);die();
  $response = array('insert_red' => array(), 'update_red' => array());
  //Inserting new clients in DB
  if($res['insert']){
    $response['insert_red'] = insert_SQL_multiple_row($res['insert'],$subscribers_table);
    $insertCount = $response['insert_red']['size'];

  }else{$insertCount = 0;}//End if condition
  //Updating existing client in DB
  if($res['update']){
    $response['update_red'] = update_subscribers($res['update']);
    $updateCount = sizeof($res['update']);
  }else{$updateCount = 0;}//End if condition


  //print_r($res['insert']);
  //print_r($response['insert_red']);die();
  #Error Handling
  if($res['insert'] && !$response['insert_red']['status']){
    $response = $response['insert_red'];
  }else{
    $response['status'] = true;
    $response['successTitle'] = 'Success';
    $response['successMsg'] = $insertCount.' subscribers has been added and '.$updateCount.' updated.';
    $response['successNotify'] = true;
    $response['successNotifyType'] = 'notify';
    $response['successDuration'] = 10;
  }//End if condition
  //print_r($res);
  echo json_encode($response);

?>