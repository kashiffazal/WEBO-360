<?php

  include "../../../others/config.php";
  $data = dbQuery("SELECT id,permission,description FROM $users_permission_table");
  echo json_encode($data);

?>