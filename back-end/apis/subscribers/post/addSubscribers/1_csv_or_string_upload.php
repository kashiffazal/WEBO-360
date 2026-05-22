<?php

  $app_post_data = true;
  include "../../../../others/config.php";
  $path = "../../../../uploaded_files/temp_csv/";
  deleteFilesFromDir($path,array(),$session_user_id.'-$-');//Delete old temp files with prefix

  #if CSV file is provided -------------------#
  if(isset($_FILES['csvFile'])){
    //Upload file if CSV provided
    $res = fileUpload($_FILES['csvFile'],$path,$session_user_id."-$-");
    if($res['status']){
      $fileName = $res['fileName'];
      $res = getCSVdata($path.$fileName);
      $importFromList = 'true';
    }//If file uploaded then get data in array
  }else{
    #Getting list name
    $res = commaSeparatedStrToCSV($_POST['emailList'],$path,$session_user_id."-$-c-".str_replace(" ","-",$_POST['list_name']));
    $fileName = $res['fileName'];
    $importFromList = 'false';
  }//End if condition
  #--------------------------------------------#

  if($res['status']){
    $res = $res['data'];
    #Check label is given or unknown
    $columnLabel = true;
    //If it found email at first row it's mean label is not given
    foreach($res[0] as $value){if(filter_var(trim($value),FILTER_VALIDATE_EMAIL)){$columnLabel = false;break;}}//End foreach
    #Getting number of rows according to label from start 
    if($columnLabel){
      #if it has label then get 6 rows and separate labels from main array
      $res = array_slice($res,0,4);
      #Separate labels from main array 
      $labelArr = array();
      foreach($res[0] as $value){$labelArr[]  = ucfirst($value);}//End foreach
      unset($res[0]);//Delete labels from main array
      $res = array_values($res);//Reset main array indexes
    }else{
      #Otherwise go normally
      $res = array_slice($res,0,3);
    }//End if condition

    #Creating array for response
    if(sizeof($res) >= 1){
      $arr = array();
      foreach($res[0] as $key => $value){
        #Set labels
        $arr[$key][0] = ($columnLabel AND isset($labelArr[$key])) ? $labelArr[$key] : "UNKNOWN";
        #Set list values 
        foreach($res as $keyInner => $valueInner){$arr[$key][1][] = (isset($valueInner[$key]) ? $valueInner[$key] : '-');}//End foreach inner
      }//End foreach

      //Col list for dropdown
      $colList = array(
        array('key' => 0, 'label' => 'Nothing (skip)', 'value' => 'skip', 'disabled' => false),
        array('key' => 1, 'label' => 'Email Address', 'value' => 'email', 'disabled' => false),
        array('key' => 2, 'label' => 'Full Name', 'value' => 'full_name', 'disabled' => false),
        array('key' => 3, 'label' => 'First Name', 'value' => 'first_name', 'disabled' => false),
        array('key' => 4, 'label' => 'Last Name', 'value' => 'last_name', 'disabled' => false),
        array('key' => 5, 'label' => 'Sign Up IP', 'value' => 'sign_up_ip', 'disabled' => false),
        array('key' => 6, 'label' => 'Sign Up URL', 'value' => 'sign_up_url', 'disabled' => false),
        array('key' => 7, 'label' => 'Sign Up Date', 'value' => 'sign_up_date', 'disabled' => false)
      );

      $res = array();
      $res['status'] = true;
      $res['data']['dataList'] = $arr;
      $res['data']['colList'] = $colList;
      $res['data']['fileName'] = $fileName;
      $res['data']['importFromList'] = $importFromList;
      $res['data']['selectionError'] = array(
        'errorTitle' => 'Selection Error',
        'errorMsg' => 'Maybe you selected wrong email column.'
      );
      $res['data']['duplicateError'] = array(
        'errorTitle' => 'Duplication',
        'errorMsg' => 'Duplicate columns are selected as '
      );
      $res['data']['forgotEmailError'] = array(
        'errorTitle' => 'Missing Email',
        'errorMsg' => 'Maybe you forgot to select email column, Please review list.'
      );
    }else{
      $res = array();
      $res['status'] = false;
      $res['errorTitle'] = "Incorrect data";
      $res['errorMsg'] = "Please provide valid emails";
    }//End if condition
  }//End if condition

  echo json_encode($res);




?>  