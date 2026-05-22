<?php

  include "../../../others/config.php";

  $html = companyTagsDecode(getAllTemplate('template',"../../../uploaded_files",true));

  $res = array();
  $res['status'] = true;
  $res['data'] = $html;
  echo json_encode($res);

?>