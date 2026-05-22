<?php
  
  ini_set('max_execution_time', 6000000); //300 seconds = 5 minutes
  ini_set('upload_max_filesize', '300M');
  ini_set('post_max_size', '300M');
  ini_set('max_input_time', 3000);
  ini_set('memory_limit', '1024M'); // or you could use 1G


  #Session is always start at all apis because user login session must checked on all pages
  session_start();
  include dirname(__FILE__)."/1-connection-and-paths.php";
  include dirname(__FILE__)."/2-company-and-email-info.php";
  include dirname(__FILE__)."/3-access-cross-origin.php";
  include dirname(__FILE__)."/4-spash-params.php";

  if(@$app_post_data == true){
    # Condition is because '3-post-global.php' will return 'die()' if $_POST variable is not available
    # APIs like GET and other has no $_POST variable
    include dirname(__FILE__)."/5-post-global.php";
  }//End if condition
  
  include dirname(__FILE__)."/6-date-and-time.php";
  include dirname(__FILE__)."/7-other-defines.php";
  include dirname(__FILE__)."/8-general-functions.php";
  include dirname(__FILE__)."/9-specific-functions.php";

  #If we don't want to check session id like at login page etc
  if(@!$app_no_session == true){
    $session_user_id = check_login_session();
  }//End if condition

  
?>
