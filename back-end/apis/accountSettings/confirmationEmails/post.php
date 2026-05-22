<?php
    $app_post_data = true;
    include "../../../others/config.php";
    //if(!isset($_POST['data'])){exit();}
    //print_r($_POST);
    //print_r($_FILES);
    //exit();

    $_POST['id'] = $session_user_id;
    $post = dbQuery('post',$_POST,$users_table,'kc');

    $post['successNotify'] = true;
    $post['successMsg'] = "Data has been saved";
    echo json_encode($post);

?>