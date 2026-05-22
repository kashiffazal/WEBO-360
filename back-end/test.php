<?php
$html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
	<title></title>
</head>
<body>
<p>Good Morning,</p>

<p>We are proud to announce that we are the Agency of Record for SSD Benefits.</p>

<p><br>
Regards,</p>

<p>Sophia J</p>

<p>100 Springdale Rd, A3 #253, Cherry Hill, NJ 08003</p>

<p>If you unsubscribe please go here</p>
<p>This email was sent to [email address suppressed]. If you are no longer interested you can <unsubscribe class="autokpq" style="color: #1d02ef;text-decoration: underline;cursor: pointer;">unsubscribe instantly.</unsubscribe></p></body>
</html>';

$html = str_replace('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">','',$html);
//$html = str_replace(array('\r\n'),'',$html);

$html = preg_replace( "/<\/p>\r\n/", "</p>", $html );



echo htmlentities($html);

?>