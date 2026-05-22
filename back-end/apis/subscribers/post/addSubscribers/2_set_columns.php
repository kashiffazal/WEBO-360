<?php

  $app_post_data = true;
  include "../../../../others/config.php";
  $path = "../../../../uploaded_files/temp_csv/";
  
  $data = $_POST['data'];
  //Removing skip values from array
  $data['values'] = array_diff($data['values'], ['skip']);
  $data['label'] = array_diff($data['label'], ['Nothing (skip)']);
  //Hide values from array (hide for front-end but data will be in CSV)
  $hideValArr = array(
    array('sign_up_url', 'sign_up_date','sign_up_ip'),
    array('Sign Up URL', 'Sign Up Date','Sign Up IP')
  );

  $list_ref_id = encrypt_decrypt('decrypt',$data['list_ref_id']);
  $fileName = $data['fileName'];
  $fileNameNoExtension = pathinfo($fileName, PATHINFO_FILENAME);//Get file name without extension

  $res1 = getCSVdata($path.$fileName);//Get all data from CSV
  //print_r($res1);die();
  $res2 = mergeDBandCSV($res1['data'],$data,false);//Include database values into data if available
  $res3 = arrayToCSV($res2['data'],$path,$fileNameNoExtension);//Create new CSV with db value (ready to update/insert in db)

  //Create new array for for end
  $res3['arrayData'] = remove_unwanted_columns_for_front_end($res2,$hideValArr);
  //$res3['arrayData'] = $res2;
  $res3['subscriberDeleteSure'] = "Are you sure delete this subscriber?";
  $res3['subscriberDeleteMsg'] = "Subscriber has been deleted.";

  //Remove first label row after creating CSV
  unset($res3['arrayData']['data'][0]);
  $res3['arrayData']['data'] = array_values($res3['arrayData']['data']);

  echo json_encode($res3);

?>