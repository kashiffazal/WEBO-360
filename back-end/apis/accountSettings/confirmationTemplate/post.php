<?php
    
    $app_post_data = true;
    include "../../../others/config.php";
    $pathTemplate   = "../../../uploaded_files/templates/confirmation_template/";
    $pathPlainText  = "../../../uploaded_files/plaintext/confirmation_plaintext/";

    
  //print_r($_POST);exit();

    $res = createFile($_POST['html'],$pathTemplate,$session_user_id,'html');

    if($res['status']){
      //Ccreate
      $plainText = htmlToPlainText($_POST['html'],false);
      $res = createFile($plainText,$pathPlainText,$session_user_id,'txt');
      $res['successNotify'] = true;
      $res['successMsg'] = "Template has been updated.";
      $res['successNotifyType'] = 'notify';
    }//End if condition

    

    echo json_encode($res);

?>