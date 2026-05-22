<?php

    $app_no_session = true;
    $app_post_data = true;
    include "../../others/config.php";
    require_once('../../plugins/PHPMailer_v5.1/class.phpmailer.php'); //library added in download source
    
    $email = $_POST['email'];
    $res = dbQuery("SELECT first_name,last_name,password,email FROM $users_table WHERE email = '$email'");
    //print_r($res);exit();

    if(sizeof($res['data']) >= 1){
      $res = $res['data'][0];

      $emailMsg = '
      <table style="border-collapse:collapse;table-layout:fixed;min-width:320px;width:100%;background-color:#f2f4f6" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>

      <div style="margin:0 auto;max-width:560px;min-width:280px;width:280px;width:calc(28000% - 167440px);font-family:sans-serif">
        <p style="margin:0px;padding:10px 0px;font-size:12px;color:#717a8a;">Forget Password</p>
      </div><!--End Container -->
    
      <div role="section" style="background-color:#ffffff">
        <div style="margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);word-wrap:break-word;word-break:break-word;font-family:sans-serif">
          <div style="margin:0px 20px;">
            <br/><br/>
            <a style="text-decoration:underline;color:#7856ff" href="'.$companyWebSite.'">
              <img style="border:0;display:block;height:auto;width:100%;max-width:200px" alt="'.$companyName.' logo" width="200" src="'.$clientPathEmail.'/image/logo.png">
            </a>
            <br/><br/>
            <p style="margin:0px">Hi '.$res['first_name'].' '.$res['last_name'].',</p>
            <br/>
            <h1 style="margin:0px;font-weight:normal;color:#111324;font-size:22px;line-height:31px;">Your password is</h1>
            <br/>
            <p style="margin:0px"><b>'.$res['password'].'</b></p>
            <br/>
          </div><!--End margins-->
        </div><!--End Container -->
        <br/><br/>
      </div>
    
      <div style="margin:0 auto;max-width:560px;min-width:280px;width:280px;width:calc(28000% - 167440px);font-family:sans-serif">
        <p style="margin:0px;padding:10px 0px;font-size:12px;color:#717a8a;line-height: 19px;">We\'re '.$companyName.'<br>'.$companyAddress.'</p>
      </div><!--End Container -->
    
    </td></tr></tbody></table>
    ';


      $receiverArr = array(array('email' => $res['email'], 'name' => $res['first_name']." ".$res['last_name']));
      $content = array(
          'subject' => 'Forget password',
          'body' => $emailMsg,
          'plaintext' => 'This is the plain text version of the email content'
      );
      
      $res = emailPHPMailer($emailSenderArr,$receiverArr,$content,$SMTPCred);

      if($res['status']){
        $res['successTitle'] = 'Email sent!';
        $res['successMsg'] = 'Please check your inbox.';
        $res['successNotify'] = true;
        $res['successNotifyType'] = 'notify';
      }//End if condition

    }else{
      $res['status'] = false;
      $res['errorTitle'] = 'Email is not registered';
      $res['errorMsg'] = 'Please provide your registered email';
    }//End if condition


    echo json_encode($res);



?>