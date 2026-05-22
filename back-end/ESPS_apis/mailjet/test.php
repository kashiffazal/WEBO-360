<?php


require_once "vendor/autoload.php";

use GuzzleHttp\Client;
use GuzzleHttp\Psr7;




// use \Mailjet\Resources;
// $mj = new \Mailjet\Client(getenv('1152110fbeae373c1bf9b8811bb77e0c'), getenv('2546243b08a8e46bc608a0b91daf3695'),true,['version' => 'v3']);
// $filters = [
//   'CustomID' => '9939-606f-category'
// ];
// $response = $mj->get(Resources::$Message, ['filters' => $filters]);
// $response->success() && var_dump($response->getData());


// echo "<pre>";
// print_r($response);
// echo "</pre>";

$api_cred = array('api_key' => '1152110fbeae373c1bf9b8811bb77e0c', 'secret_key' => '2546243b08a8e46bc608a0b91daf3695');

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

$k = getBounceAndSpam($api_cred,'7742969844');
print_r($k);
die();
// $client = new GuzzleHttp\Client(['base_uri' => 'https://api.mailjet.com/v3/REST/message']);
// $response = $client->request(
//     'GET',
//     'CustomID=9939-606f-category',
//     ['auth' => ["1152110fbeae373c1bf9b8811bb77e0c", "2546243b08a8e46bc608a0b91daf3695"]]);

// try {
//     if ($response->getStatusCode() == 200) {
//         $body = $response->getBody();
//         $response = json_decode($body);
//         if ($response->Messages[0]->Status == 'success') {
//             $res = $response;
//         } //End if condition
//     } //End if condition

// } catch (ClientException $e) {
//     $error = array();
//     echo Psr7\Message::toString($e->getRequest());
//     echo Psr7\Message::toString($e->getResponse());
//     $error['request'] = $e->getRequest();
//     $res = $e->getResponse();
// } //End try catch

// echo "<pre>";
// print_r($res);
// echo "</pre>";

// die();
// $filters = [
//     'SourceId' => '$Campaign_ID',
//     'CounterSource' => 'Campaign',
//     'CounterTiming' => 'Message',
//     'CounterResolution' => 'Lifetime'
//   ];
// $client = new Client(['base_uri' => 'https://api.mailjet.com/v3/REST/statcounters']);
//try {
// $client = new GuzzleHttp\Client();
// $response = $client->request('GET', 'https://api.mailjet.com/v3/REST/statcounters?SourceId=9939-79eb-category&CounterSource=Campaign&CounterTiming=Message&CounterResolution=Lifetime', [
//     'auth' => ['1152110fbeae373c1bf9b8811bb77e0c', '2546243b08a8e46bc608a0b91daf3695']
// ]);

//$response = $client->request('GET', ['auth' => ['1152110fbeae373c1bf9b8811bb77e0c', '2546243b08a8e46bc608a0b91daf3695']]);
// echo "<pre>";
// print_r($response);
// echo "</pre>";
// echo "<hr/>";
// if ($response->getStatusCode() == 200) {
//     $body = $response->getBody();
//     echo '<pre>';
//     print_r(json_decode($body));
//     echo '</pre>';
// } //End if condition

// die();
$body = [
    "Globals" => [
        "From" => [
            "Email" => "careers@degreesfinders.com",
            "Name" => "Mailjet Pilot 2",
        ],
    ],
    'Messages' => [
        [
            'To' => [
                [
                    'Email' => "kashiffazal99@gmail.com",
                    'Name' => "passenger 1",
                ],
            ],
            'Subject' => "Your email flight plan!",
            'TextPart' => "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
            'HTMLPart' => "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!",
        ],
        [
            'To' => [
                [
                    'Email' => "kashiffazalfullstackkashiffazal2@gmail.com",
                    'Name' => "passenger 2",
                ],
            ],
            'Subject' => "Your email flight plan!",
            'TextPart' => "Dear passenger 2, welcome to Mailjet! May the delivery force be with you!",
            'HTMLPart' => "<h3>Dear passenger 2, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!<br />May the delivery force be with you!",
            'CustomID' => 'test-campaign-id',
            'CustomCampaign' => 'test-campaign-id'
        ],
    ],
];
$client = new Client(['base_uri' => 'https://api.mailjet.com/v3.1/']);
//try {
$response = $client->request('POST', 'send', ['json' => $body, 'auth' => [$api_cred['api_key'], $api_cred['secret_key']]]);
// echo "<pre>";
// print_r($response);
// echo "</pre>";
// echo "<hr/>";
if ($response->getStatusCode() == 200) {
    $body = $response->getBody();
    echo '<pre>';
    print_r(json_decode($body));
    echo '</pre>';
} //End if condition


function getCampaignIdByCustomId($api_cred,$customId){
    $client = new \GuzzleHttp\Client();
    $response = $client->request('GET', 'https://api.mailjet.com/v3/REST/message?CustomID='.$customId.'&Limit=1', ['auth' => [$api_cred['api_key'], $api_cred['secret_key']]]);
    //echo $response->getStatusCode(); // 200
    $body = $response->getBody();
    $data = json_decode($body,true);
    return $data['Data'][0]['CampaignID'];
}//End function

echo getCampaignIdByCustomId($api_cred,'test-campaign-id');



// if ($response->getStatusCode() == 200) {
//     $body = $response->getBody();
//     $response = json_decode($body);
//     if ($response->Messages[0]->Status == 'success') {
//         $res = $response;
//     } //End if condition
// } //End if condition

// } catch (ClientException $e) {
//     //$error = array();
//     //echo Psr7\Message::toString($e->getRequest());
//     //echo Psr7\Message::toString($e->getResponse());
//     //$error['request'] = $e->getRequest();
//     $res = $e->getResponse();
// } //End try catch

// echo '<pre>';
// print_r($res);
// echo '</pre>';
