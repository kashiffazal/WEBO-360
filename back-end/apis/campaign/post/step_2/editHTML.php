<?php
    
    $app_post_data = true;
    include "../../../../others/config.php";
    $path = "../../../../uploaded_files/templates/";

    $id = $_POST['id'];
    $add_unsubscribe_tag = @$_POST['add_unsubscribe_tag'];
    
    //Getting file name to save new file with same name -----//
    $fileName = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$id'");
    $fileNameReal = $fileName['data'][0]['template_file_name'];
    $fileName = $fileNameReal;
    $fileName = preg_replace('/\\.[^.\\s]{3,4}$/', '', $fileName);//Removing file extension
    //--------------------------------------------------------//

    # if it's true then add unsubscribe tag and recreate new file
    if($add_unsubscribe_tag){
        $html = file_get_contents($path.$fileNameReal);
        $html = add_unsubscribe_tag_into_template($html);
    }else{
        $html = $_POST['html'];
    }//End if condition
    

    $res = createFile($html,$path,$fileName,'html');
    if($res['status']){
        $res = shortTemplateLinksWithDB($path.$fileName.".html",$id);
    }//End if condition
    echo json_encode($res);

?>