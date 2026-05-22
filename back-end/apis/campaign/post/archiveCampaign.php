<?php
    include "../../../others/config.php";

    $ids = $_GET['id'];
    $ids = explode(',',$ids);

    $query = "UPDATE $campaign_table set log_status = 'archive' WHERE ";

    $idArr = array();
    foreach($ids as $id){$idArr[] = "id = '$id'";}//end foreach

    //Archive record from DB
    $res = dbQuery($query.implode(' OR ',$idArr));

    echo json_encode($res);

?>

