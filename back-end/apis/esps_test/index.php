<?php
include "../../others/config.php";
include "../../ESPS_apis/functions.php";
include "../campaign/post/step_4/functions.php";
$_POST = json_decode(file_get_contents('php://input'), true);
//print_r($_POST);

#Set ESPS server and account id, also set To email for check email validation
include "./partials/1_esps_ids.php";
#$espsId,$espsAcId,$toEmail,$toName

#Get ESPS cred data
if(isset($_POST) && @$_POST['espsDetails']){
  $espsCred = $_POST['espsDetails'];  
}else{
  $espsCred = getESPScred($espsId, $espsAcId);
  $subDomain = $espsCred['link_domain_path'] ? $espsCred['link_domain_path'] : $subDomain;
}//End if condition

#Getting user's Test or Campaign template data
include "./partials/2_templates.php";
#$template,$plaintext

#Set API array
include "./partials/3_api_array.php";
#$apiArray
//print_r($espsId);
//print_r($espsCred);
//print_r($apiArray);
//die();
$res = sendEmailViaESPS($espsId,$espsCred,$apiArray);

echo json_encode($res);
