<?php
  
  ini_set('max_execution_time', 6000000); //300 seconds = 5 minutes
  ini_set('upload_max_filesize', '300M');
  ini_set('post_max_size', '300M');
  ini_set('max_input_time', 3000);

  include "../functions.php";//Global ESPS function
  include "./functions.php";//Specific MailGun function
  
  $api_cred = array('api_key' => '39eb137ba66dc17712fd97f3a465d545-9c988ee3-60a6c3e8', 'domain' => 'createwebo1.com');
  $arr = array('start_date' => 'Wed, 12 Feb 2020 20:02:54 -0000', 'tag' => '288-7313-category');
 // $res = getBounceAndSpamEmail($api_cred,$arr);
 // print_r($res);die();

  $arrFilterByTagAndId = array(
    'start_date' => 'Wed, 12 Feb 2020 20:02:54 -0000',
    'tag' => '288-7313-category',
    //'messageId' => '<20200206135004.1.EF742D5E29270653@wm.webo360mailer.com>'
  );
  $res = filterEmailsByTagAndMessageId($api_cred,$arrFilterByTagAndId);
  //print_r($res);die();
  echo json_encode($res);die();
  
  // $params = [
  //   'from'    => 'Haris hassan <news_letter@wm.webo360mailer.com>',
  //   'to'      => array(
  //     'Kashif Fazal FullStack <kashiffazalfullstack@gmail.com>',
  //     'Kashif Fazal Gmail <kashiffazal99001010101010101@gmail.com>'
  //   ),
  //   'subject' => 'The PHP SDK is %recipient.first% awesome!',
  //   'text'    => convertToUTF('It is so %recipient.first% simple to send a message.'),
  //   'html'    => convertToUTF('<p>This is %recipient.first% content</p>'),
  //   'h:List-Unsubscribe' => '<https://example.com>,<mailto:test@gmail.com>',
  //   'recipient-variables' => '{
  //     "kashiffazalfullstack@gmail.com": {"first":"Kashif Fullstack", "id":1},
  //     "kashiffazal99@gmail.com": {"first":"Kashif Fazal 99", "id": 2}      
  //   }'
  // ];
  // $res = $mg->messages()->send($domain, $params);
  // print_r($res);
  


?>