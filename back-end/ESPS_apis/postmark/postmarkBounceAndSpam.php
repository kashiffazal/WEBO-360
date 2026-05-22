<?php

  #Campaign Server ID
  // $_GET['csid'] = '20530-33f5-category';
  $tag = @$_GET['csid'];#Server id is used for Tag at sending
  $apiKey = '5d8682de-1987-4a72-9d76-d40b4646680c';

  if (!$tag) {echo '<h1>Please provide API Key</h1>';die();} //End if condition

  $hardBounceEmails = array();
  $softBounceEmails = array();
  $spamNotifyEmails = array();
  $spamComplaintEmails = array();

    try{
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, 'https://api.postmarkapp.com/bounces?type=HardBounce&inactive=true&count=500&offset=0&tag='.$tag);
        // curl_setopt($curl, CURLOPT_POST, true);
        // curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
        // curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json', 'X-Postmark-Server-Token: '.$apiKey));
        $result = curl_exec($curl);
        curl_close($curl);
        $reportData = json_decode($result,true);
        // print_r($reportData);
        foreach($reportData['Bounces'] as $e){
            if($e['Type'] === 'HardBounce'){$hardBounceEmails[] = $e['Email'];}//End if condition
            if($e['Type'] === 'Transient'){$softBounceEmails[] = $e['Email'];}//End if condition
            if($e['Type'] === 'SpamNotification'){$spamNotifyEmails[] = $e['Email'];}//End if condition
            if($e['Type'] === 'SpamComplaint'){$spamComplaintEmails[] = $e['Email'];}//End if condition
        }//End foreach

    }catch(Exception  $ex){
        $res['status'] = false;
        $res['errorMSg'] = $ex->message;
    }catch(Exception $generalException){
        $res['status'] = false;
        $res['errorMSg'] = ' API was unreachable or times out.';
    }//End
    
    $resCount = array(
      'hardBounce' => sizeof(array_unique($hardBounceEmails)),
      'softBounce' => sizeof(array_unique($softBounceEmails)),
      'spamNotify' => sizeof(array_unique($spamNotifyEmails)),
      'spamComplaint' => sizeof(array_unique($spamComplaintEmails))
    );
    $resArr = array(
      'hardBounce' => array_unique($hardBounceEmails),
      'softBounce' => array_unique($softBounceEmails),
      'spamNotify' => array_unique($spamNotifyEmails),
      'spamComplaint' => array_unique($spamComplaintEmails)
    );
    
    echo '
    <table border="1" width="100%">
      <tr>
      <td width="20%" valign="top">';
        echo '<h2>Count</h2>';foreach($resCount as $k => $v){echo $k.' => '.$v.'<br/>';}//End foreach
      echo '</td>
        <td width="20%" valign="top">';
          echo '<h2>Hard Bounce ('.sizeof($resArr['hardBounce']).')</h2>';
          foreach($resArr['hardBounce'] as $k => $v){echo $v.'<br/>';}//End foreach
        echo '</td>
        <td width="20%" valign="top">';
          echo '<h2>Soft Bounce ('.sizeof($resArr['softBounce']).')</h2>';
          foreach($resArr['softBounce'] as $k => $v){echo $v.'<br/>';}//End foreach
        echo '</td>
        <td width="20%" valign="top">';
          echo '<h2>Spam Notification ('.sizeof($resArr['spamNotify']).')</h2>';
          foreach($resArr['spamNotify'] as $k => $v){echo $v.'<br/>';}//End foreach
        echo '</td>
        <td width="20%" valign="top">';
          echo '<h2>Spam Complaint ('.sizeof($resArr['spamComplaint']).')</h2>';
          foreach($resArr['spamComplaint'] as $k => $v){echo $v.'<br/>';}//End foreach
        echo '</td>
      </tr>
    </table>
    ';





?>