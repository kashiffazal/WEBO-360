<?php

    $app_post_data = true;
    include "../../../others/config.php";
    $_POST['id'] = encrypt_decrypt('decrypt',$_POST['id']);
    $res = dbQuery('post',$_POST,$subscriber_list_table);
    $res['successMsg'] = 'List name has been updated successfully';
    $res['successNotify'] = true;
    echo json_encode($res);

?>