<?php

function setTemplateWithDBLinks($html,$dbUrlIds,$subdomain = false,$preview = false,$subscriberData = array(),$domainPathByESPS = false){
  global $clientDomainForLink;
  /*
    - First: Set ESPS Provided domain if available
    - Seccond: Set domain by $subdomain variable if available
    - Third: Set default domain path with $clientDomainForLink variable (defined in 1-connection-and-paths.php file)
  */
  $subDomain = $domainPathByESPS ? $domainPathByESPS : ($subdomain ? $subdomain : $clientDomainForLink);

  #If template is loaded for preview then add '-pr' flag, (It will ignore unsubscribe action)
  $preview_flag = false;
  if($preview){
    $html = tagDecode($html,$subscriberData);
    $preview_flag = "-pr";
    #Create required flags for user id and campaign id (in params)
    $params = numberToLetter(@$subscriberData['id']."-".@$subscriberData['cid']);
  }else{
    #Create required flags for user id and campaign id (in params) with tags 
    $params = '%cid_ntl_uid_ntl%';
  }//End if condition

  #Creating Links ------------------------------------------------------------------#
  $click_URL = $subDomain."/c/";
  $unSub_URL = $subDomain."/u/";
  $imgTr_URL = $subDomain."/t/";
  if($preview){
    $unSub_URL = $unSub_URL.encrypt_decrypt('encrypt',$params.$preview_flag);
    $imgTr_URL = $imgTr_URL.encrypt_decrypt('encrypt',$params.'-'.randCode().$preview_flag);
  }else{
    $unSub_URL = $unSub_URL.$params;
    $imgTr_URL = $imgTr_URL."%cid_ntl_uid_ntl_open_track%";
  }//End if condition
  
  $xml = new DOMDocument;
  @$xml->loadHTML($html);

  //Loop through each <a> and </a> tag in the dom and replace Link//
  foreach($xml->getElementsByTagName('a') as $key => $link){
    $cLink = $link->getAttribute('href');
    
    if($preview){
      $cLink = encrypt_decrypt('encrypt',$params."-".numberToLetter($dbUrlIds[$cLink]['id']).$preview_flag);
    }else{
      $cLink = '%cid_ntl_uid_ntl_tl_'.$key.'%';
    }//End if condition

    $link->setAttribute('href',$click_URL.$cLink);
    $link->setAttribute('target','_blank');
  }//End foreach
  #---------------------------------------------------------------------------------#

  # Attached image for tracking link ----#
  $img = $xml->createElement('img');
  $img->setAttribute('src', $imgTr_URL);
  $img->setAttribute('width','1px');
  $img->setAttribute('height','1px');
  $img->setAttribute('alt','');
  $xml->appendChild($img);
  #---------------------------------------#

  #Set unsubscribe link ----------------------------------------//
  foreach($xml->getElementsByTagName('unsubscribe') as $unsubscribe){
      //Setting element text (if text available or not)
      if($unsubscribe->nodeValue){$tagValue = $unsubscribe->nodeValue;}else{$tagValue = "unsubscribe";}//End if condition
      $link = $xml->createElement('a',$tagValue);//Create new element as <a>
      $link->setAttribute('href', $unSub_URL);
      //$class = $unsubscribe->getAttribute('class');//Get unsubscribed tag class
      $link->setAttribute('target','_blank');
      //Get and set unsubscribed tag styles, If its auto added by application
      //if($class === 'autokpq'){$link->setAttribute('style', $unsubscribe->getAttribute('style'));}//End if condition
      $unsubscribe->parentNode->replaceChild($link, $unsubscribe);//Replace unsubscribed tag to <a>
  }//End foreach
  #------------------------------------------------------------//
  
  $html = $xml->saveHtml();
  $html = trim(str_replace('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">','',$html));
  return $html;

}//End function

function tagDecode($html_or_string,$userDataArr){
  $dt = $userDataArr;
  $st = $html_or_string;
  $st = str_replace("<firstname/>" ,@$dt['first_name'],$st);
  $st = str_replace("<firstname />" ,@$dt['first_name'],$st);
  $st = str_replace("</firstname>" ,@$dt['first_name'],$st);
  $st = str_replace("<firstname></firstname>" ,@$dt['first_name'],$st);
  $st = str_replace("[first_name]" ,@$dt['first_name'],$st);
  $st = str_replace("<lastname/>"  ,@$dt['last_name'],$st);
  $st = str_replace("<lastname />"  ,@$dt['last_name'],$st);
  $st = str_replace("</lastname>"  ,@$dt['last_name'],$st);
  $st = str_replace("<lastname></lastname>"  ,@$dt['last_name'],$st);
  $st = str_replace("[last_name]"  ,@$dt['last_name'],$st);
  $st = str_replace("<fullname/>"  ,@$dt['full_name'],$st);
  $st = str_replace("<fullname />"  ,@$dt['full_name'],$st);
  $st = str_replace("</fullname>"  ,@$dt['full_name'],$st);
  $st = str_replace("<fullname></fullname>"  ,@$dt['full_name'],$st);
  $st = str_replace("[full_name]"  ,@$dt['full_name'],$st);
  $st = str_replace("[email address suppressed]"  ,@$dt['email'],$st);
  //Campaign Tags fr confirmation email
  $st = str_replace("<campaign_name/>"  ,@$dt['campaign_name'],$st);
  $st = str_replace("</campaign_name>"  ,@$dt['campaign_name'],$st);
  $st = str_replace("<campaign_name></campaign_name>"  ,@$dt['campaign_name'],$st);
  $st = str_replace("<total_subscribers/>"  ,@$dt['total_subscribers'],$st);
  $st = str_replace("</total_subscribers>"  ,@$dt['total_subscribers'],$st);
  $st = str_replace("<total_subscribers></total_subscribers>"  ,@$dt['total_subscribers'],$st);
  $st = str_replace("<total_bounced/>"  ,@$dt['total_bounced'],$st);
  $st = str_replace("</total_bounced>"  ,@$dt['total_bounced'],$st);
  $st = str_replace("<total_bounced></total_bounced>"  ,@$dt['total_bounced'],$st);
  //Subject tags
  $st = str_replace("[Insert first name]" ,@$dt['first_name'],$st);
  $st = str_replace("[Insert last name]"  ,@$dt['last_name'],$st);
  $st = str_replace("[Insert full name]"  ,@$dt['full_name'],$st);
  $st = str_replace("<subject/>"  ,@$dt['subject'],$st);
  $st = str_replace("<subject />"  ,@$dt['subject'],$st);
  $st = str_replace("</subject>"  ,@$dt['subject'],$st);
  $st = str_replace("<subject></subject>"  ,@$dt['subject'],$st);
  return $st;
}//End function



?>