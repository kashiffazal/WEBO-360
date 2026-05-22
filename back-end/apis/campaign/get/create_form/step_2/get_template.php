<?php

  include "../../../../../others/config.php";
  
  $id = $_GET['id'];
  $path = "../../../../../uploaded_files/templates/";
  
  $res = dbQuery("SELECT id,template_file_name,template_type FROM $campaign_table WHERE id = '$id' AND inserted_by = '$session_user_id'");
  
  $response = array();
  if($res['status']){
    $res = $res['data'][0];
    $data = file_get_contents($path.$res['template_file_name']);

    /** Checking javascript and unsubscribe tag in template --------------------*/
    $problems = array();
    $dom = new DOMDocument;//Create a new DOM document
    @$dom->loadHTML($data);//Parse the HTML. The @ is used to suppress any parsing errors //that will be thrown if the $html string isn't valid XHTML.
    //Get all problems. You could also use any other tag name here, //like 'img' or 'table', to extract other tags.
    if($p1 = $dom->getElementsByTagName('unsubscribe')){
      if(!($p1->length)){$problems['unsubscribe'] = 1;}
    }//End if condition
    if($p2 = $dom->getElementsByTagName('script')->length){$problems['script'] = $p2;}
    /** ----------------------------------------------------------------------*/

    /** Get SMTP List ----------------------*/
    $smtp = callAPI("GET",$domainPath."/apis/smtp/get/index.php?id=all&cols=id,name&app_no_session=true&session_user_id=".$session_user_id,false,true);
    $response['smtp'] = $smtp['data'];
    /** ------------------------------------*/

    /** Get user test email ----------------*/
    $ud = dbQuery("SELECT email,testEmail FROM $users_table WHERE id = '$session_user_id'");
    $response['testEmail'] = ($ud['data'][0]['testEmail'] ? $ud['data'][0]['testEmail'] : $ud['data'][0]['email']);
    /** ------------------------------------*/

    if($data){
      $response['status'] = true;
      //$response['html'] = $data;
      $response['problems'] = $problems;
    }else{
      if($res['template_type'] === 'composeHTML'){
        $response['status'] = true;
        //$response['html'] = '';
      }else{
        $response['status'] = false;
        $response['errorTitle'] = "HTML Error";
        $response['errorMsg'] = "Could not find html";
      }//End if condition

    }//End if condition

  }else{
    $response = $res;
  }//End if condition for dbQuery

  echo json_encode($response);


?>
