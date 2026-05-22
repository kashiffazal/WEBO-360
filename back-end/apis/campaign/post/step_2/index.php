<?php
    
    $app_post_data = true;
    include "../../../../others/config.php";
    $path = "../../../../uploaded_files/templates/";

    //echo getType($_POST['refetchFromURL']);
    //print_r($_POST);
    //print_r($_FILES);
    //exit();


    $id = $_POST['id'];

    if($_POST['template_type'] == 'importFromPC'){
        $res = fileUploadWithDB($_FILES['template_file_name'],$path,$id."-",false,$campaign_table,'template_file_name',"id = '$id'",$_POST,array('step','template_url','refetchFromURL','inserted_by'),array());
        if($res['status']){
            $res = shortTemplateLinksWithDB($path.$res['fileName'],$_POST['id']);
        }//End if condition
    }//End if condition

    if($_POST['template_type'] == 'importFromURL'){
        $url = $_POST['template_url'];
        $parse = parse_url($url);
        $fileName = $id."-".$parse['host'];
        $res = createHtmlFileFromUrl($url,$path,$fileName);
        if($res['status']){
            $html = $res['html'];
            $oldFileName = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$id'");
            $oldFileName = $oldFileName['data'][0]['template_file_name'];
            $_POST['template_file_name'] = $res['fileName'];
            $res = dbQuery('post',$_POST,$campaign_table,'step,refetchFromURL,inserted_by,availFile');
            if($res['status']){
                //Remove old file if new is created
                unlink($path.$oldFileName);
                $res = shortTemplateLinksWithDB($path.$_POST['template_file_name'],$_POST['id']);
            }//End if condition
        }//End if condition
    }//End if condition

    if($_POST['template_type'] == 'composeHTML'){
        $res = dbQuery('post',$_POST,$campaign_table,'step,template_file_name,refetchFromURL,inserted_by,availFile');
    }//End if condition


    echo json_encode($res);



?>