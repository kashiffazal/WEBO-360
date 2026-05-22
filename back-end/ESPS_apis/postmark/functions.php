<?php

// Import the Postmark Client Class:
require_once('vendor/autoload.php');
use Postmark\PostmarkClient;

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
    // print_rp($arr);
    $tags = esps_template_tags();
    // print_rp($tags);
    //Setting all available tags in templates
    if(isset($arr['to'][0]['template_link_tags_esps'])){
        foreach($arr['to'][0]['template_link_tags_esps'] as $key => $ftv){$tags[] = array('tag' => '%'.$key.'%', 'value_var' => $key);}//End foreach
    }//End if condition
    // print_rp($arr);die();

    $post = array();
    foreach($arr['to'] as $vl){
        $ar = array();
        $ar['Tag'] = $arr['campaign_id'];
        $ar['Headers'] = array(
            'X-Priority' => '1 (Highest)',
            'X-MSMail-Priority' => 'High',
            'Importance' => 'High'
        );
        $ar['From'] = $arr['from'][1].' <'.$arr['from'][0].'>';
        $ar['To'] = $vl['full_name'].' <'.$vl['email'].'>';
        // $vl['To'] = $vl['email'];
        $ar['ReplyTo'] = $arr['replayTo'][1].' <'.$arr['replayTo'][0].'>';
        // $vl['ReplyTo'] = $arr['replayTo'][0];
        $ar['Subject'] = $arr['subject'];
        $ar['HtmlBody'] = $arr['content'];
        $ar['TextBody'] = $arr['plaintext'];

        foreach($vl['template_link_tags_esps'] as $k => $v){$vl[$k] = $v;}//End foreach
        #Convert tags according to Elastic Email merge (tags) system
        foreach($tags as $tagValues){
            $ar['HtmlBody'] = str_replace($tagValues['tag'],@$vl[$tagValues['value_var']],$ar['HtmlBody']);
            $ar['TextBody'] = str_replace($tagValues['tag'],@$vl[$tagValues['value_var']],$ar['TextBody']);
            $ar['Subject'] = str_replace($tagValues['tag'],@$vl[$tagValues['value_var']],$ar['Subject']);
        }//End foreach
        $post[] = $ar;
    }//End foreach
    // print_rp($post);die();
    
    #Sending Email
    $res = array('messageId' => array());
    try{
        $newClient = new PostmarkClient($api_cred['api_key']);
        $responses = $newClient->sendEmailBatch($post);
        // print_rp($responses);
        foreach($responses as $key=>$response){$res['messageId'][] = $response->MessageID;}//End foreach
        $res['messageId'] = implode(',',$res['messageId']);
        $res['status'] = true;
    }catch(PostmarkException $ex){
        // If the client is able to communicate with the API in a timely fashion,
        // but the message data is invalid, or there's a server error, a PostmarkException can be thrown.
        $res['status'] = false;
        $res['errorMSg'] = $ex->message;
    }catch(Exception $generalException){
        // A general exception is thrown if the API 
        // was unreachable or times out.
        $res['status'] = false;
        $res['errorMSg'] = ' API was unreachable or times out.';
    }//End
    // print_rp($res);die();
    return $res;
}//End function

function getBounce($api_cred,$transactionIdsWithPrefix){
    if (!$api_cred['api_key']) {return array('status' => false, 'errorMsg' => 'Please provide API Key');die();} //End if condition
    #Server id is used for Tag at sending
    $tag = explode('-[',$transactionIdsWithPrefix)[0];

    $bounceEmails = array();
    $spamEmails = array();

    try{
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://api.postmarkapp.com/bounces?type=HardBounce&inactive=true&count=500&offset=0&tag='.$tag);
        // curl_setopt($curl, CURLOPT_POST, true);
        // curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
        // curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'X-Postmark-Server-Token: '.$api_cred['api_key']
        ));
        $result = curl_exec($curl);
        curl_close($curl);
        $reportData = json_decode($result,true);
        // print_r($reportData);
        foreach($reportData['Bounces'] as $e){
            if($e['Type'] === 'HardBounce' //  The server was unable to deliver your message (ex: unknown user, mailbox not found).
               OR
               $e['Type'] === 'Transient' // 	Message delayed - The server could not temporarily deliver your message (ex: Message is delayed due to network troubles).
            ){$bounceEmails[] = $e['Email'];}//End if condition

            if(
                // $e['Type'] === 'SpamNotification' // The message was delivered, but was either blocked by the user, or classified as spam, bulk mail, or had rejected content.
               // OR
               $e['Type'] === 'SpamComplaint' // The subscriber explicitly marked this message as spam.
            ){$spamEmails[] = $e['Email'];}//End if condition
        }//End foreach

    }catch(Exception  $ex){
        $res['status'] = false;
        $res['errorMSg'] = $ex->message;
    }catch(Exception $generalException){
        $res['status'] = false;
        $res['errorMSg'] = ' API was unreachable or times out.';
    }//End
    
    return array('bounce' => array_unique($bounceEmails), 'spam' => array_unique($spamEmails));
}//End function

?>


