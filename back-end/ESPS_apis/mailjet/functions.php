<?php
	require_once "vendor/autoload.php";
	use GuzzleHttp\Client;

	function sendMultipleEmailsToMultipleRecipients1000Subscribers($api_cred, $arr){
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

			$message = array();
			$testMessage = true;
			foreach($arr['to'] as $vl){
				$recipt = array();
				$recipt['To'][0] = array('Email' => $vl['email'],'Name' => $vl['full_name']);
				$recipt['Subject'] = $arr['subject'];
				$recipt['HTMLPart'] = $arr['content'];
				$recipt['TextPart'] = $arr['plaintext'];
				#Convert Tags to Values
				foreach(esps_template_tags() as $v){
					$recipt['Subject'] = str_replace($v['tag'],@$vl[$v['value_var']],$recipt['Subject']);
					$recipt['HTMLPart'] = str_replace($v['tag'],@$vl[$v['value_var']],$recipt['HTMLPart']);
					$recipt['TextPart'] = str_replace($v['tag'],@$vl[$v['value_var']],$recipt['TextPart']);
				}//End foreach
				#Convert Extra links tags to actual links
				if(isset($vl['template_link_tags_esps'])){
					foreach($vl['template_link_tags_esps'] as $tk => $tv){
						$recipt['HTMLPart'] = str_replace('%'.$tk.'%',$tv,$recipt['HTMLPart']);
					}//End foreach
					$testMessage = false;
				}//End if condition
				$message[] = $recipt;
			}//End foreach

			foreach(esps_template_tags() as $v){
				$arr['content'] = str_replace($v['tag'],'[[var:'.$v['value_var'].']]',$arr['content']);
        $arr['plaintext'] = str_replace($v['tag'],'[[var:'.$v['value_var'].']]',$arr['plaintext']);
        $arr['subject'] = str_replace($v['tag'],'[[var:'.$v['value_var'].']]',$arr['subject']);
			}//End foreach
			
			$body = [
				'Globals' => [
					'From' => [
						'Email' => $arr['from'][0],
						'Name' => $arr['from'][1],
					],
					'Headers' => [
						'List-Unsubscribe' => '<' . $arr['unsubscribe_link'] . '[[var:cid_ntl_uid_ntl]]>,<mailto:unsubscribe@webo360mailer.com>',
						'Reply-To' => $arr['replayTo'][1] . ' <' . $arr['replayTo'][0] . '>',
						'X-Priority' => '1 (Highest)',
						'X-MSMail-Priority' => 'High',
						'Importance' => 'High',
					],
				],
				'Messages' => $message,
		];
		if(!$testMessage){
			$body['Globals']['CustomID'] = $arr['campaign_id'];
			$body['Globals']['CustomCampaign'] = $arr['campaign_id'];
		}//End if condition

		$client = new Client(['base_uri' => 'https://api.mailjet.com/v3.1/']);
		$response = $client->request('POST', 'send', ['json' => $body, 'auth' => [$api_cred['api_key'], $api_cred['secret_key']]]);
		$res = array();
		if ($response->getStatusCode() == 200) {
				$res['status'] = true;
				$res['campaignId'] = getCampaignIdByCustomId($api_cred,$arr['campaign_id']);
				//$body = $response->getBody();
				// echo '<pre>';
				// print_r(json_decode($body));
				// echo '</pre>';

		}else{
      $res['status'] = false;
		} //End if condition
		// print_r($response);
		//print_r($res);
    return $res;
	} //End function

function getCampaignIdByCustomId($api_cred,$customId){
    $client = new \GuzzleHttp\Client();
    $response = $client->request('GET', 'https://api.mailjet.com/v3/REST/message?CustomID='.$customId.'&Limit=1', ['auth' => [$api_cred['api_key'], $api_cred['secret_key']]]);
    //echo $response->getStatusCode(); // 200
    $body = $response->getBody();
    $data = json_decode($body,true);
    return $data['Data'][0]['CampaignID'];
}//End function

function getBounceAndSpam($api_cred,$campaign_id){

	#Because all campaign id must be same
	$campaign_id = explode(',',$campaign_id);
	$campaign_id = $campaign_id[0];

	$client = new \GuzzleHttp\Client();
	$response = $client->request('GET', 'https://api.mailjet.com/v3/REST/statcounters?SourceId='.$campaign_id.'&CounterSource=Campaign&CounterTiming=Message&CounterResolution=Lifetime', ['auth' => [$api_cred['api_key'], $api_cred['secret_key']]]);
	//echo $response->getStatusCode(); // 200
	$body = $response->getBody();
	$data = json_decode($body,true);
	//echo "<pre>";print_r($data);echo "</pre>";
	$res = array();
	$res['bounce'] = @$data['Data'][0] ? $data['Data'][0]['MessageHardBouncedCount'] : 0;
    $res['spam'] = @$data['Data'][0] ? $data['Data'][0]['MessageSpamCount'] : 0;
    
    $bounce = array();
    for($i = 0;$i<$res['bounce'];$i++){$bounce[] = '-';}//End foreach
    $res['bounce'] = $bounce;

    $spam = array();
    for($i = 0;$i<$res['spam'];$i++){$spam[] = '-';}//End foreach
	$res['spam'] = $spam;
	
	return $res;
}//End function