<?php

  include "../../../../../others/config.php";
  $template = getTemplateAndPlainText('template',$_GET['id'],"../../../../../uploaded_files");
  $res = array();
  $res['status'] = true;
  $res['data'] = $template;
  echo json_encode($res);

?>
