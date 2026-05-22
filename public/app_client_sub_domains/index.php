<?php
  include "./crul.php";
  $paramsVal = end($params);
  if($paramsVal == 'p'){
    include "./includes/template_preview.php";
    echo $preview_content;
  }else{
    $paramsVal = encrypt_decrypt('decrypt',$paramsVal);
    $page_label = $params[sizeof($params)-2];
    include "./includes/action_tags.php";
  }//End if condition
?>