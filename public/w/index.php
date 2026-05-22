<?php

  include "./crul.php";
  
  $paramsVal = end($params);
  if($paramsVal == 'p'){
    include "./includes/template_preview.php";
    echo $preview_content;
  }else{
    include "./includes/action_tags.php";
  }//End if condition

?>
