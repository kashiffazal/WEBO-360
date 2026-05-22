<?php

  include "./crul.php";
  $data = callAPI("GET",$domainPathLogin."/verifyEmail.php?e=".$_GET['e']."&s=".$_GET['s'],false,true);
  
  if($data['status']){
    header('Location: '.$data['redirectPath']);
  }else{
    header('Location: '.$data['redirectPathError']);
  }//End if condition
?>