<?php

	if ($_SERVER['HTTP_HOST'] == 'localhost') {
			#Local Host
			$mainDomain = "http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360";
			$mainSubDomain = $mainDomain."/public/app_client_sub_domains";
			$live_server = false;
			$host = "localhost";
			$user = "root";
			$password = "";
			$dbname = "webomailer360";
			$domainPath = $mainDomain."/back-end";
			$clientPath = $mainDomain."/public";
			//$clientDomainForLink = "http://localhost/myProjects/react/WEBOMailer360/WEBOMailer360/back-end/apis/campaign/tagActions/";
			$clientDomainForLink = $mainSubDomain;
			$redirectPath = "http://localhost:3000/#";
			$estimatedTimePerEmailInSecond = 7;
			$DIRECT_ACCESS_PAGE = (@$DIRECT_ACCESS_PAGE ? $DIRECT_ACCESS_PAGE : 'true');
	} else {
			#http://webo360mailer.com
			// $mainDomain = "webo360mailer.com";//Temp Comment
			// $mainSubDomain = "app.$mainDomain";//Temp Comment
			// $live_server = true;
			// $host = "localhost";
			// $user = "webofgtl_app_user";
			// $password = "#DrMsXcr^WY*";
			// $dbname = "webofgtl_app";
			// $domainPath = "https://$mainDomain/webo360";
			// $clientPath = "https://".$mainSubDomain;
			// $clientDomainForLink = "https://cw1.createwebo1.com";//Temp Comment
			// $redirectPath = "https://$mainSubDomain/#";
			// $estimatedTimePerEmailInSecond = 0.35;
			// $DIRECT_ACCESS_PAGE = (@$DIRECT_ACCESS_PAGE ? $DIRECT_ACCESS_PAGE : 'false');

			#https://webo360.innotechcloud.com
			$mainDomain = "webo360.innotechcloud.com";
			$mainSubDomain = $mainDomain;
			$live_server = true;
			$host = "localhost";
			$user = "u272433291_webo360_user";
			$password = "aA9s6Q33npV3";
			$dbname = "u272433291_webo360";
			$domainPath = "https://$mainDomain/back-end";
			$clientPath = "https://".$mainSubDomain;
			$clientDomainForLink = "https://$mainDomain/app_client_sub_domains";
			$redirectPath = "https://$mainSubDomain/#";
			$estimatedTimePerEmailInSecond = 0.35;
			$DIRECT_ACCESS_PAGE = (@$DIRECT_ACCESS_PAGE ? $DIRECT_ACCESS_PAGE : 'false');

	} //End if condition
	
	if(!isset($_SERVER['HTTP_REFERER']) AND $DIRECT_ACCESS_PAGE != 'true'){
		header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
	  exit;
	}//End if condition  
	
	//Domain Path for Email images (It will always be a live link)
	$clientPathEmail = "https://".$mainSubDomain;

	#cPanel Credentials for cPanel Api(s)
	$server_username = "webofgtl";
	$server_password = "NmFSYNBLWhjl";
	$server_ip = "199.188.200.213";
	$server_port = "2083";
	//$cronJobToken = "JT8ROPA3BOJ8P2FTTIIPVC0M6MY4Y78Z";

	mb_internal_encoding('UTF-8');
	mb_http_output('UTF-8');

	//Set DSN and PDO instance
	$dsn = "mysql:host=".$host.";dbname=".$dbname.";charset=utf8mb4";
	$pdo = new PDO($dsn,$user,$password);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
	
	//Tables name
	$users_table = "users";
	$subscriber_list_table = "subscribers_list";
	$subscribers_table = "subscribers";
	$subscriber_status_table = "subscriber_status";
	$campaign_table = "campaign";
	$campaign_report_table = "campaign_report";
	$esps_table = "esps_accounts";
	$esps_sendgrid_table = "esps_sendgrid";
	$esps_mailgun_table = "esps_mailgun";
	$smtp_table = "smtp";
	$template_links_table = "template_links";
	// -- User Management Tables
	$users_role_table = "users_role";
	$users_permission_table = "users_permission";
	$users_status_table = "users_status";

?>