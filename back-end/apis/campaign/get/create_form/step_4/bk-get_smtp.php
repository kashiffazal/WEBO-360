<?php
    include "../../../../../others/config.php";
    echo callAPI("GET",$domainPath."/apis/smtp/get/index.php?id=all&cols=id,name&app_no_session=true&session_id=".$session_user_id);
?>
