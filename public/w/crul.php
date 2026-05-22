<?php

//Get slash params in array
  $pathinfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : @$_SERVER['REDIRECT_URL'];    
  $params = preg_split('|/|', $pathinfo, -1, PREG_SPLIT_NO_EMPTY);
  //print_r($params);
  
  if($_SERVER['HTTP_HOST'] == 'localhost'){
    $domainPath = "http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/apis/campaign/";
    $domainPathLogin = "http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/apis/login";
  }else{
    $domainPath = "https://webo360mailer.com/webo360/apis/campaign";
    $domainPathLogin = "https://webo360mailer.com/webo360/apis/login";
  }//End function

  #Call internal php internal or external API(s)
  function callAPI($method = 'GET', $url, $data = false, $jsonDecode = false){
    //if($data){$data = json_encode($data);}
    $curl = curl_init();
    switch ($method){
      case "POST":
          curl_setopt($curl, CURLOPT_POST, 1);
          if($data){curl_setopt($curl, CURLOPT_POSTFIELDS, $data);}
          break;
      case "PUT":
          curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
          if($data){curl_setopt($curl, CURLOPT_POSTFIELDS, $data);}
          break;
      default:
          if($data){$url = sprintf("%s?%s", $url, http_build_query($data));}
    }//End switch
    // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array("cache-control: no-cache"));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    // EXECUTE:
    $result = curl_exec($curl);
    if(!$result){die("Connection Failure");}
    curl_close($curl);
    if($jsonDecode){
      return json_decode($result,true);
    }else{
      return $result;
    }//End if condition
  }//End function

  #Letter to Number ASCII
  function letterToNumberAscii($letter){
    for($i = 0, $j = strlen($letter); $i < $j; $i++){
      //@ for 0
      if($letter[$i] == '@'){
        $dec_array[] = 0;
      }else{
        $dec_array[] = ord($letter[$i])-96;
      }//End if condition      
    }//End for
    return implode("",$dec_array);
  }//End function


?>
