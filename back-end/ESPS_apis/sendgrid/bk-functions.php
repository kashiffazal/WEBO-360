<?php

require dirname(__FILE__) . "/sendgrid-php/vendor/autoload.php";

use SendGrid\Mail\To;
//use SendGrid\Mail\Cc;
//use SendGrid\Mail\Bcc;
//use SendGrid\Mail\From;
//use SendGrid\Mail\Content;
//use SendGrid\Mail\Mail;
use SendGrid\Mail\Personalization;
//use SendGrid\Mail\Subject;
use SendGrid\Mail\Header;
//use SendGrid\Mail\CustomArg;
//use SendGrid\Mail\SendAt;
//use SendGrid\Mail\Attachment;
//use SendGrid\Mail\Asm;
//use SendGrid\Mail\MailSettings;
//use SendGrid\Mail\BccSettings;
//use SendGrid\Mail\SandBoxMode;
//use SendGrid\Mail\BypassListManagement;
//use SendGrid\Mail\Footer;
//use SendGrid\Mail\SpamCheck;
//use SendGrid\Mail\TrackingSettings;
//use SendGrid\Mail\ClickTracking;
//use SendGrid\Mail\OpenTracking;
//use SendGrid\Mail\SubscriptionTracking;
//use SendGrid\Mail\Ganalytics;
//use SendGrid\Mail\ReplyTo;

function sendEmailToSingleRecipient($apiKey, $arr){

    if (!$apiKey) {return array('status' => false, 'errorMsg' => 'Please provide API Key');die();} //End if condition

    //Checking all required attributes
    $returnError = array('status' => false);
    if (!isset($arr['from'][0])) {$returnError['errorMsg'] = 'Invalid From attribute';}
    if (!isset($arr['to'][0])) {$returnError['errorMsg'] = 'Invalid To attribute';}
    if (!isset($arr['subject'])) {$returnError['errorMsg'] = 'Subject is missing';}
    if (!isset($arr['plaintext'])) {$returnError['errorMsg'] = 'Plaintext is missing';}
    if (!isset($arr['content'])) {$returnError['errorMsg'] = 'Content is missing';}
    if (isset($returnError['errorMsg'])) {return $returnError;die();}

    $email = new \SendGrid\Mail\Mail();
    $email->setFrom($arr['from'][0], $arr['from'][1]);
    $email->setSubject($arr['subject']);
    $email->addTo($arr['to'][0], $arr['to'][1]);
    $email->addContent("text/plain", $arr['plaintext']);
    $email->addContent("text/html", $arr['content']);
    $sendgrid = new \SendGrid($apiKey);

    $res = array();
    try {
        $response = $sendgrid->send($email);
        $statusCode = $response->statusCode();
        $body = json_decode($response->body(), true);
        $res['status'] = $statusCode == '202' ? true : false;
        $res['statusCode'] = $statusCode;
        $res['headers'] = $response->headers();
        $res['errorTitle'] = "Sending Error";
        $res['errorMsg'] = $body['errors'][0]['message'] ? $body['errors'][0]['message'] : 'Please check your internet connection';
    } catch (Exception $e) {
        $res['status'] = false;
        $res['errorMsg'] = $e->getMessage();
    }
    return $res;
} //End function

function sendMultipleEmailsToMultipleRecipients($apiKey, $arr){

    $limit = 1000;
    $toSubscribers = array_chunk($arr['to'],$limit);

    $res = array();
    foreach($toSubscribers as $to){
        $arr['to'] = $to;
        $res[] = sendMultipleEmailsToMultipleRecipients1000Subscribers($apiKey, $arr);
    }//End foreach

    $sendRes = array();
    $esps_send_id = array();
    $loopStatus = array('-');
    $errorRes = '';
    foreach($res as $key => $rs){
        if($rs['status']){
            $loopStatus[] = 'true';
            $esps_send_id[] = $rs['messageId'];
        }else{
            $loopStatus[] = 'false';
            $esps_send_id[] = '';
            $errorRes = $rs;
        }//End if condition
    }//End foreach
    $esps_send_id = $arr['campaign_id'].'-['.implode(',',$esps_send_id).']';

    if(array_search('false',$loopStatus)){
        $sendRes = $errorRes;
    }else{
        $sendRes = $res[0];
        $sendRes['esps_send_id'] = $esps_send_id;
    }//Endif condition
    return $sendRes;

}//End function

