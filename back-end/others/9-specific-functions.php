<?php

  #Separate data by status
  function separate_list_by_status($data){
    global $subscriber_status_table;
    $res = array();

    //Getting status from db
    $statusData = dbQuery("SELECT id,status FROM $subscriber_status_table");
    $statusArr = $statusData['data'];
    #Adding bulkAction list-------------------------#
    foreach($statusArr as $key => $value){
      $bulkAction = array();
      foreach($statusArr as $valueInner){
        if(trim($value['status']) != trim($valueInner['status'])){
          $bulkAction[] = array('label' => $valueInner['status'], 'value' => $valueInner['id']);
        }//End if condition
      }//End inner foreach
      $value['bulkAction'] = $bulkAction;
      $statusArr[$key] = $value;
    }//End foreach
    #------------------------------------------------#
    $res['status_data'] = $statusArr;

    foreach($statusArr as $value){$res['subscribers'][$value['status']] = array();}//End foreach
    foreach($data as $key => $value){

      #Date difference label --------------------//
      if(isset($value['updated_date']) AND $value['updated_date'] !== ''){
        $value['subscribed'] = set_date($value['updated_date'].$value['updated_time'],true);
      }else{
        $value['subscribed'] = set_date($value['inserted_date'].$value['inserted_time'],true);
      }//End if condition      
      //------------------------------------------//

      foreach($statusArr as $valueInner){
        if(trim($value['status']) == trim($valueInner['id'])){
          $res['subscribers'][$valueInner['status']][] = $value;
        }//End if condition
      }//End foreach
    }//End foreach
    return $res;
  }//End function

  function mergeDBandCSV($arr,$arrData,$serial = true){
    global $session_user_id;
    global $subscribers_table;
    global $subscriber_status_table;
    global $list_ref_id;

    //Remove empty values in array if available
    $arrMod = array();
    foreach($arr as $k => $v){if($v[0]){$arrMod[] = $v;}}//End foreach
    $arr = $arrMod;
    //print_r($arr);die();

    $arr = array_filter($arr, fn($value) => !is_null($value[0]) && $value[0] !== '');
    
    #Remove label from first row if available ------------------------------------------------#
    $columnLabel = true;
    foreach($arr[0] as $value){if(filter_var(trim($value),FILTER_VALIDATE_EMAIL)){$columnLabel = false;break;}}//End foreach
    if($columnLabel){unset($arr[0]);$arr = array_values($arr);}//Delete labels from main array and reset array index
    #------------------------------------------------------------------------------------------#

    #Creating and run query for bulk import for to check that is email available in BD or not -------#
    $st = $subscribers_table;
    $sst = $subscriber_status_table;
    $dataLength = sizeof($arr);
    $emailLimit = 5;
    $querySplitCount = 8;
    if($dataLength > $emailLimit){
      $arrChunk = array_chunk($arr,ceil($dataLength / $querySplitCount));
      $tempRes = array();
      #Find email index from first array
      foreach($arrChunk[0][0] as $key => $value){if(filter_var($value, FILTER_VALIDATE_EMAIL)){$emailIndex = $key;}}//End foreach
      foreach($arrChunk as $data){
        $query = "SELECT $st.email,$st.list_ref_id,$st.id AS client_id,$st.status,$sst.status AS s_status FROM $st INNER JOIN $sst ON $st.status = $sst.id WHERE $st.inserted_by = '$session_user_id' AND (";
        foreach($data as $value){$query .= "$st.email = '".stripslashes($value[$emailIndex])."' OR ";}//End foreach
        $query = substr($query,0,strlen($query)-4).")";
        $dbData = dbQuery($query);
        $tempRes = array_merge($tempRes,$dbData['data']);
      }//End if condition
      $res = $tempRes;
    }else{
      #Find email index from first array
      foreach($arr[0] as $key => $value){if(filter_var($value, FILTER_VALIDATE_EMAIL)){$emailIndex = $key;}}//End foreach
      $query = "SELECT $st.email,$st.list_ref_id,$st.id AS client_id,$st.status,$sst.status AS s_status FROM $st INNER JOIN $sst ON $st.status = $sst.id WHERE $st.inserted_by = '$session_user_id' AND (";
      foreach($arr as $value){$query .= "$st.email = '".stripslashes($value[$emailIndex])."' OR ";}//End foreach
      $query = substr($query,0,strlen($query)-4).")";
      $res = dbQuery($query);
      $res = $res['data'];
    }//End if condition
    array_unshift($res,array('email' => ''));//Push at start for avoid 0 index in array_search
    #------------------------------------------------------------------------------------------------#
    $i = 1;
    $labelArray = array();
    $mainTemp = array();
    if($serial){$labelArray[] = setCol('Sr','key',10,true,false);}
    foreach($arr as $value){
      $temp = array();
      #Set columns into array with email, name etc --------------------------#
      foreach($arrData['values'] as $keyValue => $indexValue){
        $temp[$indexValue] = $value[$keyValue];
        //Set provided label into array
        $labelArray[$keyValue+1] = setCol($arrData['label'][$keyValue],$arrData['values'][$keyValue],false,true);
        //Get email value in variable for sql query
        if(filter_var($value[$keyValue], FILTER_VALIDATE_EMAIL)){$email = $value[$keyValue];}//End if condition
      }//End foreach
      #----------------------------------------------------------------------#
      $temp['import_from_list'] = $arrData['importFromList'];
      $temp['key'] = $i++;
      #Search email from DB array
      $foundEmailInDB = array_search($email, array_column($res, 'email'));
      if($foundEmailInDB){
        $data = $res[$foundEmailInDB];
        //Check list id already exists
        $list_ref_id_arr = explode("%","%".$data['list_ref_id']);
        if(array_search($list_ref_id,$list_ref_id_arr)){
          $list_r_id = $data['list_ref_id'];
        }else{
          $list_r_id = $data['list_ref_id']."%".$list_ref_id;
        }//End if condition
        $temp['list_ref_id'] = $list_r_id;
        $temp['client_id'] = $data['client_id'];
        $temp['status'] = $data['status'];
        $temp['s_status'] = $data['s_status'];
      }else{
        $temp['list_ref_id'] = $list_ref_id;
        $temp['client_id'] = "-";
        $temp['status'] = "1";
        $temp['s_status'] = "Active";
      }//End if condition
      $mainTemp[] = $temp;
    }//End foreach

    //Add remaining label as manual
    $labelManualArray = array(array_merge(setCol('Status','s_status',false)));
    foreach($labelManualArray as $keyLabel => $valueLabel){$labelArray[] = $valueLabel;}//End foreach
    $labelArray = array_values($labelArray);//Reset indexes because of skip removed previously

    //Push first row as label for 3 step (3_upload_subscribers.php)
    $frLabel = array();
    foreach($mainTemp[0] as $key => $value){$frLabel[] = $key;}//End foreach
    array_unshift($mainTemp,$frLabel);

    $res = array();
    $res['data'] = $mainTemp;
    $res['labels'] = $labelArray;
    return $res;
  }//End function

  function setNamesForSubscribersForDB($arr){
    if(@$arr['full_name']){
      $name = split_name(@$arr['full_name']);
      @$arr['first_name'] = $name[0];
      @$arr['last_name'] = $name[1];
    }else if(@$arr['first_name'] AND !@$arr['last_name']){
      @$arr['full_name'] = $arr['first_name'];
    }else if(@$arr['last_name'] AND !@$arr['first_name']){
      @$arr['full_name'] = $arr['last_name'];
      @$arr['first_name'] = $arr['last_name'];
    }else if(@$arr['first_name'] AND @$arr['last_name']){
      @$arr['full_name'] = $arr['first_name']." ".$arr['last_name'];
    }//End if condition

    if(!@$arr['full_name']){$arr['full_name'] = 'Name';}//End if condition
    if(!@$arr['first_name']){$arr['first_name'] = 'Name';}//End if condition
    if(!@$arr['last_name']){$arr['last_name'] = '';}//End if condition
    return $arr;
  }//End function

  function separate_insert_and_update_list($arr){
    global $server_date;
    global $server_time;
    global $session_user_id;
    $insert_list = array();
    $update_list = array();
    $temp = array();
    foreach($arr as $value){
      unset($value['s_status']);
      unset($value['key']);
      if($value['client_id'] == '-'){
        unset($value['client_id']);
        $value = setNamesForSubscribersForDB($value);
        if(!$value['email']){
          $value['email'] = 'harishassanaptech@gmail.com';
        }//End if condition
        $value['inserted_date'] = $server_date;
        $value['inserted_time'] = $server_time;
        $value['inserted_by'] = $session_user_id;
        $insert_list[] = $value;
      }else{
        #Add just Active Subscriber in update list
        if($value['status'] === '1'){$update_list[] = $value;}//End if condition
        //$update_list[] = $value;
      }//End if condition
    }//End foreach
    if(!(sizeof($insert_list)>=1)){$insert_list = null;}
    if(!(sizeof($update_list)>=1)){$update_list = null;}

    return array('insert'=>$insert_list,'update'=>$update_list);
  }//End function

  function update_subscribers($arr){
    global $subscribers_table;
    global $session_user_id;
    global $server_date;
    global $server_time;
    $res = array();
    
    $arrLength = sizeof($arr);
    $limit = 5000;
    $querySplit = 4;
    $query = "INSERT INTO $subscribers_table (id,list_ref_id,updated_date,updated_time,updated_by) VALUES ";
    $inDuplicateKey = " ON DUPLICATE KEY UPDATE list_ref_id = VALUES(list_ref_id), updated_date = VALUES(updated_date), updated_time = VALUES(updated_time), updated_by = VALUES(updated_by)";  
    if($arrLength > $limit){
      $arr = array_chunk($arr,ceil($arrLength/$querySplit));
      foreach($arr as $dataArr){
        $data = array();
        foreach($dataArr as $value){
          $value = setNamesForSubscribersForDB($value);
          $data[] = "('".$value['client_id']."', '".$value['list_ref_id']."', '$server_date', '$server_time', '$session_user_id')";
        }//End foreach
        $res = runQuery($query . implode(', ', $data) . $inDuplicateKey);
      }//End foreach
    }else{
      $data = array();
      foreach($arr as $value){
        $value = setNamesForSubscribersForDB($value);
        $data[] = "('".$value['client_id']."', '".$value['list_ref_id']."', '$server_date', '$server_time', '$session_user_id')";
      }//End foreach
      $res = runQuery($query . implode(', ', $data) . $inDuplicateKey);
    }//End if condition
    return $res;
  }//End function

  function remove_list_id_from_subscriber($list_id_arr_string,$removable_id){
    $list_id_arr = explode('%',$list_id_arr_string);
    foreach($list_id_arr as $subKey => $subValue){
      if(trim($subValue) == trim($removable_id)){unset($list_id_arr[$subKey]);}//End if condition
    }//End foreach
    return implode('%',$list_id_arr);
  }//End function

  function create_status_history_var($id,$status,$list_id){
    global $subscribers_table;
    global $server_date;
    global $server_time;
    global $session_user_id;
    $status_history = dbQuery("SELECT status_history FROM $subscribers_table WHERE id = '$id'");
    $status_history = $status_history['data'][0]['status_history'];
    $status_history = $status_history."=>".$server_date."(%)".$server_time."(%)".$status."(%)".$session_user_id."(%)".$list_id;
    return $status_history;
  }//End function

  function split_name($name) {
    $name = trim($name);
    $last_name = (strpos($name, ' ') === false) ? '' : preg_replace('#.*\s([\w-]*)$#', '$1', $name);
    $first_name = trim( preg_replace('#'.$last_name.'#', '', $name ) );
    return array($first_name, $last_name);
  }//End function

  function getEmailListByList_ref_id($list_ref_ids,$campaign_id,$templateLinksArr = false){
    global $subscribers_table;
    global $session_user_id;
    $email_list_new = array();
    $invalidEmails = array();

    #Getting user emails ---------------------------------#
    $email_list = array();
    $list_ids = explode(",",$list_ref_ids);
    foreach($list_ids as $list_id){
      $emailData = dbQuery("SELECT id,email,first_name,last_name,full_name FROM $subscribers_table WHERE list_ref_id LIKE '%$list_id%' AND status = '1'");
      foreach($emailData['data'] as $users){
        if(!filter_var($users['email'], FILTER_VALIDATE_EMAIL)){
          $invalidEmails[] = $users['email'];
        }else{
          #Creating template link tags for ESPS
          if(gettype($templateLinksArr) == 'array' AND sizeof($templateLinksArr) > 0){
            $i = 0;
            foreach($templateLinksArr as $key => $value){
              $users['template_link_tags_esps']['cid_ntl_uid_ntl_tl_'.$i] = encrypt_decrypt('encrypt',numberToLetter($campaign_id)."-".numberToLetter($users['id'])."-".numberToLetter($value['id']));
              $i++;
            }//End foreach
          }//End if condition
          $users['cid_ntl_uid_ntl_open_track'] = encrypt_decrypt('encrypt',numberToLetter($campaign_id)."-".numberToLetter($users['id']).'-'.randCode());
          $users['cid_ntl_uid_ntl'] = encrypt_decrypt('encrypt',numberToLetter($campaign_id)."-".numberToLetter($users['id']));
          $email_list[] = $users;
        }//ebd if condition
      }//End foreach
    }//End foreach
    $email_list = array_values(array_unique_multidimensional($email_list));//Array mearge and reset

    if(sizeof($email_list) == 0){
      echo json_encode(array(
        'status' => false,
        'errorTitle' => 'Invalid Email',
        'errorMsg' => 'Please insert valid email(s)',
      ));
      die();
    }//End if condition
    return array('email_list' => $email_list, 'invalid_email_list' => $invalidEmails);
  }//End function

  function getEmailListCountByList_ref_id($list_ref_ids){
    global $subscribers_table;

    $list_ids = explode(",",$list_ref_ids);
    foreach($list_ids as $list_id){
      $emailData = dbQuery("SELECT COUNT(*) AS count FROM $subscribers_table WHERE list_ref_id LIKE '%$list_id%' AND status = '1'");
      $count = 0;
      foreach($emailData['data'] as $data){
        $count = $count + $data['count'];
      }//End foreach
    }//End foreach
    return $count;
  }//End function

  function shortTemplateLinksWithDB($fileWithPath,$campaign_id){
    global $template_links_table;
    global $session_user_id;
    global $server_date;
    global $server_time;
    $res = runQuery("DELETE FROM $template_links_table WHERE campaign_ref_id = '$campaign_id'");
    if($res['status']){
        $html = file_get_contents($fileWithPath);
        $xml = new DOMDocument;// Create a new DOM Document to hold our webpage structure
        @$xml->loadHTML($html);// Load the url's contents into the DOM (the @ supresses any errors from invalid XML)
        //Loop through each <a> and </a> tag in the dom and replace Link//
        foreach($xml->getElementsByTagName('a') as $link){
            $cLink = $link->getAttribute('href');
            $shortLink = "l-".numberToLetter($campaign_id.$session_user_id.randNumber());
            $res = runQuery("INSERT INTO $template_links_table (campaign_ref_id,link_url,short_url,inserted_date,inserted_time) VALUES ('$campaign_id','$cLink','$shortLink','$server_date','$server_time')");
        }//End foreach
        #----------------------------------------------------------------//
    }//End if condition    
    return $res;
  }//End if condition
  
  function duplicateTemplateLinks($old_id,$new_id){
    global $template_links_table;
    $templatesLinks = dbQuery("SELECT id,link_url,short_url FROM $template_links_table WHERE campaign_ref_id = '$old_id'");
    $templatesLinks = $templatesLinks['data'];
    foreach($templatesLinks as $value){
      unset($value['id']);
      unset($value['key']);
      $value['campaign_ref_id'] = $new_id;
      $res = dbQuery("post",$value,$template_links_table);
    };
  }//End if condition 


  #Reporting Functions
  function roundTimeToNearestHour($time){
    $timeArr = explode(":",$time);
    $amp = explode(" ",$timeArr[2]);
    $timeArr[2] = $amp[0];
    $amp = strtolower($amp[1]);
    $hour = $timeArr[0];
    if(trim($timeArr[1]) >= 30){
        $hour = ($timeArr[0]+1);
        if(trim($hour) > '12'){$hour = '1';}
        if(trim($hour) == '12'){
            
            if(trim($amp) == 'am'){
                $amp = 'pm';
            }else{
                $amp = 'am';
            }//End if condition
        }//End if condition
    }//End if condition
    $hour = (int)$hour;
    return $hour.$amp;
  }//End function

  #Get Template Links from DB
  function getTemplateLinkFromDB($campaign_id){
    global $template_links_table;
    //Getting template external urls
    $templatesLinks = dbQuery("SELECT id,link_url FROM $template_links_table WHERE campaign_ref_id = '$campaign_id'");
    foreach($templatesLinks['data'] as $key => $value){
      $templatesLinks['data'][$value['link_url']] = $value;
      unset($templatesLinks['data'][$key]);
    }//End foreach
    return $templatesLinks['data'];
  }//End function

  function setCol($title,$col,$width,$sortData = true,$string = true){
    if($string){
      $sort = '(a, b) =>  { return a.'.$col.'.localeCompare(b.'.$col.') }';
    }else{
      $sort = '(a, b) => a.'.$col.' - b.'.$col.'';
    }//End if condition
    $res =  array(
        'title' => $title,
        'dataIndex' => $col,
        'width' =>  $width.'%',
    );  
    if($sortData){$res['sorter'] = $sort;}
    return $res;
  }//End function

  function getUserData($user_id = false,$cols = '*'){
    global $users_table;
    global $live_server;
    global $clientDomainForLink;
    global $session_user_id;

    #if id is not provided then get id from session
    if(!$user_id){$user_id = $session_user_id;}

    $userData = dbQuery("SELECT $cols FROM $users_table WHERE id = '$user_id'");
    $userData = $userData['data'][0];
    //Insert subscriber subdomain path into userData array
    if($live_server){
      //$subscriberCompanyName = strtolower(str_replace(" ","",$userData['company_name']));
      //$userData['subDomain'] = "https://".$subscriberCompanyName.".".$clientDomainForLink;
      $userData['subDomain'] = $clientDomainForLink;
    }else{
      $userData['subDomain'] = $clientDomainForLink;
    }//End if condtion

    return $userData;
    #-----------------------------------------------------#
  }//End function

  function moreThenFiveEmail($email){
    #Convert Email to Array ------------------------------#
    $email = explode(",",$email);
    if(sizeof($email) > 5){
        echo json_encode(array(
            'status' => false,
            'errorTitle' => 'Email length error',
            'errorMsg' => 'Can not add more then 5 emails.',
        ));
        die();
    }else{
      return $email;  
    }//End if condition
  }//End function

  function get_campaign_data($col = '*',$campaign_id){
    global $campaign_table;
    global $session_user_id;
    $campaignData = dbQuery("SELECT $col FROM $campaign_table WHERE id = '$campaign_id' AND inserted_by = '$session_user_id'");
    return $campaignData['data'][0];
  }//End function

  function getTemplateAndPlainText($type,$campaign_id,$pathOfUploadFolder){
    global $domainPath;
    global $session_user_id;
    global $campaign_table;
    if($type == 'template'){
      $res = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$campaign_id' AND inserted_by = '$session_user_id'");
      $fileName = $res['data'][0]['template_file_name'];
      if($fileName){
        $fileName = $pathOfUploadFolder."/templates/".$fileName;
        return @file_get_contents($fileName);
      }else{
        return '';
      }//End if condition
    }//End if condition
    if($type == 'plaintext'){
      $fileName = $pathOfUploadFolder."/plaintext/".$campaign_id."-plainText.txt";
      return @file_get_contents($fileName);
    }//End if condition
  }//End function

  function getAllTemplate($type,$pathOfUploadFolder,$confirmationTemplates = false, $testTemplates = false){
    $path = $pathOfUploadFolder;
    global $session_user_id;
    global $campaign_id;
    if($confirmationTemplates){
      if($type == 'template'){
        #Getting confirmation email template
        $cTemp1 = $path."/templates/confirmation_template/".$session_user_id.".html";
        $cTemp2 = $path."/templates/confirmation_template/default.html";
        if(file_exists($cTemp1)){$cTemp = $cTemp1;}else{$cTemp = $cTemp2;}//End if condition
        return file_get_contents($cTemp);
      }//End if condition
      if($type == 'plaintext'){
        $cPlainText1 = $path."/plaintext/confirmation_plaintext/".$session_user_id.".txt";
        $cPlainText2 = $path."/plaintext/confirmation_plaintext/default.txt";
        if(file_exists($cPlainText1)){$cPlainText = $cPlainText1;}else{$cPlainText = $cPlainText2;}//End if condition
        return file_get_contents($cPlainText);
      }//End if condition
    }else if($testTemplates){
      if($type == 'template'){
        #Getting confirmation email template
        $cTemp1 = $path."/templates/test_template/".$session_user_id.".html";
        $cTemp2 = $path."/templates/test_template/default.html";
        if(file_exists($cTemp1)){$cTemp = $cTemp1;}else{$cTemp = $cTemp2;}//End if condition
        return file_get_contents($cTemp);
      }//End if condition
      if($type == 'plaintext'){
        $cPlainText1 = $path."/plaintext/test_plaintext/".$session_user_id.".txt";
        $cPlainText2 = $path."/plaintext/test_plaintext/default.txt";
        if(file_exists($cPlainText1)){$cPlainText = $cPlainText1;}else{$cPlainText = $cPlainText2;}//End if condition
        return file_get_contents($cPlainText);
      }//End if condition
    }else{
      if(!@$campaign_id){
        echo json_encode(array('status' => false, 'errorMsg' => 'Please provide campaign id as global.'));
        die();
      }//End if condition
      return getTemplateAndPlainText($type,@$campaign_id,$path);
    }//End if condition
  }//End function

  function getSMTPData($smtp_id,$cols,$setArr = false,$smtpData = false){
    global $domainPath;
    global $session_user_id;
    if(!$smtpData){

      if(!$smtp_id){
        $data = fetchDataFromDB("SELECT default_smtp_id FROM $users_table WHERE id = '$session_user_id'");
        $smtp_id = $data['data'][0]['default_smtp_id'];
      }//End if condition


      if($cols){
        $url = $domainPath."/apis/smtp/get/index.php?id=".$smtp_id."&cols=".$cols."&app_no_session=true&session_user_id=".$session_user_id;
      }else{
        $url = $domainPath."/apis/smtp/get/index.php?id=".$smtp_id."&app_no_session=true&session_user_id=".$session_user_id;
      }//End if condition

      $smtpData = callAPI("GET",$url,false,true);
      if($smtp_id == 'all'){
        $smtpData = $smtpData['data'];
      }else{
        $smtpData = $smtpData['data'][0];
      }//End if condition
    }//End if condition
    if($setArr){
      return array(
        'SMTPSecure' => $smtpData['SMTPSecure'],
        'Host' => $smtpData['host'],
        'Port' => $smtpData['port'],
        'Username' => $smtpData['username'],
        'Password' => $smtpData['password'],
        'From_Name' => $smtpData['fromName'],
        'From_Email' => $smtpData['fromEmail'],
        'Custom_Header_Email' => $smtpData['custom_header_email']
      );
    }else{
      return $smtpData;
    }//End if condition
  }//End function

  function getSMTPNameById($smtp_id){
    global $smtp_table;
    if(isset($smtp_id)){
      $data = fetchDataFromDB("SELECT name FROM $smtp_table WHERE id = '$smtp_id'");
      return $data['data'][0]['name'];
    }else{
      return '';
    }//End if condition
  }//End function

  function companyTagsDecode($html){
    global $companyName;
    global $companyAddress;
    global $companyWebSite;
    global $clientPath;
    $innerTagArr = array(
      '[company_name]' => $companyName,
      '[companyAddress]' => $companyAddress,
      '[companyWebSite]' => $companyWebSite,
      '[logo]' => $clientPath.'/image/logo.png',
      '[app_link]' => $clientPath
    );
    foreach($innerTagArr as $key => $value){$html = str_replace($key,$value,$html);}//End foreach
    return $html;
  }//End function

  function remove_unwanted_columns_for_front_end($arr,$hideValArr){
    $res['data'] = remove_same_index_from_multidimensional($arr['data'],$hideValArr[0]);
    $labels = $arr['labels'];
    array_unshift($hideValArr[1],"");
    foreach($arr['labels'] as $key => $value){
      if(array_search($value['title'],$hideValArr[1])){
        unset($labels[$key]);
      }//End if condition
    }//End foreach
    $res['labels'] = array_values($labels);
    return $res;
  }//End function

  function company_as_sub_domain($company_name){
    //Remove all spaces
    return strtolower(preg_replace('/\s+/', '', $company_name));
  }//End function

  function add_unsubscribe_tag_into_template($html){
    //$type could be view / add
    if($html){
      $dom = new DOMDocument;//Create a new DOM document
      @$dom->loadHTML($html);//Parse the HTML. The @ is used to suppress any parsing errors //that will be thrown if the $html string isn't valid XHTML.

      $fragment = $dom->createDocumentFragment();
      $fragment->appendXML('<p>This email was sent to [email address suppressed]. If you are no longer interested you can <unsubscribe><span style="color: #1d02ef;text-decoration: underline;cursor: pointer;">unsubscribe instantly.</span></unsubscribe></p>');
      
      $body = $dom->getElementsByTagName('body')->item(0);
      $body->appendChild($fragment);
      //$dom->documentElement->appendChild($body);
      $html = $dom->saveHtml();
      $html = trim(str_replace('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">','',$html));
      return $html;
    }else{
      return "Please provide html";
    }//End if condition
  }//End function

  function getESPSserverAndAccountList(){
    global $esps_table;
    global $session_user_id;
    if(!check_role_id(2,$session_user_id)){
      $where_con = " WHERE inserted_by = '$session_user_id'";
    }else{
      $where_con = '';
    }//End if condition
    //ESPS Server and account list
    $res = dbQuery("SELECT id,server_name,table_name FROM $esps_table");
    foreach($res['data'] as $key => $t_data){
      $table_name = $t_data['table_name'];
      $data = dbQuery("SELECT id,account_name FROM $table_name $where_con");
      $res['data'][$key]['data'] = $data['data'];
    }//End foreach
    return $res;
  }//End function

  function saveFile($filename,$filecontent,$folderPath){
    if(strlen($filename)>0){
      if(!file_exists($folderPath)) {mkdir($folderPath);}
        $file = @fopen($folderPath . DIRECTORY_SEPARATOR . $filename,"w");
        if($file != false){
          fwrite($file,$filecontent);
          fclose($file);
          return array('status' => true, 'fileName' => $filename);
        }
        return array('status' => false, 'errorMsg' => 'File could not created');
    }
    return array('status' => false, 'errorMsg' => 'Please provide file name');
  }//End function

  function getListNamesByids($ids){
    global $subscriber_list_table;
    $ids = explode(",",$ids);
    $idArr = array();
    foreach($ids as $value){$idArr[] = "id = '$value'";}
    $data = dbQuery("SELECT id,list_name FROM $subscriber_list_table WHERE ".implode(" OR ",$idArr));
    foreach($data['data'] as $key => $value){
      $data['data'][$key]['id_en'] = encrypt_decrypt('encrypt',$value['id']);
    }//End foreach
    return $data['data'];
  }//End function

  function getAllListNames(){
    global $subscriber_list_table;
    global $session_user_id;
    $data = dbQuery("SELECT id,list_name FROM $subscriber_list_table WHERE inserted_by = '$session_user_id'");
    foreach($data['data'] as $key => $value){
      $data['data'][$key]['id_en'] = encrypt_decrypt('encrypt',$value['id']);
    }
    return $data['data'];
  }//End function

  function print_rp($arr){
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
  }//End function

?>