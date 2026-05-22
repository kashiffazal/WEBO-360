<?php

  $app_post_data = true;
  include "../../../../others/config.php";
  $res = createFile($_POST['plainText'],"../../../../uploaded_files/plaintext/",$_POST['id']."-plainText",'txt');
  echo json_encode($res);

?>