function sendMultipleEmailsToMultipleRecipients1000Subscribers($apiKey, $arr){

    if (!$apiKey) {return array('status' => false, 'errorMsg' => 'Please provide API Key');die();} //End if condition

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

    $from = new \SendGrid\Mail\From($arr['from'][0], $arr['from'][1]);

    $tos = array();
    foreach ($arr['to'] as $to) {

        #Create template links array
        $template_link_tags = array();
        if(isset($to['template_link_tags_esps'])){
            foreach($to['template_link_tags_esps'] as $key => $value){$template_link_tags['%'.$key.'%'] = $value;}//End foreach
        }//End if condition
        //print_r($template_link_tags);die();
        $tos[] = new \SendGrid\Mail\To($to['email'], $to['full_name'],
            array_merge(array(
                '<firstname/>' => @$to['first_name'],
                '<firstname />' => @$to['first_name'],
                '</firstname>' => @$to['first_name'],
                '[first_name]' => @$to['first_name'],
                '[Insert first name]' => @$to['first_name'],
                '<lastname/>' => @$to['last_name'],
                '<lastname />' => @$to['last_name'],
                '</lastname>' => @$to['last_name'],
                '[last_name]' => @$to['last_name'],
                '[Insert last name]' => @$to['last_name'],
                '<fullname/>' => @$to['full_name'],
                '<fullname />' => @$to['full_name'],
                '</fullname>' => @$to['full_name'],
                '[full_name]' => @$to['full_name'],
                '[Insert full name]' => @$to['full_name'],
                '[email address suppressed]' => $to['email'],
                '%cid_ntl_uid_ntl_open_track%' => @$to['cid_ntl_uid_ntl_open_track'],
                '%cid_ntl_uid_ntl%' => @$to['cid_ntl_uid_ntl']
                //'%uid_ntl%' => @$to['uid_ntl'],
            ),$template_link_tags)
        );
    } //End foreach
    //print_r($tos);die();
    $subject = new \SendGrid\Mail\Subject($arr['subject']); // default subject
    //$globalSubstitutions = ['-time-' => "2018-05-03 23:10:29"];
    $plainTextContent = new \SendGrid\Mail\PlainTextContent($arr['plaintext']);
    $htmlContent = new \SendGrid\Mail\HtmlContent($arr['content']);
    $email = new \SendGrid\Mail\Mail(
        $from,
        $tos,
        $subject, // or array of subjects, these take precendence
        $plainTextContent,
        $htmlContent
        //$globalSubstitutions
    );

    //$email->addHeader("List-Unsubscribe", "https://webo.createwebo1.com/w/unsubscribed.php");
    //$email->addHeader("List-Unsubscribe", "<mailto:unsubscribeexampexample@example.com>, <https://webo.createwebo1.com/w/unsubscribed.php>");
    //$email->addHeader("Content-Transfer-Encoding", "quoted-printable");
    //$email->addHeader("Content-Type", "[text/plain; charset=utf-8]");
    //$email->addHeader("charset", "utf-8");

    $email->addCategory($arr['campaign_id']);
    $email->setReplyTo($arr['replayTo'][0], $arr['replayTo'][1]);
    $sendgrid = new \SendGrid($apiKey);

    $res = array();
    try {
        $response = $sendgrid->send($email);
        $statusCode = $response->statusCode();
        $header = $response->headers();
        $body = json_decode($response->body(), true);

        if($statusCode == '202'){
            $res['status'] = true;
            $res['successMsg'] = 'Email has been sent, Please check your inbox';
            $res['messageId'] = trim(substr($header[7], 13, strlen($header[7])));
            $res['headers'] = $header;
        }else{
            $res['status'] = false;
            if($statusCode == '401'){
                $res['errorTitle'] = "Unauthorized Credentials";
                $res['errorMsg'] = 'Could not connect to mailing server';
            }else{
                $res['errorTitle'] = "Sending Error";
                $res['errorMsg'] = $body['errors'][0]['message'] ? $body['errors'][0]['message'] : 'Please check your internet connection';
            }//End if condition
        }//End if condition

    } catch (Exception $e) {
        $res['status'] = false;
        $res['errorMsg'] = $e->getMessage();
    } //End try
    return $res;
} //End function


function get_bounce_report($category,$api_key){
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.sendgrid.com/v3/messages?limit=50000&query=(Contains(categories%2C%22".$category."%22))%20AND%20status%3D%22not_delivered%22",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "{}",
        CURLOPT_HTTPHEADER => array("authorization: Bearer ".$api_key),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    
    if ($err) {
        return $err;
    } else {
        return $response;
    }
}//End function