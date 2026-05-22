<?php
  //Get slash params in array
  $pathinfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : @$_SERVER['REDIRECT_URL'];    
  $params = preg_split('|/|', $pathinfo, -1, PREG_SPLIT_NO_EMPTY);
  //print_r($params);
?>