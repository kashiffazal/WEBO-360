<?php 

  $emailMsg = '

  <table style="border-collapse:collapse;table-layout:fixed;min-width:320px;width:100%;background-color:#f2f4f6" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>

  <div style="margin:0 auto;max-width:560px;min-width:280px;width:280px;width:calc(28000% - 167440px);font-family:sans-serif">
    <p style="margin:0px;padding:10px 0px;font-size:12px;color:#717a8a;">Confirm your email to activate your account</p>
  </div><!--End Container -->

  <div role="section" style="background-color:#ffffff">
    <div style="margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);word-wrap:break-word;word-break:break-word;font-family:sans-serif">
      <div style="margin:0px 20px;">
        <br/><br/>
        <a style="text-decoration:underline;color:#7856ff" href="'.$companyWebSite.'">
          <img style="border:0;display:block;height:auto;width:100%;max-width:200px" alt="'.$companyName.' logo" width="200" src="'.$clientPathEmail.'/image/logo.png">
        </a>
        <br/><br/>
        <p style="margin:0px">Hi '.$receiverArr[0]['name'].',</p>
        <br/>
        <h1 style="margin:0px;font-weight:normal;color:#111324;font-size:22px;line-height:31px;">Thanks for joining '.$companyName.'!</h1>
        <br/>
        <p style="margin:0px">Please confirm your email address to activate your account.</p>
        <br/>
        <a 
          style="border-radius:4px;display:inline-block;font-size:14px;font-weight:bold;line-height:24px;padding:12px 24px;text-align:center;text-decoration:none!important;color:#ffffff!important;background-color:#56ace9;font-family:sans-serif"
          href="'.$verificationLink.'" target="_blank" >Confirm my address</a>
        <br/><br/>
        <p style="margin:0px;font-size:12px;line-height:19px">If you didn\'t sign up to '.$companyName.', please ignore this email. It\'s likely someone else accidentally entered your address or made a typo.</p>
      </div><!--End margins-->
    </div><!--End Container -->
    <br/><br/>
  </div>

  <div style="margin:0 auto;max-width:560px;min-width:280px;width:280px;width:calc(28000% - 167440px);font-family:sans-serif">
    <p style="margin:0px;padding:10px 0px;font-size:12px;color:#717a8a;line-height: 19px;">We\'re '.$companyName.'<br>'.$companyAddress.'</p>
  </div><!--End Container -->

</td></tr></tbody></table>

  ';

  //echo $emailMsg;
?>
