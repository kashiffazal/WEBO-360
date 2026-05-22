<?php
    #Set API array
    if(isset($_POST) && $_POST['to_email']){
      $to_name = split_name($toName);
      $_POST['to'] = array(
				array(
						'email' => $_POST['to_email'],
            'full_name' => $toName,
            'first_name' => $to_name[0],
						'last_name' => $to_name[1]
				)
      );
  }//End if condition

  if (isset($_POST) && @$_POST['campaign_id']) {
    $_POST['subject'] = "Campaign test email";
  }//End if condition

  $_POST['content'] = $template;
  $_POST['plaintext'] = $plaintext;
  $apiArray = createESPSarrayApi(@$_POST);
?>