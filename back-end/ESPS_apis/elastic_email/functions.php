<?php


function sendMultipleEmailsToMultipleRecipients1000Subscribers($api_cred, $arr){
    if (!$api_cred['api_key']) {return array('status' => false, 'errorMsg' => 'Please provide API Key');die();} //End if condition
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


    $tags = esps_template_tags();
    //Setting all available tags in templates
    if(isset($arr['to'][0]['template_link_tags_esps'])){
        foreach($arr['to'][0]['template_link_tags_esps'] as $key => $ftv){$tags[] = array('tag' => '%'.$key.'%', 'value_var' => $key);}//End foreach
    }//End if condition

    #Convert tags according to Elastic Email merge (tags) system
    foreach($tags as $tagValues){
        $arr['content'] = str_replace($tagValues['tag'],'{'.$tagValues['value_var'].'}',$arr['content']);
        $arr['plaintext'] = str_replace($tagValues['tag'],'{'.$tagValues['value_var'].'}',$arr['plaintext']);
        $arr['subject'] = str_replace($tagValues['tag'],'{'.$tagValues['value_var'].'}',$arr['subject']);
    }//End foreach


    $arr['content'] = manageUnsubscribeLink($arr['content']);
    //die();

    #Creating CSV file for merge (tag)
    $csv_file = createSubscriberArrToCSV($arr['to'],$arr['campaign_id']);
    $file_name_with_full_path = realpath('./'.$csv_file);
    $post = array(
        'apiKey' => $api_cred['api_key'],
        'msg_from' => $arr['from'][0],
        'msg_from_name' => $arr['from'][1],
        'reply_to' => $arr['replayTo'][0],
        'reply_to_name' => $arr['replayTo'][1],
        //'msg_to' => 'kashiffazalfullstack@gmail.com;kashiffazal99@gmail.com',
        'subject' => $arr['subject'],
        'body_text' => $arr['plaintext'],
        'body_html' => $arr['content'],
        'charset' => 'utf-8',

        'headers_List-Unsubscribe' => 'List-Unsubscribe: <'.$arr['unsubscribe_link'].'{cid_ntl_uid_ntl}>,<mailto:unsubscribe@webo360mailer.com>',
        'headers_X-Priority' => 'X-Priority: 1 (Highest)',
        'headers_X-MSMail-Priority' => 'X-MSMail-Priority: High',
        'headers_Importance' => 'Importance: High',

        'file_contacts' => new CurlFile($file_name_with_full_path, 'text/csv', $csv_file),
        'mergeSourceFilename' => $csv_file,
        //'merge' => 'merge_firstname,merge_lastname'
        'isTransactional' => true
    );

    #Sending Email
    $res = array();
    try{
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://api.elasticemail.com/v2/email/send');
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($curl);
        curl_close($curl);
        //@unlink($csv_file);
        $res = json_decode($result,true);
        $res['status'] = true;
    }catch(Exception  $ex){
        $res['status'] = false;
        $res['errorMSg'] = $ex->getMessage();
    }
    return $res;
}//End function


function createSubscriberArrToCSV($to_arr,$file_name_prifix = ''){
    $file = fopen("tst.csv", 'w');
    $link_arr = @$to_arr[0]['template_link_tags_esps'] ? $to_arr[0]['template_link_tags_esps'] : array();

    //Create first row of CSV
    $unshift_arr = array('ToEmail','email','first_name','last_name','full_name','id','cid_ntl_uid_ntl_open_track','cid_ntl_uid_ntl');
    foreach($link_arr as $key => $vl){$unshift_arr[] = $key;}//End foreach
    //print_r($to_arr);

    //Create new CSV file
    $file_name = $file_name_prifix.'-'.rand(10,100).'.csv';
    $out = fopen($file_name, 'w');
    fputcsv($out, $unshift_arr);
    //Fill data in CSV
    foreach ($to_arr as $fl){
        $field = array($fl['email'],$fl['email'],$fl['first_name'],$fl['last_name'], $fl['full_name'], @$fl['id'], @$fl['cid_ntl_uid_ntl_open_track'], @$fl['cid_ntl_uid_ntl']);
        if(@$fl['template_link_tags_esps']){foreach ( $fl['template_link_tags_esps'] as $key => $dt){$field[] = $dt;}}
        fputcsv($out, $field);
    }//End foreach
    fclose($out);//Close file
    return $file_name;

}//End function


function getBounce($api_cred,$transactionIdsWithPrefix){
    
    if (!$api_cred['api_key']) {return array('status' => false, 'errorMsg' => 'Please provide API Key');die();} //End if condition

    #Extracting Transaction Ids from db campaign ids ---------------------------------------#
    $thenIndex = strpos($transactionIdsWithPrefix,'[')+1;
    $afterThenLength = strlen(substr($transactionIdsWithPrefix,$thenIndex))-1;
    $transactionIdsWithPrefix = explode(',',substr($transactionIdsWithPrefix,$thenIndex,$afterThenLength));
    //$transactionIdsWithPrefix = $transactionIdsWithPrefix[0];
    #----------------------------------------------------------------------------------------#
    $bounceEmailsArr = array();
    $spamEmailsArr = array();
    foreach($transactionIdsWithPrefix as $trid){
        $post = array(
            'apiKey' => $api_cred['api_key'],
            'transactionID' => $trid,
            'showFailed' => true,//For Bounce
            'showAbuse' => true,//For Spam
            //'showClicked' => true,
            //'showDelivered' => true,
            //'showErrors' => true,
            //'showMessageIDs' => true,
            //'showOpened' => true,
            //'showPending' => true,
            //'showSent' => true,
            //'showUnsubscribed' => true
        );
        $bounceEmails = array();
        $spamEmails = array();
        try{
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, 'https://api.elasticemail.com/v2/email/getstatus');
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            $result = curl_exec($curl);
            curl_close($curl);
            //@unlink($csv_file);
            $reportData = json_decode($result,true);
            //print_r($reportData);
            $data = $reportData['data']['failed'];
            foreach($data as $e){$bounceEmails[] = $e['address'];}
            $data = $reportData['data']['abusereports'];
            foreach($data as $e){$spamEmails[] = $e['address'];}

        }catch(Exception  $ex){
            $res['status'] = false;
            $res['errorMSg'] = $ex->getMessage();
        }
        $bounceEmailsArr = array_merge($bounceEmailsArr,$bounceEmails);
        $spamEmailsArr = array_merge($spamEmailsArr,$spamEmails);
    }//End foreach
    return array('bounce' => array_unique($bounceEmailsArr), 'spam' => array_unique($spamEmailsArr));
}//End function

function manageUnsubscribeLink($html){
    $unSubLink = '';
    $newUnSubLink = '';
    $xml = new DOMDocument;
    @$xml->loadHTML($html);
    //Loop through each <a> and </a> tag in the dom and replace Link//
    foreach($xml->getElementsByTagName('a') as $key => $link){
        $cLink = $link->getAttribute('href');
        $bracketStart = strpos($cLink, '{');
        $bracketEnd = strlen($cLink)-$bracketStart;
        $customEncriptIds = substr($cLink,$bracketStart,$bracketEnd);
        $linkAction = trim(substr($cLink,$bracketStart-2,1));
        if($linkAction === 'u'){
            $unSubLink = $cLink;
            $newUnSubLink = "{unsubscribe:$cLink}";
        }//End if condition
    }//End foreach
    return $html = str_replace($unSubLink,$newUnSubLink,$html);
}//End function

?>


