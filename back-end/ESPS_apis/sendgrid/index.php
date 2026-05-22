<?php
//include "./functions.php";
//$SENDGRID_API_KEY = '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';
//$datetime = new DateTime('2010-12-30 23:21:46');
//echo strtotime($datetime->format('c')); // Updated ISO8601

//echo ('2010-12-30 23:21:46');
// $sg = new \SendGrid($SENDGRID_API_KEY);

// $email = new \SendGrid\Mail\Mail();
// $email->setFrom("kashiffazal99@gmail.com", "Kashif Fazal 99");
// $email->setSubject("Sending with SendGrid is Fun");
// $email->addTo("kashiffazalfullstack@gmail.com", "Kashif Faza; Full Stack");
// $email->addContent("text/plain", "and easy to do anywhere, even with PHP");
// $email->addContent(
//     "text/html", "<strong>and easy to do anywhere, even with PHP</strong>"
// );

//     // Tracking Settings
//     $email->setClickTracking(true, true);
//     $email->setOpenTracking(true, "--sub--");
//     $email->setSubscriptionTracking(
//         true,
//         "subscribe",
//         "<bold>subscribe</bold>",
//         "%%sub%%"
//     );
//     $email->setGanalytics(
//         true,
//         "utm_source",
//         "utm_medium",
//         "utm_term",
//         "utm_content",
//         "utm_campaign"
//     );

// //$sendgrid = new \SendGrid($SENDGRID_API_KEY);
// try {
//     $response = $sg->send($email);
//     print $response->statusCode() . "\n";
//     print_r($response->headers());
//     print $response->body() . "\n";
// } catch (Exception $e) {
//     echo 'Caught exception: '. $e->getMessage() ."\n";
// }

// $data = sendEmailToSingleRecipient(
//     $SENDGRID_API_KEY,
//     $arr = array(
//         'from' => array('kashiffazal99@gmail.com', 'Kashif Fazal 99'),
//         'to' => array('innotechcloud@gmail.com', 'Yushin Technologies'),
//         'subject' => 'Sending with SendGrid is Fun',
//         'plaintext' => 'and easy to do anywhere, even with PHP',
//         'content' => '<strong>and easy to do anywhere, even with PHP</strong>',
//     )
// );

// $data = sendMultipleEmailsToMultipleRecipients(
//     $SENDGRID_API_KEY,
//     $arr = array(
//         'from' => array('kashiffazal99@gmail.com', 'Kashif Fazal 99'),
//         'to' => array(
//             array(
//                 'email' => 'kashiffazalfullstack@gmail.com',
//                 'full_name' => 'Kashif Fazal Full Stack',
//                 'first_name' => 'Kashif Fazal',
//                 'last_name' => 'Full Stack',
//             ),
//             array(
//                 'email' => 'kashiffazal99@hotmail.com',
//                 'full_name' => 'Kashif Fazal Hotmail',
//                 'first_name' => 'Kashif Fazal',
//                 'last_name' => 'Hotmail',
//             ),
//             array(
//                 'email' => 'kashiffazaldeveloper@gmail.com',
//                 'full_name' => 'Kashif Fazal Developer Email',
//                 'first_name' => 'Kashif Fazal',
//                 'last_name' => 'Developer Email',
//             ),
//             array(
//                 'email' => 'kashiffazaldeveloper1000000000@gmail.com',
//                 'full_name' => 'Kashif Fazal Developer Email 00000000',
//                 'first_name' => 'Kashif Fazal 000',
//                 'last_name' => 'Developer Email 000',
//             ),
//         ),
//         'replayTo' => array('innotechcloud@gmail.com', 'Yushin Technologies'),
//         'campaign_id' => '12',
//         'subject' => 'Second Multi Hi <fullname/>!',
//         'plaintext' => 'Hello <fullname/>, your github is [email address suppressed] sent at -time-',
//         'content' => '<strong>Hello <fullname/>, your github is [email address suppressed]</strong> sent at -time-',
//     )
// );

//print_r($data);
