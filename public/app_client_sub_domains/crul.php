<?php

//Get slash params in array
  $pathinfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : @$_SERVER['REDIRECT_URL'];    
  $params = preg_split('|/|', $pathinfo, -1, PREG_SPLIT_NO_EMPTY);
  //print_r($params);
  
  if($_SERVER['HTTP_HOST'] == 'localhost'){
    $domainPath = "http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/apis/campaign/";
    $domainPathLogin = "http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/apis/login";
  }else{
    $domainPath = "https://webo360.innotechcloud.com/back-end/apis/campaign/";
    $domainPathLogin = "https://webo360.innotechcloud.com/apis/login";
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


  function encrypt_decrypt($action, $string,$ENCRYPTION_KEY = 'id_as_key',$secret_iv = 'secret_key'){
    $output = false;
    $encrypt_method = "AES-128-CBC";
    $secret_key = $ENCRYPTION_KEY;
    //$secret_iv = 'This is my secret iv';
  
    $key = hash('sha256', $secret_key);
    // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
  
    if ( $action == 'encrypt' ) {
      $output = openssl_encrypt($string, $encrypt_method, $key, OPENSSL_RAW_DATA, $iv);
      //$output = substr($output, 0, 14);
      //$output = base64_encode($output);
      $output = rtrim(strtr(base64_encode($output), '+/', '-_'), '=');
    }else if( $action == 'decrypt' ){
      $output = openssl_decrypt(
        //base64_decode($string),
        base64_decode(str_pad(strtr($string, '-_', '+/'), strlen($string) % 4, '=', STR_PAD_RIGHT)),
        $encrypt_method, $key, OPENSSL_RAW_DATA, $iv);
    }
    return $output;
  }//End function

?>
