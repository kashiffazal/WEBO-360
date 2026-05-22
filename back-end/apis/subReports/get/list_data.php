<?php
    include "../../../others/config.php";
    echo json_encode(array('status' => true, 'data' => getListNamesByids($_GET['ids'])));
?>