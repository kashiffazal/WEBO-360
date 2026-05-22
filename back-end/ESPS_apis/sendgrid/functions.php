<?php

require dirname(__FILE__) . "/sendgrid-php/vendor/autoload.php";

use SendGrid\Mail\To;
use SendGrid\Mail\Personalization;
use SendGrid\Mail\Header;

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
    #If any from above attribute is missing this will return false

    $email = new \SendGrid\Mail\Mail(
        new \SendGrid\Mail\From($arr['from'][0], $arr['from'][1]),//From: Email and Name
        //new \SendGrid\Mail\From('info@bitinterpay.com'),
        null,//To: it will be provided later with substitute
        new \SendGrid\Mail\Subject($arr['subject']), // or array of subjects, these take precendence
        new \SendGrid\Mail\PlainTextContent($arr['plaintext']),//Plaintext
        new \SendGrid\Mail\HtmlContent($arr['content'])//HTML
    );

    foreach ($arr['to'] as $to) {
        $per = new Personalization();
        $per->addTo(new To($to['email'], $to['full_name']));
        //Set List-Unsubscribe and other headers for each subscriber ('unsubscribe_link' => link for our application, 'cid_ntl_uid_ntl' => random code to unsubscribe in our app DB)
        //$per->addHeader(new Header("List-Unsubscribe", '<'.$arr['unsubscribe_link'].@$to['cid_ntl_uid_ntl'].'>,<mailto:unsubscribe-'.@$to['cid_ntl_uid_ntl'].'@webo360mailer.com?subject=Unsubscribe>'));
        $per->addHeader(new Header("List-Unsubscribe", '<'.$arr['unsubscribe_link'].@$to['cid_ntl_uid_ntl'].'>,<mailto:unsubscribe@webo360mailer.com>'));
        $per->addHeader(new Header("X-Priority", '1 (Highest)'));
        $per->addHeader(new Header("X-MSMail-Priority", 'High'));
        $per->addHeader(new Header("Importance", 'High'));
        #Add Substitute -------------------------------------------#
        foreach(esps_template_tags() as $value){$per->addSubstitution($value['tag'], @$to[$value['value_var']]);}//End foreach
        #Create template links array
        if(isset($to['template_link_tags_esps'])){
            foreach($to['template_link_tags_esps'] as $key => $value){$per->addSubstitution('%'.$key.'%', $value);}//End foreach
        }//End if condition
        #-----------------------------------------------------------#
        $email->addPersonalization($per);//Add subscriber in email array one by one
    } //End foreach

    $email->addCategory($arr['campaign_id']);//Add category to filter bounce or spam emails
    $email->setReplyTo($arr['replayTo'][0], $arr['replayTo'][1]);//ReplyTo : Email and Name
    //echo json_encode($email, JSON_PRETTY_PRINT);die();

    $sendgrid = new \SendGrid($api_cred['api_key']);

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