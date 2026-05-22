<?php
    $app_post_data = true;
    include "../../../../others/config.php";
    echo json_encode(dbQuery('post',$_POST,$campaign_table,'id'));
?>