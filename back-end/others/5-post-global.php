<?php
  if(isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {$_POST = array_merge($_POST, (array) json_decode(trim(file_get_contents('php://input')), true));}
  if(!$_POST){die();}
?>
