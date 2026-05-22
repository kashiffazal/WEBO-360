<?php

  require dirname(__FILE__) . "/mailgun-php/vendor/autoload.php";
  use Mailgun\Mailgun;
  
  function sendMultipleEmailsToMultipleRecipients1000Subscribers($api_cred,$arr){

    //Checking all required attributes
    $returnError = array('status' => false);
    if (!isset($arr['from'][0])) {$returnError['errorMsg'] = 'Invalid "From" attribute';}
    if (!isset($arr['to'][0]['email'])) {$returnError['errorMsg'] = 'Invalid "To" attribute';}
    if (!isset($arr['campaign_id'])) {$returnError['errorMsg'] = 'Missing campaign id';}
    if (!isset($arr['subject'])) {$returnError['errorMsg'] = 'Subject is missing';}
    if (!isset($arr['replayTo'][0])) {$returnError['errorMsg'] = 'Invalid "replayTo" missing';}
    if (!isset($arr['plaintext'])) {$returnError['errorMsg'] = 'Plaintext is missing';}
    if (!isset($arr['content'])) {$returnError['errorMsg'] = 'Content is missing';}
    if (isset($returnError['errorMsg'])) {return $returnError;die();}

    $mg = Mailgun::create($api_cred['api_key']); // For US Servers
    //print_r($arr);die();
    $params = [
      'subject' => $arr['subject'],
      'text'    => $arr['plaintext'],
      'html'    => $arr['content'],
      'from'    => $arr['from'][1].' <'.$arr['from'][0].'>',
      'o:tag'   => array($arr['campaign_id']),
      //Set List-Unsubscribe and other headers ('unsubscribe_link' => link for our application, '%recipient.cid_ntl_uid_ntl%' => random code to unsubscribe in our app DB)
      'h:List-Unsubscribe' => '<'.$arr['unsubscribe_link'].'%recipient.cid_ntl_uid_ntl%>,<mailto:unsubscribe@webo360mailer.com>',
      'h:Reply-To' => $arr['replayTo'][1].' <'.$arr['replayTo'][0].'>',
      'h:X-Priority' => '1 (Highest)',
      'h:X-MSMail-Priority' => 'High',
      'h:Importance' => 'High'
    ];

    $recipientVariables = array();
    foreach($arr['to'] as $to){
      $params['to'][] = $to['full_name'].' <'.$to['email'].'>';
      #Adding tags --------------------------------------------------#
      $tags = array();
      //Setting all available tags in templates
      foreach(esps_template_tags() as $key => $tagValues){$tags[$tagValues['value_var']] = @$to[$tagValues['value_var']];}//End foreach
      #Create template links array
      if(isset($to['template_link_tags_esps'])){
        foreach($to['template_link_tags_esps'] as $key => $value){
          $tags[$key] = @$value;
          $params['html'] = str_replace('%'.$key.'%','%recipient.'.$key.'%',$params['html']);
        }//End foreach
      }//End if condition
      $recipientVariables[$to['email']] = $tags;
      #-------------------------------------------------------------#
    }//End foreach

    #Convert tags according to MailGun
    foreach(esps_template_tags() as $key => $tagValues){
      $params['html'] = str_replace($tagValues['tag'],'%recipient.'.$tagValues['value_var'].'%',$params['html']);
      $params['text'] = str_replace($tagValues['tag'],'%recipient.'.$tagValues['value_var'].'%',$params['text']);
      $params['subject'] = str_replace($tagValues['tag'],'%recipient.'.$tagValues['value_var'].'%',$params['subject']);
    }//End foreach

    $params['recipient-variables'] = json_encode($recipientVariables);
    //echo "<pre>";print_r($params);echo "</pre>";die();
    $api_res = $mg->messages()->send($api_cred['domain'], $params);
    //echo $res->getId();

    $res = array();
    if($api_res->getId()){
      $res['status'] = true;
      $res['messageId'] = $api_res->getId();
    }else{
      $res['status'] = false;
    }//End if condition
    return $res;
  }//End function

  function getBounceAndSpamEmail($api_cred,$arr){
    
    $events       = array('failed','complained');//Events to get from apis
    $resIndexes   = array('bounce','spam');//Indexes of response array

    $mg = Mailgun::create($api_cred['api_key']); // For US servers
    #Instantiate the client.
    $queryString = array(
      'begin'     => $arr['start_date'],
      'ascending' => 'yes',
      'limit'     =>  300,
      'pretty'    => 'yes',
      //'event'     => implode(' OR ',$events),
      'tags'      => $arr['tag'],
      //'severity' => 'permanent',
    );

    $response = array();
    foreach($events as $key => $ev){
      $queryString['event'] = $ev;
      #Conditions for failed type(s)
      if($ev === 'failed' && $resIndexes[$key] === 'bounce'){
        $queryString['severity'] = 'permanent';
      }else{
        unset($queryString['severity']);
      }//End if condition

      #Get data from API
      $res = $mg->events()->get($api_cred['domain'], $queryString);
      //echo "<pre>";print_r(private_object_to_array($res));echo "</pre>";;die();
      #While loop for get all email with paging------------------------------------#
      #Object to array for paging
      $resPagingArr = private_object_to_array($res);
      $resPagingArr = $resPagingArr['items'];
      $findNext = true;
      while($findNext){
        $nextRes = $mg->events()->nextPage($res);
        $nextResArr = private_object_to_array($nextRes);
        if(sizeof($nextResArr['items']) > 0){//If next page has data then merge otherwise break the loop
          $resPagingArr = array_merge($resPagingArr,$nextResArr['items']);
          $res = $nextRes;//Reset $res with nextRes in order to complete pagination
        }else{
          $findNext = false;//Break the loop if there is no items
        }//End if condition
      }//End while loop
      $response = array_merge($response,$resPagingArr);
      //$res = $resPagingArr;
      #------------------------------------------------------------------------------#
    }//End foreach

    //echo "<hr/><hr/><hr/><pre>";print_r($response);echo "</pre><hr/>";die();
    //Get Bounce and Spam Email
    $eventDataRes = array();
    foreach($response as $item){
      foreach($events as $evKey => $ev){
        if($item['event'] === $ev){
          $eventDataRes[$resIndexes[$evKey]][] = $item['recipient'];
        }//End if condition        
      }//End foreach
    }//End foreach

    return $eventDataRes;
  }//End function

  function filterEmailsByTagAndMessageId($api_cred,$arr){
    $events          = array('accepted','delivered','failed','complained');//Events to get from apis
    $resIndexes      = array('accepted','sent','bounce','spam');//Indexes of response array
    $resTotalIndexes = array('Total Emails','Total Sent yet','Total Bounce','Total Spam');//Indexes of response array

    $mg = Mailgun::create($api_cred['api_key']); // For US servers
    #Instantiate the client.
    $queryString = array(
      'begin'     => $arr['start_date'],
      'ascending' => 'yes',
      'limit'     =>  300,
      'pretty'    => 'yes',
      //'event'     => implode(' OR ',$events),
      'tags'      => $arr['tag'],
      //'severity' => 'permanent',
    );

    $response = array();
    foreach($events as $key => $ev){
      $queryString['event'] = $ev;
      #Conditions for failed type(s)
      if($ev === 'failed' && $resIndexes[$key] === 'bounce'){
        $queryString['severity'] = 'permanent';
      }else{
        unset($queryString['severity']);
      }//End if condition

      #Get data from API
      $res = $mg->events()->get($api_cred['domain'], $queryString);
      //echo "<pre>";print_r(private_object_to_array($res));echo "</pre>";;die();
      #While loop for get all email with paging------------------------------------#
      #Object to array for paging
      $resPagingArr = private_object_to_array($res);
      $resPagingArr = $resPagingArr['items'];
      $findNext = true;
      while($findNext){
        $nextRes = $mg->events()->nextPage($res);
        $nextResArr = private_object_to_array($nextRes);
        if(sizeof($nextResArr['items']) > 0){//If next page has data then merge otherwise break the loop
          $resPagingArr = array_merge($resPagingArr,$nextResArr['items']);
          $res = $nextRes;//Reset $res with nextRes in order to complete pagination
        }else{
          $findNext = false;//Break the loop if there is no items
        }//End if condition
      }//End while loop
      $response = array_merge($response,$resPagingArr);
      //$res = $resPagingArr;
      #------------------------------------------------------------------------------#
    }//End foreach

    //Get Bounce and Spam Email
    $eventDataRes = array();
    foreach($response as $item){
      foreach($events as $evKey => $ev){
        if($item['event'] === $ev){
          $eventDataRes[$resIndexes[$evKey]][] = $item['recipient'];
        }//End if condition
      }//End foreach
    }//End foreach

    $eventDataRes['total'] = array();
    foreach($resIndexes as $key => $val){
      $eventDataRes['total'][$resTotalIndexes[$key]] = sizeof($eventDataRes[$val]);
    }//End foreach

    return $eventDataRes;
  }//End function

?>