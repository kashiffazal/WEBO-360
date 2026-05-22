<?php
    include "../../../../../others/config.php";
    $id = $_GET['id'];
    $pathTagged = "../../../../../uploaded_files/plaintext/";
    $data = @file_get_contents($pathTagged.$id."-plainText.txt");
    echo json_encode(array('status' => true, 'data' => $data));
?>