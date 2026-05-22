<?php

  function login_with_session($postArr,$getColArr = '*'){
    global $users_table;
    global $users_status_table;
    $activeStatusId = '1';
    $unverifiedStatusId = '4';
    //Adding keys to array
    $colKey = array();
    $colValue = array();
    foreach($postArr as $key => $value){
      $colKey[] = $key;
      $colValue[] = $value;
    }//End foreach

    $username = "$colKey[0] = '$colValue[0]' AND ";
    $password = "$colKey[1] = '$colValue[1]'";
    $condition = $username.$password;
    if($getColArr != '*'){$getColArr = "id,status,".$getColArr;}

    $data = fetchDataFromDB("SELECT $getColArr FROM $users_table WHERE $condition");
    $response = array();
    if(isset($data['data'][0]['id'])){

      $user_id = $data['data'][0]['id'];
      $user_status_id = $data['data'][0]['status'];
      $user_name = $data['data'][0]['first_name']." ".$data['data'][0]['last_name'];
      $user_email = $data['data'][0]['email'];
      $user_role_id = $data['data'][0]['kc'];

      //Get Status 
      $status_data = fetchDataFromDB("SELECT id,status,errorTitle,errorMsg FROM $users_status_table WHERE id = '$user_status_id'");
      $status_data = $status_data['data'][0];
      //Check Status
      if(
        trim($status_data['id']) != trim($activeStatusId)
        AND
        trim($status_data['id']) != trim($unverifiedStatusId)
      ){
        $response['status'] = false;
        $response['errorTitle'] = $status_data['errorTitle'];
        $response['errorMsg'] = $status_data['errorMsg'];
        $response['errorType'] = '';
        $response['errorNotifyType'] = 'notify';
        $response['errorDuration'] = ERROR_DURATION;
      }else{
        
        if(trim($status_data['id']) == trim($unverifiedStatusId)){
          $response['unverifiedUserData'] = array('name' => $user_name,'email' => $user_email);
          $response['unverified'] = true;
        }else{
          $response['unverified'] = false;
        }//End if condition

        $_SESSION['user_id'] = $user_id;//save user id in session
        $_SESSION['user_role_id'] = $user_role_id;//save user id in session
        if(isset($_SESSION['user_id'])){
          $response['status'] = true;
          $response['successTitle'] = 'Success';
          $response['successMsg'] = 'Login successful';
          $response['successNotifyType'] = 'message';
          $response['successDuration'] = SUCCESS_DURATION;
          $response['data'] = $data['data'][0];
        }else{
          $response['status'] = false;
          $response['errorTitle'] = 'Login Failed';
          $response['errorMsg'] = 'Could not create session';
          $response['errorType'] = '';
          $response['errorNotifyType'] = 'notify';
          $response['errorDuration'] = ERROR_DURATION;
        }//End if condition

      }//End if condition

    }else{
      $response['status'] = false;
      $response['errorTitle'] = 'Invalid Inputs';
      $response['errorMsg'] = 'Incorrect username or password';
      $response['errorType'] = '';
      $response['errorNotifyType'] = 'notify';
      $response['errorDuration'] = ERROR_DURATION;
    }//end if condition
    return $response;
  }//End function

  function check_login_session(){
    if(isset($_SESSION['user_id'])){
      return $_SESSION['user_id'];
    }else{
      echo json_encode(array('status' => false, 'errorTitle' => 'Session Expired' ,'errorMsg' => 'Session has been expired, please login again.', 'errorType' => 'session-error', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION));
      die();
    }//End if condition
  }//End function

  //Check user has specific role or not (role id could be comma separated)
  function check_role_id($role_id,$user_id = false){
    if($user_id){
      $user_role_id = user_id_to_user_role_id($user_id);
    }else{
      $user_role_id = $_SESSION['user_role_id'];
    }//End if condition
    $role_id = explode(",",$role_id);
    foreach($role_id as $id){
      if(trim($id) == trim($user_role_id)){
        return true;
        break;
      }//End if condition
    }//End foreach
    return false;
  }//End function

  function user_id_to_user_role_id($id){
    global $users_table;
    $res = fetchDataFromDB("SELECT role FROM $users_table WHERE id = '$id'");
    return $res['data'][0]['role'];
  }//End function

  function executePDO($query){
    global $pdo;
    $result = $pdo->prepare($query);
    $result->execute([]);
    $error = $result->errorInfo();
    $error = $error[2];
    if($error){
      $res = array('errorTitle' => 'Database Error', 'errorMsg' => $error, 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION, 'data' => array(), 'errorType' => 'db-error');
    }else{
      $res = array('errorTitle' => '', 'errorMsg' => false, 'errorNotifyType' => '', 'errorDuration' => '','data' => $result, 'errorType' => '');
    }//End if condition
    return $res;
  }//End function

  //$dateFormat = array('inserted_date,purchase_date','d-m-Y');
  function fetchDataFromDB($SQL_query,$reverse = false,$dateFormat = false,$noRecordMsg = false){
    $pdo_res = executePDO($SQL_query);
    $arr = array();
    if(!$pdo_res['errorMsg']){
      $i = 1;
      while($row = $pdo_res['data']->fetch()){
        //Converting null to empty string
        array_walk_recursive($row,function(&$item){$item=strval($item);});
        #Change date formate if available        
        if($dateFormat){
          $colNames = explode(",",$dateFormat[0]);
          foreach($colNames as $dateColVal){
            if(@$row[$dateColVal] && @$row[$dateColVal] != ""){//If this column is available then update it
              $row[$dateColVal] = date($dateFormat[1], strtotime($row[$dateColVal]));
            }//End if condition
          }//End foreach
        }//End if condition

        $row['key'] = $i;
        $arr[] = $row;
        $i++;
      }//End while loop
      if(sizeof($arr) >= 1){
        if($reverse){$arr = array_reverse($arr);}
        $res = array('status' => true, 'data' => $arr, 'successNotify' => false, 'successTitle' => '', 'successMsg' => '', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION);
      }else{
        if($noRecordMsg){
          $res = array('status' => false, 'data' => array(), 'errorTitle' => 'Data not available', 'errorMsg' => 'No record found', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
        }else{
          $res = array('status' => true, 'data' => array(), 'successTitle' => '', 'successMsg' => '', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION);
        }//End if condition
      }//End if condition
    }else{
      $res = array('status' => false, 'errorTitle' => $pdo_res['errorTitle'], 'errorMsg' => $pdo_res['errorMsg'], 'errorType' => $pdo_res['errorType'], 'errorNotifyType' => $pdo_res['errorNotifyType'], 'errorDuration' => $pdo_res['errorDuration']);
    }//End if condition
    return $res;
  }//End function

  function create_SQL_query_by_array($array,$tableName,$action,$skipArray,$whereCondition,$runQuery = false,$id = false){
    //Modifying skipArray for create index as value ---------------------------//
    $skipArrayMod = array();
    if(isset($skipArray)){foreach($skipArray as $value){$skipArrayMod[$value] = $value;}}
    //--------------------------------------------------------------------------//
    $colsString = "";
    $valuesString = "";
    $updateString = "";
    $valuesStringMod = "";
    //Creating Columns ---------------------------------------------------------------------------------------//
    foreach($array as $key => $value){
      if($value == 'undefined'){$value = "";}
      if($key == array_search($key,$skipArrayMod)){continue;}//if it's found any skiped value then skip this route
      if(gettype($value) == 'array'){

        //Merge All array into one array ----------------------------------//
        $newArray = array();$a = 0;
        foreach($value as $partialArray){
          foreach ($partialArray as $partialKey => $partialValue) {
            if($a == 0){ $newArray[$partialKey] = $partialValue;
            }else{ $newArray[$partialKey] = $newArray[$partialKey]."=>".$partialValue;}
          }//End inner foreach loop
          $a++;
        }//End outer foreach loop
        //print_r($newArray);
        //-------------------------------------------------------------------//
        foreach($newArray as $keyInner => $valueInner){
          if($keyInner == array_search($keyInner,$skipArrayMod)){continue;}//if it's found any skiped value then skip this route
          $colsString .= $keyInner .",";
          $valuesString .= "'".addslashes($valueInner) ."',";
          $updateString .= $keyInner." = '".addslashes($valueInner)."',";
        }//End 1st inner foreach

      }else{
        $colsString .= $key .",";
        $valuesString .= "'".addslashes($value) ."',";
        $updateString .= $key." = '".addslashes($value)."',";
      }//End dif condition
    }//End foreach
    $colsString = rtrim($colsString,",");
    $valuesString = rtrim($valuesString,",");
    $updateString = rtrim($updateString,",");

    if($action == "insert"){
      $query = "INSERT INTO $tableName(".$colsString.")VALUES(".$valuesString.")";
    }else if($action == "update"){
      $query = "UPDATE $tableName SET ".$updateString." WHERE ".$whereCondition;
    }else{
      $query = "Please provide action, e.g. 'insert' or 'update'";
    }//End if condition
    //--------------------------------------------------------------------------------------------------------//

    if($runQuery){
      return runQuery($query,$id);
    }else{
      return $query;
    }//End if condition

  }//End function

  function fileUpload($fileVar,$pathToUpload,$prefix = '',$maxFileSizeInKb = false){
    if($fileVar['name']){
      //if no errors...
      if(!$fileVar['error']){
        $new_file_name = strtolower($fileVar['tmp_name']); //rename file
        //file size must be in kb
        if($maxFileSizeInKb AND $fileVar['size'] > ($maxFileSizeInKb)){
          $valid_file = false;
          $res = array('status' => false, 'errorTitle' => 'Can\'t upload file', 'errorMsg' => 'Oops!  Your file\'s size is to large then '.$maxFileSizeInKb.'.', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
        }else{
          $valid_file = true;
        }//End if condition
        if($valid_file){
          $fileName = $prefix.$fileVar['name'];
          //$fileName = $fileVar['name'];
          move_uploaded_file($fileVar['tmp_name'], $pathToUpload.$fileName);
          $res = array('status' => true, 'successTitle' => 'Uploaded Successfully', 'successMsg' => 'Congratulations! Your file was accepted.', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION, 'fileName' => $fileName);
        }//End if condition
      }else{$res = array('status' => false, 'errorTitle' => 'Can\'t upload file', 'errorMsg' => 'Ooops!  Your upload triggered the following error:  '.$fileVar['errorMsg'], 'errorType' => '','errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);}//End if condition
    }else{
      $res = array('status' => false, 'errorTitle' => 'File not available', 'errorMsg' => 'Please provide file to upload', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
    }//End if condition
    return $res;
  }//End function

  #File upload and post other data (File must be uploaded then other data will be post)
  function fileUploadWithDB($fileVar,$pathToUpload,$prefix = '',$maxFileSizeInKb = false,$tableName,$colName,$whereCondition = false,$otherPostData = false,$skipArray = array(),$removeFileArr = array()){
    $res = fileUpload($fileVar,$pathToUpload,$prefix,$maxFileSizeInKb);
    $otherRes = array();
    if($res['status']){
      if($whereCondition){
        $fetchRes = fetchDataFromDB("SELECT $colName FROM $tableName WHERE $whereCondition");
        
        $oldFileName = $fetchRes['data'][0][$colName];
        $newFileName = $res['fileName'];
        if(($oldFileName &&  $oldFileName !== $newFileName)){
          @unlink($pathToUpload.$fetchRes['data'][0][$colName]);
        }//End if condition

        foreach($removeFileArr as $value){@unlink($value);}//Remove files from given path (Optional)
        $updRes = runQuery("UPDATE $tableName SET $colName = '".$res['fileName']."' WHERE $whereCondition");
        if($updRes['status']){
          if($otherPostData){
            $otherRes = create_SQL_query_by_array($otherPostData,$tableName,'update',$skipArray,$whereCondition,true);
          }//End if condition
          $response = array('status' => true, 'successTitle' => 'Success', 'successMsg' => 'File has been updated successfully.', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION, 'fileName' => $res['fileName']);
        }else{
          $response = array('status' => false, 'errorTitle' => $updRes['errorTitle'], 'errorMsg' => $updRes['errorMsg'], 'errorType' => $updRes['errorType'], 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
        }//End if condition
      }else{
        $insRes = runQuery("INSERT INTO $tableName($colName) VALUES('".$res['fileName']."')");
        if($insRes['status']){
          if($otherPostData){
            $otherRes =  create_SQL_query_by_array($otherPostData,$tableName,'update',$skipArray,"id = '".$insRes['id']."'",true);
          }//End if condition
          $response = array('status' => true, 'successTitle' => 'Success', 'successMsg' => 'File has been updated successfully', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION, 'fileName' => $res['fileName']);
        }else{
          $response = array('status' => false, 'errorTitle' => $insRes['errorTitle'], 'errorMsg' => $insRes['errorMsg'], 'errorType' => $insRes['errorType'], 'errorNotifyType' => $insRes['errorNotifyType'], 'errorDuration' => $insRes['errorDuration']);
        }//End if condition
      }//End where if condition
    }else{
      $response = array('status' => false, 'errorTitle' => $res['errorTitle'], 'errorMsg' => $res['errorMsg'], 'errorType' => $res['errorType'], 'errorNotifyType' => $res['errorNotifyType'], 'errorDuration' => $res['errorDuration']);
    }//End res if condition
    $response['otherColUpdateREs'] = $otherRes;
    return $response;
  }//End function

  #Post data with file or not (Data must be posted or updated and file is not required)
  #It's use for profile data where profile image could be provided or not
  function postDataWithFile(
    $postData,$tableName,$action,$skipArray,$whereCondition,$id, //Post or update data params
    $fileVar,$pathToUpload,$prefix,$colName //File upload params
    ){
    $res = create_SQL_query_by_array($postData,$tableName,$action,$skipArray,$whereCondition,true,$id);
    if($res['status']){
      $last_insert_id = $res['id'];
      if($action == 'update'){
        #if post data action is update then use same where condition
        $fileWhereCon = $whereCondition;
      }else{
        #Otherwise use last inserted id givin by 'create_SQL_query_by_array' at insert data
        $fileWhereCon = "id = '$last_insert_id'";
      }//End if condition
      $res['file_res'] = fileUploadWithDB($fileVar,$pathToUpload,$prefix,false,$tableName,$colName,$fileWhereCon);
    }//End if condition
    return $res;
  }//End function

  function randCode($numberCount = 4){
    if($numberCount){
      $number = $numberCount;
    }else{
      $number = 4;
    }//end if condition
    return substr(md5(microtime()),rand(0,26),$number);
  }//End function

  function randNumber($numberCount = 4){
    $res = "";
    for($i = 0; $i<$numberCount; $i++){$res .= rand(1,9);}//End foreach
    return $res; 
  }//End function

  function addKeyInArray($arr){
    $i = 1;
    foreach($arr as $key => $value){
      $value['key'] = $i++;
      $arr[$key] = $value;
    }
    return $arr;
  }//End function

  #Date difference
  function dateDifference($dateTime,$prefix = false,$postfix = false){
    $today          = new DateTime('now');
    $givenDateTime  = new DateTime($dateTime);
    $difference = $today->diff($givenDateTime);

    $res = "";

    $year = $difference->format('%y');
    $month = $difference->format('%m');
    $days = $difference->format('%d');
    $hour = $difference->format('%h');
    $mint = $difference->format('%i');
    $sec = $difference->format('%s');
    $micSec = $difference->format('%f');//Microseconds

    if($year){
      if($year > 1){
        $res .= $year." years ";
      }else{
        $res .= $year." year ";
      }//End if condition
    }else{
      if($month){
        if($month > 1){
          $res .= $month." months ";
        }else{
          $res .= $month." month ";
        }//End if condition
      }else{
        if($days){
          if($days > 1){
            $res .= $days." days ";
          }else{
            $res .= $days." day ";
          }//End if condition
        }else{
          if($hour){
            if($hour > 1){
              $res .= $hour." hours ";
            }else{
              $res .= $hour." hour ";
            }//End if condition
          }else{
              if($mint){
                if($mint > 1){
                  $res .= $mint." minutes ";
                }else{
                  $res .= $mint." minute ";
                }//End if condition
              }else{
                if($sec){
                  if($sec > 1){
                    $res .= $sec." seconds ";
                  }else{
                    $res .= $sec." second ";
                  }//End if condition
                }else{
                  if($micSec){
                    $milliSecond = $micSec;//Round up
                    $res .= $milliSecond." milliseconds ";
                  }//End if condition
                }//End if condition
              }//End if condition
          }//End if condition
        }//End if condition
      }//End if condition
    }//Emnd if condition
    $res = ($prefix ? $prefix." ".$res : $res);
    $res = ($postfix ? $res.$postfix : $res);

    return $res;
    //return $dateTime;
  }//End if condition

  function set_date($inserted_date_and_time, $showTime = false, $justSetFormat = false){
    $dateFormat = 'M jS Y';
    if(!$inserted_date_and_time){return false;}
    
    if($justSetFormat){
      if($showTime){$time = " at ".date("h:i:s a",strtotime($inserted_date_and_time));}
      return date($dateFormat,strtotime($inserted_date_and_time)).@$time;
    }//End if condition

    //return $inserted_date_and_time;
    //print_r($inserted_date_and_time);

    $data = array();
    if(gettype($inserted_date_and_time) == 'array'){
      $params = $inserted_date_and_time;
      $data['date']                 = $params['date'];
      $data['showTime']             = (@$params['showTime'] === 'undefined' ? true : (@$params['showTime'] === false ? false : true));
      $data['day_limit']            = (@$params['day_limit'] ? @$params['day_limit'] : 1);
      $data['format']               = (@$params['format'] ? @$params['format'] : $dateFormat);
      $data['prefix']               = (@$params['prefix'] ? @$params['prefix'] : 'about');
      $data['postfix']              = (@$params['postfix'] ? $params['postfix'] : 'ago');
    }else{
      $data['date']                 = $inserted_date_and_time;
      $data['showTime']             = $showTime;
      $data['day_limit']            = 1;
      $data['format']               = $dateFormat;
      $data['prefix']               = "about";
      $data['postfix']              = "ago";
    }//End if condition for gettype
    
    //print_r($data);
    //return false;

    //Getting days till now
    $today          = new DateTime('now');
    $givenDateTime  = new DateTime($data['date']);
    $difference     = $today->diff($givenDateTime);
    $days           = $difference->format('%d');

    if($days >= $data['day_limit']){
      #If time is allow then change date formate with time-------#
      $res = date($data['format'],strtotime($data['date']));
      if($data['showTime']){
        //Add time after
        $res .= " at ".date("h:i:s a",strtotime($data['date']));
      }//End if condition
      #----------------------------------------------------------#
      //$res = date($data['format'],strtotime($data['date']));
    }else{
      $res = dateDifference($data['date'],$data['prefix'],$data['postfix']);
    }//End if condition

    return $res;
    
  }//End function

  // function dateFormat($date,$time = false,$format = 'M jS Y'){
  //   if($time){
  //     return date($format,strtotime($date)).", ".$time;
  //   }else{
  //     return date($format,strtotime($date));
  //   }//End if condition
  // }//End function


  #Run SQL query like insert, update etc.
  function runQuery($query,$id = false){
    global $pdo;
    $pdo_res = executePDO($query);
    $res = array();
    if($pdo_res['errorMsg']){
      $res['status'] = false;
      $res['errorTitle'] = $pdo_res['errorTitle'];
      $res['errorMsg'] = $pdo_res['errorMsg'];
      $res['errorType'] = $pdo_res['errorType'];
      $res['errorNotifyType'] = $pdo_res['errorNotifyType'];
      $res['errorDuration'] = $pdo_res['errorDuration'];
    }else{
      $res['status'] = true;
      if($id){$res['id'] = $id;}else{$res['id'] = $pdo->lastInsertId();}
    }//End if condition
    return $res;
  }//End function

  #GET domain name from email (e.g. gmail, yahoo, etc)
  function getDomainFromEmail($email){
    $email_read_with = substr($email,strpos($email, '@')+1,strlen($email));//Getting from '@' to end
    $email_read_with = substr($email_read_with,0,strpos($email_read_with, '.'));//Getting from start to '.'
    return ucfirst($email_read_with);
  }//End function

  #Call internal php internal or external API(s)
  function callAPI($method = 'GET', $url, $data = false, $jsonDecode = false){
    //if($data){$data = json_encode($data);}
    $curl = curl_init();
    switch ($method){
      case "POST":
          curl_setopt($curl, CURLOPT_POST, 1);
          if($data){curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));}
          break;
      case "PUT":
          curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
          if($data){curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));}
          break;
      default:
          if($data){$url = sprintf("%s?%s", $url, http_build_query($data));}
    }//End switch
    // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array("cache-control: no-cache"));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    // EXECUTE:
    $result = curl_exec($curl);
    //$error = curl_error($curl);print_r($error);
    //$info = curl_getinfo($curl);print_r($info);
    if(!$result){return false;}
    curl_close($curl);
    if($jsonDecode){
      return json_decode($result,true);
    }else{
      return $result;
    }//End if condition
  }//End function

  #Redirect
  function redirect($url, $statusCode = 303){
    header('Location: ' . $url, true, $statusCode);
    die();
  }//End if condition

  function getCSVdata($fileWithPath,$csv_label = false){
    $rows = array_map('str_getcsv', file($fileWithPath));
    //$rows = array_map('array_filter', $rows);//Remove empty elements in multidimensional array
    $rows = array_filter($rows);//Remove empty array in multidimensional array
    $res = array();
    if($rows[0][0] AND $rows[0][0] != ''){
      $data = array();
      if($csv_label){
        $header = array_shift($rows);
        foreach ($rows as $row) {$data[] = array_combine($header, $row);}
      }else{
        $data = $rows;
      }//End if condition
      $res['status'] = true;
      $res['data'] = $data;
    }else{
      $res['status'] = false;
      $res['errorTitle'] = 'GET Error';
      $res['errorMsg'] = 'CSV file is empty';
    }//End if condition for checking empty file
    return $res;
  }//End function

  function insert_SQL_multiple_row($arr,$tableName,$skipArr = array(),$arrNewValuesArr = array()){
    
    array_unshift($skipArr,'');#Push empty value at start to avoid 0 for array_search method

    //Getting columns ----------------------------------------------------#
    $colNames = array();
    $arr[0] = array_change_key_case($arr[0],CASE_LOWER);
    foreach($arr[0] as $key => $value){if(!array_search($key,$skipArr)){$colNames[] = $key;}}//End foreach
    foreach($arrNewValuesArr as $key => $value){$colNames[] = $key;}//End foreach
    $colNames = implode(",",$colNames);
    #---------------------------------------------------------------------#

    #Removing skip values from array if it's given ---#
    foreach($arr as $key => $subArr){foreach($skipArr as $value){unset($subArr[$value]);} $arr[$key] = $subArr;}//End foreach
    #-------------------------------------------------#

    #Add additional values in array if it's given ---#
    foreach($arr as $key => $subArr){$arr[$key] = array_merge($subArr,$arrNewValuesArr);}//End foreach
    #-------------------------------------------------#

    /*## If array length is more the 1000 them split it
    Reason: MySQL has post limit as 1MB in order to increase we must have ssh access or cPanel
    and most of clients has shared hosting with no ssh access.*/
    $dataLength = sizeof($arr);
    $rowLimit = 8000;
    $queryLimit = 4;
    if($dataLength > $rowLimit){
      $partialArray = array_chunk($arr,ceil(($dataLength / $queryLimit)));
      $partialResponse = array();
      foreach($partialArray as $pArr){
        $valuesArr = array();
        foreach($pArr as $key => $value){
          //Add quote in string for query
          foreach($value as $key => $subValue){$value[$key] = "'".str_replace("'", "",$subValue)."'";}//End foreach
          $valuesArr[] = "(".implode(",",$value).")";
        }//End foreach
        $valuesArr = implode(", ",$valuesArr);
        $sql_query = "INSERT INTO $tableName($colNames) VALUES$valuesArr";
        $partialResponse[] = runQuery($sql_query);
      }//End foreach

      $response = array('status' => true , 'partialResponse' => $partialResponse, 'size' => sizeof($arr),'successTitle' => 'Success', 'successMsg' => 'Data has been added successfully.', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION);
      //print_r($partialArray);
    }else{
      $valuesArr = array();
      foreach($arr as $key => $value){
        //Add quots in string for query
        foreach($value as $key => $subValue){$value[$key] = "'".str_replace("'", "",$subValue)."'";}//End foreach
        $valuesArr[] = "(".implode(",",$value).")";
      }//End foreach
      $valuesArr = implode(", ",$valuesArr);
      $sql_query = "INSERT INTO $tableName($colNames) VALUES$valuesArr";
      $response = runQuery($sql_query);
      $response['size'] = sizeof($arr);
    }//End if condition
    return $response;   
  }//End function


  function getHtmlFromURL($url,$statusCode = false){
    $c = curl_init($url);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt(... other options you want...)
    $html = curl_exec($c);
    if (curl_error($c)){die(curl_error($c));}
    // Get the status code
    $status = curl_getinfo($c, CURLINFO_HTTP_CODE);
    curl_close($c);
    
    if($statusCode){
      return array('html' => $html, 'status' => $status, 'successTitle' => 'Success', 'successMsg' => 'HTML has been fetched successfully.', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION);
    }else{
      return $html;
    }//End if condition
  }//End function

  function createHtmlFileFromUrl($url,$path,$fileName,$fileType = 'html'){
    $html = getHtmlFromURL($url);
    if($html){
      $res = createFile($html,$path,$fileName,$fileType);
      $res['html'] = $html;
      return $res;
    }else{
      return array('status' => false, 'errorTitle' => 'Restricted URL', 'errorMsg' => 'This url dose not allow to use HTML', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
    }//End if condition
  }//End function

  function htmlToPlainText($html_or_HTML_file,$file = true){
    if($file){
      $data = file_get_contents($html_or_HTML_file);
    }else{
      $data = $html_or_HTML_file;
    }//End if condition
    #Getting just body tags (skip script or title tag etc)------#
    $dom = new DOMDocument;
    $nowDom = new DOMDocument;
    @$dom->loadHTML($data);
    $body = $dom->getElementsByTagName('body')->item(0);
    foreach ($body->childNodes as $child){
      $nowDom->appendChild($nowDom->importNode($child, true));
    }//End foreach
    $data = $nowDom->saveHTML();
    #-----------------------------------------------------------#

    #Convert <p>&nbsp;</p> to <br/> o avoid '&nbsp;' in plaintext
    $data = str_replace('<p>&nbsp;</p>','<br/>',$data);
    $data = str_replace('&nbsp;',' ',$data);
    #Add new line break after after each paragraph
    //$data = preg_replace('/(<\/p>)+/m', "</p>\n<br/>", $data);

    $data = strip_tags($data);
    $data = trim(preg_replace('/[ \t]+/', ' ', preg_replace('/[\r\n]+/', "\n", $data)));//Remove Indent space
    $data = trim(preg_replace("/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/", "\n", $data));//Remove Extra line break (Empty line break)
    //$data = trim(preg_replace("/[\r]{2,}|[\n]{2}/", "\n", $data));
    $data = trim(preg_replace("/(^[\r]{2,}|[\n]{2})/", "\n", $data));
    $data = trim(preg_replace("/\n\r+/", " ", $data));//Replace one or multiple new lines with one space:
    $data = trim(preg_replace('/\t+/', ' ', $data));//Replace one or multiple tabs with one space:
        
    return $data;
  }//End function

  function createFile($content,$path,$fileName,$fileType){
    if($fileName){
      if($fp = fopen($path.$fileName.".".$fileType,"wb")){
        fwrite($fp,$content);
        fclose($fp);
        $res = array('status' => true, 'successTitle' => 'Success', 'successMsg' => 'File has been created successfully.', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION, 'fileName' => $fileName.".".$fileType);
      }else{
        $res = array('status' => false, 'errorTitle' => 'Error', 'errorMsg' => 'File could not created', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
      }//End if condition
    }else{
      $res = array('status' => false, 'errorTitle' => 'Error', 'errorMsg' => 'Please provide file name', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
    }//End if condition
    return $res;
  }//End function

  function array_unique_multidimensional($arr){
    return array_map("unserialize", array_unique(array_map("serialize", $arr)));
  }//End function

  function array_unique_multidimensional_by_key($arr, $key) { 
    $tempArr = array_unique(array_column($arr,$key));
    $tempArr = array_intersect_key($arr, $tempArr);
    return array_values($tempArr);
  }//End function

  function multidimensional_array_to_single_array_by_key($arr,$key){
    return array_column($arr, $key);
  }//End function
  
  function remove_same_index_from_multidimensional($arr,$index_array_to_remove){
    return array_map(function($data) use ($index_array_to_remove) {
      foreach($index_array_to_remove as $value){unset($data[trim($value)]);}//End function
      return $data;
    },$arr);
  }//End function

  function array_duplicate_count_by_key($arr,$key){
    return array_count_values(array_column($arr,$key));
  }//End function

  function duplicateDBRow($tableName,$id,$skipCols,$updateCols = null){
    $res =  fetchDataFromDB("SELECT * FROM $tableName WHERE id = '$id'");
    unset($res['data'][0]['key']);//Remove 'key' index provided by fetchDataFromDB;
    $keys = null;
    foreach($res['data'][0] as $key => $value){
      if($key == array_search($key,$skipCols)){continue;}//if it's found any skiped value then skip this route
      $keys .= '`'.$key.'`,';
    }//End foreach
    $keys = substr($keys,0,strlen($keys)-1);
    //return $keys;

    $res = runQuery("INSERT INTO $tableName ($keys) SELECT $keys FROM $tableName WHERE id = '$id'");
    if($updateCols){
      if($res['status']){
        $updateCol = "";
        foreach($updateCols as $key => $value){$updateCol .= "`".$key."` = '".$value."', ";}//End foreach
        $updateCol = substr($updateCol,0,strlen($updateCol)-2);
        $id = $res['id'];
        $res = runQuery("UPDATE $tableName SET $updateCol WHERE id = '$id'",$id);
      }//End if condition
    }//End if condition
    return $res;
  }//End function

  function encrypt_decrypt($action, $string,$ENCRYPTION_KEY = 'id_as_key',$secret_iv = 'secret_key'){
    $output = false;
    $encrypt_method = "AES-128-CBC";
    $secret_key = $ENCRYPTION_KEY;
    //$secret_iv = 'This is my secret iv';
  
    $key = hash('sha256', $secret_key);
    // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
  
    if ( $action == 'encrypt' ) {
      $output = openssl_encrypt($string, $encrypt_method, $key, OPENSSL_RAW_DATA, $iv);
      //$output = substr($output, 0, 14);
      //$output = base64_encode($output);
      $output = rtrim(strtr(base64_encode($output), '+/', '-_'), '=');
    }else if( $action == 'decrypt' ){
      $output = openssl_decrypt(
        //base64_decode($string),
        base64_decode(str_pad(strtr($string, '-_', '+/'), strlen($string) % 4, '=', STR_PAD_RIGHT)),
        $encrypt_method, $key, OPENSSL_RAW_DATA, $iv);
    }
    return $output;
  }//End function

  function findInMultidimensionalArray($key,$value,$arr,$strict = false){
    foreach ($arr as $item) {
      if(($strict ? $item[$key] === $value : $item[$key] == $value)){
        return true;
      }//end if condition
    }//End foreach
    return false;
  }//end function

  function sortDate($arr){
    usort($arr, function ($a, $b) {return strtotime($a) - strtotime($b);});
    return $arr;
  }//end function

  function dateByDays($startDate,$days = false,$format,$endData = false){
    if(!$days){
      $date1 = date_create($startDate);
      $date2 = date_create($endData);
      $daysCount = date_diff($date1,$date2);
      $days = $daysCount->format("%a");
    }//End if condition

    $resData = array();
    $resData[] = date($format,strtotime($startDate));
    $curData = $startDate;
    for($i=0;$i<$days;$i++){
      $date = strtotime("+1 day", strtotime($curData));
      $curData = date($format, $date);
      $resData[] = $curData;
    }//End for loop

    return $resData;
  }//End Function

  function ip_info($ip = NULL, $purpose = "location") {
    $errorMsg = "Please provide valid IP address or set keyword as 'visitor' for visitor IP";
    if(!isset($ip)){return $errorMsg;}
    if($ip == 'visitor'){$ip = getUserRealIP();}//End if condition
    if(!filter_var($ip, FILTER_VALIDATE_IP)){return $errorMsg;}//End if condition

    $output     = NULL;
    $purpose    = str_replace(array("name", "\n", "\t", " ", "-", "_"), NULL, strtolower(trim($purpose)));
    $support    = array("country", "countrycode", "state", "region", "city", "location", "address");
    $continents = array(
        "AF" => "Africa",
        "AN" => "Antarctica",
        "AS" => "Asia",
        "EU" => "Europe",
        "OC" => "Australia (Oceania)",
        "NA" => "North America",
        "SA" => "South America"
    );
    if(filter_var($ip, FILTER_VALIDATE_IP) && in_array($purpose, $support)){
        //$ipdat = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=" . $ip));
        $ipdat = callAPI("GET","http://www.geoplugin.net/json.gp?ip=".$ip,false,true);//API response with josn_decode()
        //echo "<pre>";print_r($ipdat);echo "</pre>";
        //return false;
        if (strlen(trim($ipdat['geoplugin_countryCode'])) == 2) {
            switch ($purpose) {
                case "location":
                    $output = array(
                        "city"           => @$ipdat['geoplugin_city'],
                        "state"          => @$ipdat['geoplugin_regionName'],
                        "country"        => @$ipdat['geoplugin_countryName'],
                        "country_code"   => @$ipdat['geoplugin_countryCode'],
                        "continent"      => @$continents[strtoupper($ipdat['geoplugin_continentCode'])],
                        "latitude"       => @$ipdat['geoplugin_latitude'],
                        "longitude"      => @$ipdat['geoplugin_longitude'],
                        "continent_code" => @$ipdat['geoplugin_continentCode'],
                        "ip_address"     => $ip
                    );
                    break;
                case "address":
                    $address = array($ipdat['geoplugin_countryName']);
                    if (strlen($ipdat['geoplugin_regionName']) >= 1)
                        $address[] = $ipdat['geoplugin_regionName'];
                    if (strlen($ipdat['geoplugin_city']) >= 1)
                        $address[] = $ipdat['geoplugin_city'];
                    $output = implode(", ", array_reverse($address));
                    break;
                case "city":
                    $output = $ipdat['geoplugin_city'];
                    break;
                case "state":
                    $output = $ipdat['geoplugin_regionName'];
                    break;
                case "region":
                    $output = $ipdat['geoplugin_regionName'];
                    break;
                case "country":
                    $output = $ipdat['geoplugin_countryName'];
                    break;
                case "countrycode":
                    $output = $ipdat['geoplugin_countryCode'];
                    break;
            }
        }
    }
    return $output;
  }//End function

  function getUserRealIP(){
      // Get real visitor IP behind CloudFlare network
      if(isset($_SERVER["HTTP_CF_CONNECTING_IP"])){
        $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
        $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
      }//End if condition
      $client  = @$_SERVER['HTTP_CLIENT_IP'];
      $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
      $remote  = $_SERVER['REMOTE_ADDR'];

      if(filter_var($client, FILTER_VALIDATE_IP)){
          $ip = $client;
      }elseif(filter_var($forward, FILTER_VALIDATE_IP)){
          $ip = $forward;
      }else{
          $ip = $remote;
      }//End if condition
      return $ip;
  }//End function

  #Date Increment and Decrement
  function dateIncDecDays($date,$day = 1,$format = "Y-m-d"){
    $date = strtotime("+".$day." day", strtotime($date));
    return date($format, $date);
  }//End function

  #Date compare
  function dateCpr($comparableDate,$compareSign,$compareWithDate){
    $comparableDate  = strtotime(date("Y-m-d", strtotime($comparableDate)));
    $compareWithDate = strtotime(date("Y-m-d", strtotime($compareWithDate)));
    switch($compareSign) {
        case '==': return $comparableDate == $compareWithDate;break;
        case '>': return $comparableDate > $compareWithDate;break;
        case '<': return $comparableDate < $compareWithDate;break;
        case '>=': return $comparableDate >= $compareWithDate;break;
        case '<=': return $comparableDate <= $compareWithDate;break;
    }//End switch case
  }//End function

  #Date compare between
  function dateCprBet($comparableDate,$compareWithDateArr,$notEqual = false){
    $comparableDate  = strtotime(date("Y-m-d", strtotime($comparableDate)));
    $compareWithDateArr[0] = strtotime(date("Y-m-d", strtotime($compareWithDateArr[0])));
    $compareWithDateArr[1] = strtotime(date("Y-m-d", strtotime($compareWithDateArr[1])));
    if($notEqual){
        return ($comparableDate > $compareWithDateArr[0] && $comparableDate < $compareWithDateArr[1]);
    }else{
        return ($comparableDate >= $compareWithDateArr[0] && $comparableDate <= $compareWithDateArr[1]);
    }//End if condition

  }//End function

  #Get Days between two dates
  function getDaysByDate($date1,$date2 = 'now'){
    $date1    = date_create(date('Y-m-d h:i:s A',strtotime($date1))); 
    $date2    = date_create(date('Y-m-d h:i:s A',strtotime($date2))); 
    $interval = date_diff($date1, $date2);  
    return $interval->format('%a'); 
  }//End function

  #Number to letter
  function numberToLetter($number,$uppercase = false){
    $numberToArray = array_map('strval', str_split($number));
    $res = "";
    $letters = array_combine(range(0,9), range('q', 'z'));
    foreach($numberToArray as $value){
      if(preg_match('~[0-9]+~',$value)){
        $res .= $letters[$value];
      }else{
        $res .= $value;
      }//End if condition
      ///$res .= chr(64+$value);
    }//End foreach
    if(!$uppercase){$res = strtolower($res);}//End if condition
    return $res;
  }//End function

  #Letter to Number
  function letterToNumber($letter){
    $letterToArray = array_map('strval', str_split($letter));
    $res = "";
    $alphabet = array_combine(range('q', 'z'), range(0,9));
    foreach($letterToArray as $value){
      if(preg_match('~[a-zA-Z]+~',$value)){
        $res .= $alphabet[$value];
      }else{
        $res .= $value;
      }//End if condition
      //$res .= ord($value);
    }//End foreach
    return $res;
  }//End function

  #Email (PHP Mailer)
  function emailPHPMailer($senderArr,$receiverArr,$content,$SMTPArray = false,$attachment = false){
    $res = array();
    if(!@$receiverArr[0]['email']){
      $res['status'] = false;
      $res['errorTitle'] = "Invalid Email";
      $res['errorMsg'] = "Email is not available";
      $res['errorType'] = "";
      $res['errorNotifyType'] = "notify";
      $res['errorDuration'] = ERROR_DURATION;
    }//End if condition
    
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->IsHTML(true);
    if($SMTPArray){
      $mail->IsSMTP();                                      // set mailer to use SMTP
      $mail->Host = $SMTPArray['host'];  // specify main and backup server
      $mail->SMTPAuth = true;     // turn on SMTP authentication
      $mail->Username = $SMTPArray['username'];  // SMTP username
      $mail->Password = $SMTPArray['password']; // SMTP password
      //If SMTP requires TLS encryption then set it
      if(@$SMTPArray['SMTPSecure']){$mail->SMTPSecure = $SMTPArray['SMTPSecure'];}//End if condition
      //Set TCP port to connect to 
      if(@$SMTPArray['port']){$mail->Port = $SMTPArray['port'];}//End if condition
    }//End if condition

    $mail->setFrom($senderArr['email'],$senderArr['name'],false);

    foreach($receiverArr as $value){
      if($value['name']){
        $mail->addAddress($value['email'], $value['name']);
      }else{
        $mail->addAddress($value['email']);
      }//End if condition
    }//End foreach

    //Provide file path and name of the attachments
    if($attachment){
      foreach($attachment as $value){
        if($value['name']){
          $mail->addAttachment($value['path'], $value['name']);
        }else{
          $mail->addAttachment($value['path']);
        }//End if condition
      }//End foreach
    }//End foreach

    $mail->Subject = $content['subject'];
    //$mail->Body = $content['body'];
    $mail->MsgHTML($content['body']);
    if($content['plaintext']){$mail->AltBody = $content['plaintext'];}
    
    try{
      $mail->send();
      $res['status'] = true;
      $res['successTitle'] = 'Sent';
      $res['successMsg'] = 'Message has been sent successfully';
      $res['successNotify'] = false;
      $res['successNotifyType'] = '';
      $res['successDuration'] = SUCCESS_DURATION;
    }catch(Exception  $e){
      $res['status'] = false;
      $res['errorTitle'] = 'Email Sending Error';
      $res['errorMsg'] = $mail->ErrorInfo;
      $res['errorType'] = "";
      $res['errorNotifyType'] = "notify";
      $res['errorDuration'] = ERROR_DURATION;
    }//End if condition
    $mail->ClearAllRecipients();
    
    return $res;
  }//End function

  function checkDataFromDB($sql_query){
    $data = fetchDataFromDB($sql_query);
    $res = array();
    if($data['status']){
      if(!(sizeof($data['data']) >= 1)){
        $data['status'] = false;
        $data['errorTitle'] = 'Not Available';
        $data['errorMsg'] = 'No record found';
        $data['errorType'] = "";
        $data['errorNotifyType'] = 'notify';
        $data['errorDuration'] = ERROR_DURATION;
      }//End if condition
    }//End if condition
    return $data;
  }//End function

  function dbQuery($sql_query,$handles = array(),$tableName = '',$skipCols = '',$whereCondition = ''){
    $res = array();
    $sql_query = trim($sql_query);
    //Get SELECT keyword
    $typeSelect = substr($sql_query,0,6);
    if($typeSelect == 'SELECT' || $typeSelect == 'select'){

      if(in_array("reverse", $handles)){$reverse = @$handles['reverse'];}else{$reverse = false;}//End if condition
      if(in_array("dateFormat", $handles)){$dateFormat = @$handles['dateFormat'];}else{$dateFormat = false;}//End if condition
      if(in_array("noRecordMsg", $handles)){$noRecordMsg = @$handles['noRecordMsg'];}else{$noRecordMsg = false;}//End if condition
      $res = fetchDataFromDB($sql_query,$reverse,$dateFormat,$noRecordMsg);

    }elseif($sql_query == 'post'){

      //Set local Date time for insert or updated date
      date_default_timezone_set("Asia/Karachi");
      $server_date = date('Y-m-d');
      $server_time = date('h:i:s A');
      $insert_update_by = @$_SESSION['user_id'];
      #------------------------------------------------#

      if(@$handles['id'] && @$handles['id'] != 'null'){
        $action = 'update';
        $id = $handles['id'];
        if(!$whereCondition){$whereCondition = "id = '$id'";}//End if condition
        $handles['updated_date'] = $server_date;
        $handles['updated_time'] = $server_time;
        $handles['updated_by'] = $insert_update_by;
      }else{
        $action = 'insert';
        $id = false;
        $whereCondition = '';
        $handles['inserted_date'] = $server_date;
        $handles['inserted_time'] = $server_time;
        $handles['inserted_by'] = $insert_update_by;
      }//End if condition
      
      if($skipCols){
        $skipArray = explode(",",$skipCols);
      }else{
        $skipArray = array();
      }//End if condition

      $res = create_SQL_query_by_array($handles,$tableName,$action,$skipArray,$whereCondition,true,$id);
    
    }else{
      if($handles){$id = $handles;}else{$id = false;}//End if condition
      $res = runQuery($sql_query,$id);
    }//End if condition
    return $res;
  }//End function

  function arrayToCSV($arr,$path,$fileName){
    if($fileName){
      if($fp = fopen($path.$fileName.'.csv', 'w')){
        foreach ($arr as $fields) {fputcsv($fp, $fields);}
        fclose($fp);
        $res = array('status' => true, 'successTitle' => 'Success', 'successMsg' => 'CSV has been created successfully.', 'successNotify' => false, 'successNotifyType' => '', 'successDuration' => SUCCESS_DURATION, 'fileName' => $fileName.".csv");
      }else{
        $res = array('status' => false, 'errorTitle' => 'Error', 'errorMsg' => 'File could not created', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
      }//End if condition
    }else{
      $res = array('status' => false, 'errorTitle' => 'Error', 'errorMsg' => 'Please provide file name', 'errorType' => '', 'errorNotifyType' => 'notify', 'errorDuration' => ERROR_DURATION);
    }//End if condition
    return $res;
  }//End function

  function commaSeparatedStrToArray($commaSeparatedStr){
    $res = trim($commaSeparatedStr);
    //Convert into single dimensional array
    $res = explode("\n",$res);
    //Convert into multi dimensional array
    foreach($res as $key => $value){
      $value = explode(",",$value);
      //Set inner values
      foreach($value as $keyInner => $valueInner){
        $valueInner = trim($valueInner);
        if($valueInner == ""){unset($value[$keyInner]);}else{$value[$keyInner] = trim($valueInner);}//End if condition
      }//End foreach inner
      $value = array_values($value);//Reset indes
      if(sizeof($value) >= 1){$res[$key] = $value;}else{unset($res[$key]);}//End if condition
    }//End foreach
    $res = array_values($res);//Reset indes
    return $res;
  }//End function

  function commaSeparatedStrToCSV($commaSeparatedStr,$path,$fileName){
    $arr = commaSeparatedStrToArray($commaSeparatedStr);
    $res = arrayToCSV($arr,$path,$fileName);
    $res['data'] = $arr;
    return $res;
  }//End function
  
  #Delete files from directory (NOT GIVE ANY RESPONSE)
  function deleteFilesFromDir($dirPath,$fileArrayToDelete = array(),$fileNamePrefix = false){
    $files = scandir($dirPath);
    foreach($files as $value){
      if($fileNamePrefix){
        $pCount = strlen($fileNamePrefix);
        $prefixMatch = substr($value,0,$pCount);
        if($prefixMatch == $fileNamePrefix){
          unlink($dirPath.$value);
        }//End if condition
      }//End if condition
      if(sizeof($fileArrayToDelete) > 0){
        array_unshift($fileArrayToDelete,"");//For ignoring 0 index (push empty value at start)
        if(array_search($value,$fileArrayToDelete)){
          unlink($dirPath.$value);
        }//End if condition
      }//End if condition
    }//End foreach
  }//End function

  // #Cron Job Functions
  // function setCronJob($serverHitURL,$cronJobName,$strDateTime,$db_update_id,$tableName,$successMsg = false){
  //   global $cronJobToken;
  //   $post_data = array(
  //       'token' => $cronJobToken,
  //       'url' => $serverHitURL,
  //       'expression' => scheduleDateToCronFormat($strDateTime),
  //       'timezone' => scheduleDateToCronFormat($strDateTime,true),//true means just get time zone
  //       'name' => $cronJobName
  //   );
  //   $res = callAPI("POST","https://www.setcronjob.com/api/cron.add",$post_data,true);

  //   if($res['status'] == 'success'){
  //     $res['status'] = true;
  //     $res['id'] = $res['data']['id'];
  //     $res['api_response'] = $res['data'];
  //     $res['successNotify'] = true;
  //     $res['successNotifyType'] = 'notify';
  //     $res['successTitle'] = 'Success';
  //     if($successMsg){
  //       $res['successMsg'] = 'Cron job has been set';
  //     }else{
  //       $res['successMsg'] = $successMsg;
  //     }//End if condition      
  //     //Update cronjob id in db
  //     $updateArr = array('id' => $db_update_id, 'cronJob_id' => $res['id'], 'cronJob_status' => 'active');
  //     $res['db_update_response'] = dbQuery('post',$updateArr,$tableName);
  //     unset($res['data']);
  //   }else{
  //     $res['status'] = false;
  //     $res['errorTitle'] = 'Error';
  //     $res['errorMsg'] = "Could not set schedule, (".$res['message'].")";
  //   }//End if condition

  //   return $res;
  // }//End function

  function setScheduleDate($scheduleDateTimeVar){
    if($scheduleDateTimeVar){
      parse_str($scheduleDateTimeVar,$sdt);
      $sdt_date = $sdt['date']['day']."-".$sdt['date']['month']."-".$sdt['date']['year'];
      $std_time = $sdt['time']['hour'].":".$sdt['time']['min']." ".strtoupper($sdt['time']['ampm'])." - ".$sdt['time']['timeZone'];
      $res = date('M jS Y',strtotime($sdt_date)).", ".$std_time;
    }else{
      $res = "";
    }//End if condition
    return $res;
  }//End if condition



  // #Status could be ('disable','enable','delete','run','logs','failures')
  // function setCronJobStatus($status,$cronJobId,$db_update_id,$tableName,$successMsg = false){
  //   global $cronJobToken;
  //   $post_data = array(
  //     'token' => $cronJobToken,
  //     'id' => $cronJobId
  //   );
  //   $res = callAPI("POST","https://www.setcronjob.com/api/cron.".$status,$post_data,true);

  //   if($res['status'] == 'success'){
  //     $res['status'] = true;
  //     $res['api_response'] = $res['data'];
  //     $res['successNotify'] = true;
  //     $res['successNotifyType'] = 'notify';
  //     $res['successTitle'] = 'Success';
  //     if($successMsg){
  //       $res['successMsg'] = 'Cron job has been '.$status;
  //     }else{
  //       $res['successMsg'] = $successMsg;
  //     }//End if condition
  //     //Update cronjob id in db
  //     $updateArr = array('id' => $db_update_id, 'cronJob_status' => 'disable');
  //     $res['db_update_response'] = dbQuery('post',$updateArr,$tableName);
  //     unset($res['data']);
  //   }else{
  //     $res['status'] = false;
  //     $res['errorTitle'] = 'Error';
  //     $res['errorMsg'] = "Could not set schedule, (".$res['message'].")";
  //   }//End if condition

  //   return $res;
  // }//End function

  function createPDF($pathToFolder,$fileName,$html,$header = false,$footer = false,$oriantation = false){
    $fileName = strtolower(str_replace(" ","-",$fileName.".pdf"));
    //Directory does not exist, so lets create it.
    if(!is_dir($pathToFolder)){mkdir($pathToFolder, 0755);}//End if condition
    $file = $pathToFolder."/".$fileName;
    $mpdf = new \Mpdf\Mpdf([
        'mode' => 'utf-8',
        'format' => 'A4',
        'setAutoTopMargin' => 'stretch',
        'setAutoBottomMargin' => 'false',
        'orientation' => $oriantation ? $oriantation : 'P'//Expected 'L' - Landscape 'P' - Portrait 
    ]);
    $mpdf->SetDisplayMode('fullpage');
    if($header){$mpdf->SetHTMLHeader($header);}
    if(!$footer){$footer = "<p></p>";}
    $mpdf->SetHTMLFooter($footer);
    $mpdf->WriteHTML($html);
    $mpdf->Output($file);
    
    return array('status' => true, 'fileName' => $fileName);

  }//End function

  function bulk_response($res){
    $errorArr = array();
    $errorMsg = "";
    $i = 1;
    foreach($res as $rs){
      if(!$rs['status']){
        $errorArr[] = $rs['errorMsg'];
        $errorMsg .= ($i++)."- ".$rs['errorMsg'].", ";
      }//End if condition
    }//End foreach
    if(sizeof($errorArr) > 0){

      $response = array();
      $errorMsg = sizeof($errorArr)." record(s) has error out of ".sizeof($res)." records. ".$errorMsg;
      //If there is any success status then return true otherwise false
      if(sizeof($errorArr) == sizeof($res)){
        $response['status'] = false;
        $response['errorMsg'] = $errorMsg;
      }else{
        $response['status'] = true;
        $response['successNotify'] = true;
        $response['successTitle'] = 'Success';
        $response['successMsg'] = $errorMsg;
        $response['successNotifyType'] = 'notify';
      }//End if condition
      
    }else{
      $response = $res[0];
    }//End if condition
    return $response;
  }//End function

  function nullToEmpty($variable,$value = ''){
    if($variable == null){$variable = $value;}
    return $variable;
  }//End function

  function concatenate_data($separator,$data,$value){
    $data = explode($separator,$data);
    array_unshift($data,'-');
    if(!array_search($value,$data)){$data[] = $value;}//End if condition    
    array_shift($data);
    $data = implode($separator,$data);
    return $data;
  }//End if condition

  function htmlTableToCSV($html,$fileName,$filePath){
    
    $html = str_replace('&nbsp;','',$html);    
    $xml = new DOMDocument();
    $xml->loadHTML($html);
    $html = $xml;
    header('Content-type: application/ms-excel');
    header('Content-Disposition: attachment; filename='.$fileName.'.csv');

    #if folder is not exists then create it
    if(!file_exists($filePath)) {mkdir($filePath);}

    $fp = @fopen($filePath.DIRECTORY_SEPARATOR.$fileName.'.csv', 'w');
    if($fp != false){
      foreach($html->getElementsByTagName('tr') as $element){
        $th = array();
        foreach( $element->getElementsByTagName('th') as $row){$th [] = $row->nodeValue;}
        $td = array();
        foreach( $element->getElementsByTagName('td') as $row){$td [] = $row->nodeValue;}
        !empty($th) ? fputcsv($fp, $th) : fputcsv($fp, $td);
      }//End foreach
      fclose($fp); 
      return array('status' => true, 'fileName' => $fileName.'.csv');
    }else{
      return array('status' => false, 'errorMsg' => 'File could not created', 'fileName' => '');
    }//End if condition
  }//End function

?>