<?php
    
    $app_post_data = true;
    include "../../../../others/config.php";
    $path = "../../../../uploaded_files/templates/";

    $id = $_POST['id'];

    //Remove old file if created ---------------//
    $fileName = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$id'");
    $fileName = $fileName['data'][0]['template_file_name'];
    //Remove old file if new is created
    if($fileName){@unlink($path.$fileName);}
    //------------------------------------------//
    

    $fileName = $id."-composedTemplate";
    $res = createFile($_POST['html'],$path,$fileName,'html');
    if($res['status']){
        $_POST['template_file_name'] = $res['fileName'];
        $res = dbQuery('post',$_POST,$campaign_table,'html,id');
        if($res['status']){
            $res = shortTemplateLinksWithDB($path.$_POST['template_file_name'],$id);
        }//End if condition
    }//End if condition

    echo json_encode($res);

?>