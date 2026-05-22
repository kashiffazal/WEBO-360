<?php
    
    include "../../../../../others/config.php";

    $id = $_GET['id'];
    $path = "../../../../../uploaded_files/templates/";

    $fileName = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$id' AND inserted_by = '$session_user_id'");
    $fileName = $fileName['data'][0]['template_file_name'];
    $fileName = preg_replace('/\\.[^.\\s]{3,4}$/', '', $fileName);//Removing file extension

    $data = htmlToPlainText($path.$fileName.".html");
    echo json_encode(array('status' => true, 'data' => $data));
?>