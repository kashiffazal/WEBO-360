<?php

  function getESPScred ($espsId,$espsAcId){
    global $esps_table;
    $sgd = dbQuery("SELECT table_name FROM $esps_table WHERE id = '$espsId'");
    $sgd = $sgd['data'][0]['table_name'];
    $sgd = dbQuery("SELECT * FROM $sgd WHERE id = '$espsAcId'");
    $sgd = $sgd['data'][0];
    if($sgd['link_domain_path']){
      $sgd['link_domain_path'] = str_replace('http://','',$sgd['link_domain_path']);
      $sgd['link_domain_path'] = str_replace('https://','',$sgd['link_domain_path']);
      $sgd['link_domain_path'] = 'https://'.$sgd['link_domain_path'];
    }//End if condition
    return $sgd;
  }//End function

  function createESPSarrayApi($postData,$checkPostData = false){
    global $session_user_id;
    global $users_table;
    if($checkPostData && !isset($postData)){return array('status' => false, 'errorMsg' => 'No posted data');die();}//End if condition
    $user_id = $session_user_id;
    $ud = dbQuery("SELECT first_name,last_name,fromName,fromEmail,replayToName,replayToEmail,testEmail FROM $users_table WHERE id = '$user_id'");
    $ud = $ud['data'][0];

    $res = array();
    $res['from'] = array(
      @$postData['from_email'] ? @$postData['from_email'] : $ud['fromEmail'],
      @$postData['from_name'] ? @$postData['from_name'] : $ud['fromName']
    );
    $res['replayTo'] = array(
      @$postData['replay_to_email'] ? @$postData['replay_to_email'] : $ud['replayToEmail'],
      @$postData['replay_to_name'] ? @$postData['replay_to_name'] : $ud['replayToName']
    );
    $res['subject'] = @$postData['subject'] ? @$postData['subject'] : 'ESPS test email';
    $res['campaign_id'] = @$postData['campaign_id'] ? @$postData['campaign_id'] : 'test-esps-email';
    #Set To array
    if(isset($postData) && isset($postData['to']) && gettype($postData['to']) == 'array'){
      $res['to'] = $postData['to'];
      //Array required at lest ('email','first_name','last_name')
    }else{
      $res['to'] = array(
        array(
          'email' => $ud['testEmail'],
          'first_name' => $ud['first_name'],
          'last_name' => $ud['last_name'],
          'full_name' => $ud['first_name'].' '.$ud['last_name']
        )
      );
    }//End if condition

    $res['plaintext'] = @$postData['plaintext'] ? @$postData['plaintext'] : 'Test plaintext';
    $res['content'] = @$postData['content'] ? @$postData['content'] : 'Test content';
    $res['unsubscribe_link'] = @$postData['unsubscribe_link'] ? @$postData['unsubscribe_link'] : '';

    return $res;

  }//End function

  function sendEmailViaESPS($serverId,$credentials,$apiArr){

    #SendGrid
    if ($serverId == '1') {
      include dirname(__FILE__) . "/sendgrid/functions.php";
      $api_cred = array('api_key' => $credentials['api_key']);
      $limit = 1000;
    } //End if condition
    #MailGun
    if ($serverId == '2') {
      include dirname(__FILE__) . "/mailgun/functions.php";
      $api_cred = array('api_key' => $credentials['api_key'], 'domain' => $credentials['domain']);
      $limit = 1000;
    }//End if condition
    #Elastic Email
    if ($serverId == '3') {
      include dirname(__FILE__) . "/elastic_email/functions.php";
      $api_cred = array('api_key' => $credentials['api_key']);
      $limit = 1000;
    }//End if condition
    #Mailjet Email
    if ($serverId == '4') {
      include dirname(__FILE__) . "/mailjet/functions.php";
      $api_cred = array('api_key' => $credentials['api_key'], 'secret_key' => $credentials['secret_key']);
      $limit = 45;
    }//End if condition
    #Postmark Email
    if ($serverId == '5') {
      include dirname(__FILE__) . "/postmark/functions.php";
      $api_cred = array('api_key' => $credentials['api_key']);
      $limit = 500;
    }//End if condition

    
    $toSubscribers = array_chunk($apiArr['to'],$limit);

    //Demo content for test
    //$arr['plaintext'] = 'This is [first_name] plaintext';
    //$arr['content'] = 'This is [first_name] content';

    $apiArr['content'] = convertToUTF($apiArr['content']);
    $apiArr['plaintext'] = convertToUTF($apiArr['plaintext']);

    $res = array();
    foreach($toSubscribers as $to){
      $apiArr['to'] = $to;
      $res[] = sendMultipleEmailsToMultipleRecipients1000Subscribers($api_cred, $apiArr);
    }//End foreach

    $sendRes = array();
    $esps_send_id = array();
    $loopStatus = array('-');
    $errorRes = '';
    foreach($res as $key => $rs){
        if($rs['status']){
            $loopStatus[] = 'true';
            if ($serverId == '1') {$esps_send_id[] = $rs['messageId'];}
            if ($serverId == '2') {$esps_send_id[] = $rs['messageId'];}
            if ($serverId == '3') {$esps_send_id[] = $rs['data']['transactionid'];}
            if ($serverId == '4') {$esps_send_id[] = $rs['campaignId'];}
            if ($serverId == '5') {$esps_send_id[] = $rs['messageId'];}
            //$esps_send_id[] = $rs['messageId'];
        }else{
            $loopStatus[] = 'false';
            $esps_send_id[] = '';
            $errorRes = $rs;
        }//End if condition
    }//End foreach
    $esps_send_id = $apiArr['campaign_id'].'-['.implode(',',$esps_send_id).']';

    if(array_search('false',$loopStatus)){
        $sendRes = $errorRes;
    }else{
        $sendRes = $res[0];
        $sendRes['esps_send_id'] = $esps_send_id;
    }//Endif condition
    $sendRes['successNotify'] = true;
    return $sendRes;
  }//End function

  function esps_bounce_or_spam($serverId,$credentials,$server_sent_id,$campaign_sent_date_time){

    //print_r($serverId);
    //print_r($credentials);
    //print_r($server_sent_id);

    $res = array('bounce' => array(), 'spam' => array());    
    if($serverId == '1'){
      include dirname(__FILE__) . "/sendgrid/functions.php";
      $data = get_bounce_report(getPrefixFromSentId($server_sent_id),$credentials['api_key']);
      #Filter email
      $data = json_decode($data,true);
      if(@$data['messages'] AND sizeof($data['messages'])>0){
        $bounce_email = array();
        foreach($data['messages'] as $value){$bounce_email[] = $value['to_email'];}//End foreach         
        $res['bounce'] = $bounce_email;
      }//End if condition
    }//End if condition

    if ($serverId == '2') {
      include dirname(__FILE__) . "/mailgun/functions.php";
      $arr = array(
        'start_date' => date('D, d M Y H:i:s', strtotime($campaign_sent_date_time.' - 2 days')).' -0000',
        'tag' => getPrefixFromSentId($server_sent_id)
      );
      $res = getBounceAndSpamEmail($credentials,$arr);
    }//End if condition

    if($serverId == '3'){
      include dirname(__FILE__) . "/elastic_email/functions.php";
      $res = getBounce($credentials,$server_sent_id);
    }//End if condition

    if($serverId == '4'){
      include dirname(__FILE__) . "/mailjet/functions.php";
      $res = getBounceAndSpam($credentials,getPostfixFromSentId($server_sent_id));
    }//End if condition

    if($serverId == '5'){
      include dirname(__FILE__) . "/postmark/functions.php";
      $res = getBounce($credentials,$server_sent_id);
    }//End if condition

    #If there is no bounce or spam array then set as empty
    if(!isset($res['bounce'])){$res['bounce'] = array();}
    if(!isset($res['spam'])){$res['spam'] = array();}

    return $res;
  }//End function

  #Remove Message id from server_sent_id
  function getPrefixFromSentId($server_sent_id){
    return substr($server_sent_id,0,strpos($server_sent_id,'[')-1);
  }//End function

  function getPostfixFromSentId($server_sent_id){
    $res = substr($server_sent_id,strpos($server_sent_id,'[')+1,strlen($server_sent_id));
    $res = substr($res,0,strlen($res)-1);
    return $res;
  }//End function

  function convertToUTF(string $content,string $type = 'plain'):string
  {
      if (mb_detect_encoding($content) != 'UTF-8'){
          $content.=(($type == 'plain')?'⋅':'<span style="display: none">⋅</span>');
      }
      return $content;
  }//End function


  function esps_template_tags(){
    return array(
      array('tag' => '<firstname></firstname>', 'value_var' => 'first_name'),
      array('tag' => '<firstname/>', 'value_var' => 'first_name'),
      array('tag' => '<firstname />', 'value_var' => 'first_name'),
      array('tag' => '</firstname>', 'value_var' => 'first_name'),
      array('tag' => '[first_name]', 'value_var' => 'first_name'),
      array('tag' => '[Insert first name]', 'value_var' => 'first_name'),
      array('tag' => '<lastname></lastname>', 'value_var' => 'last_name'),
      array('tag' => '<lastname/>', 'value_var' => 'last_name'),
      array('tag' => '<lastname />', 'value_var' => 'last_name'),
      array('tag' => '</lastname>', 'value_var' => 'last_name'),
      array('tag' => '[last_name]', 'value_var' => 'last_name'),
      array('tag' => '[Insert last name]', 'value_var' => 'last_name'),
      array('tag' => '<fullname></fullname>', 'value_var' => 'full_name'),
      array('tag' => '<fullname/>', 'value_var' => 'full_name'),
      array('tag' => '<fullname />', 'value_var' => 'full_name'),
      array('tag' => '</fullname>', 'value_var' => 'full_name'),
      array('tag' => '[full_name]', 'value_var' => 'full_name'),
      array('tag' => '[Insert full name]', 'value_var' => 'full_name'),
      array('tag' => '[email address suppressed]', 'value_var' => 'email'),
      array('tag' => '%cid_ntl_uid_ntl_open_track%', 'value_var' => 'cid_ntl_uid_ntl_open_track'),
      array('tag' => '%cid_ntl_uid_ntl%', 'value_var' => 'cid_ntl_uid_ntl'),
      array('tag' => '%uid_ntl%', 'value_var' => 'uid_ntl')
    );
  }//End function

  function private_object_to_array($object) {
    //return json_encode(extract_props($object));
    return extract_props($object);
  }//End function
  function extract_props($object) {
    $public = [];
    $reflection = new ReflectionClass(get_class($object));
    foreach ($reflection->getProperties() as $property) {
        $property->setAccessible(true);
        $value = $property->getValue($object);
        $name = $property->getName();
        if(is_array($value)) {
            $public[$name] = [];
            foreach ($value as $item) {
                if (is_object($item)) {
                    $itemArray = extract_props($item);
                    $public[$name][] = $itemArray;
                } else {
                    $public[$name][] = $item;
                }
            }
        } else if(is_object($value)) {
            $public[$name] = extract_props($value);
        } else $public[$name] = $value;
    }
    return $public;
  }//End function



    //$data = sengrid_get_report_by_campaign_id("73","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");

    // function sendgrid_get_bounce_email_from_array($data){
    //   $bounce_email = array();
    //   $data = json_decode($data,true);
    //   foreach($data['messages'] as $value){
    //     if($value['status'] != 'delivered'){
    //       $bounce_email[] = $value['to_email'];
    //     }//End function
    //   }//End foreach 
    //   return $bounce_email;
    // }//End function


    // function esps_get_report_array($esps_server_id,$cred,$campaign_id){
    //   #SendGrid
    //   if($esps_server_id == '1'){
    //     $res = sengrid_get_report_by_campaign_id($campaign_id,$cred['api_key']);
    //     $res = sendgrid_get_bounce_email_from_array($res);//List of bounce emails
    //   }//End if condition

    //   return $res;
    // }//End function




    //print_r($data);


?>