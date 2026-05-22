<?php
#Access Cross Ogirin --------------------------------------------------------//
// array holding allowed Origin domains
$allowedOrigins = array(
    //'(http(s)://)?(www\.)?my\-domain\.com',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:3001',
    // 'http://webo.webo360mailer.com',
    // 'https://webo.webo360mailer.com',
    // 'https://webo360.netlify.app',
    // 'http://app.webo360mailer.com',
    // 'https://app.webo360mailer.com',
    'http://webo360.innotechcloud.com',
    'https://webo360.innotechcloud.com'
);

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] != '') {
    foreach ($allowedOrigins as $allowedOrigin) {
        if (preg_match('#' . $allowedOrigin . '#', $_SERVER['HTTP_ORIGIN'])) {
            header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
            header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
            header('Access-Control-Max-Age: 1000');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            header('Access-Control-Allow-Credentials: true'); //For browser cookies setup by php session
            break;
        } //End if condition
    } //End foreach
} //End if condition
//----------------------------------------------------------------------//

