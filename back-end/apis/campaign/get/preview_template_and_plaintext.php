<?php
    
  if(@$_GET['app_no_session'] == 'true'){
    $app_no_session = true;
    $session_user_id = @$_GET['session_user_id'];
    $DIRECT_ACCESS_PAGE = 'true';
  }//End if condition

  include "../../../others/config.php";
  //include "../post/step_4/send_campaign/1_functions.php";
  include "../post/step_4/functions.php";

  $campaign_id = $_GET['campaign_id'];
  $unsubscribe = @$_GET['unsubscribe'];

  $ct = $campaign_table;
  $ut = $users_table;
  $res = dbQuery("
    SELECT 
    $ct.id, $ct.campaign_name, $ct.subject_line, $ct.template_file_name, $ct.fromName, $ct.fromEmail, $ct.replayToName, $ct.replayToEmail, $ct.list_ref_id, $ct.link_domain_path,
    $ut.first_name, $ut.last_name, $ut.email
    FROM $ct
    INNER JOIN $ut
    ON $session_user_id = $ut.id
    WHERE $ct.id = '$campaign_id' AND $ct.inserted_by = '$session_user_id'");
  $res = $res['data'][0];
  $res['list_names']   = getListNamesByids($res['list_ref_id']);
  //print_r($res);die();

  $html_data = @file_get_contents("../../../uploaded_files/templates/".$res['template_file_name']);
  $plaintext_data = @file_get_contents("../../../uploaded_files/plaintext/".$campaign_id."-plainText.txt");

  //Add unsubscribe tag in html preview
  if($unsubscribe == 'u'){#u means show unsubscribe tag otherwise default is s (don't show)
    $html_data = add_unsubscribe_tag_into_template($html_data);
  }//End if condition


  $user_data = array(
    'id' => $session_user_id,
    'cid' => $campaign_id,
    'first_name' => $res['first_name'],
    'last_name' => $res['last_name'],
    'full_name' => $res['first_name'].' '.$res['last_name'],
    'email' => $res['email']
  );

  //Decode Subject Tags
  $res['subject_line'] = tagDecode($res['subject_line'],$user_data);

  #Tags decode and add links -----------------------------------------------------------------//
  #userData is used in 'setTemplateForSubscriber' function as global variable for link url
  //$userData = array('subDomain' => $clientDomainForLink);
  //Get template URL from DB by function
  $template_url_id = getTemplateLinkFromDB($campaign_id);//print_r($template_url_id);exit();
  $html_data = setTemplateWithDBLinks(
      $html_data,
      $template_url_id,
      $res['link_domain_path'] ? $res['link_domain_path'] : $clientDomainForLink,
      true,
      $user_data
    );
  //------------------------------------------------------------------------------------------//

?>


<html>
  <head>
    <title><?php echo $res['campaign_name']; ?> | <?php echo $companyName; ?></title>
    <style type="text/css">
      body{margin:0px;}
      .header{
        background: #FFF;
        position: relative;
        z-index: 10;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 2px;
        font-family:sans-serif;
        float: left;
        width: 100%;
      }
      .header div{
        float:left;
        width:50%;
      }
      .header div span.content{
        display:block;
        padding: 20px;
      }
      .header div:first-child p{
        color: #8e9aad;
        font-size: 13px;
        padding-bottom: 2px;
        margin:0px;
      }
      .header div:last-child span{
        text-align:right
      }
      .header div:last-child span:last-child{
        float: right;
      }
      .header div:last-child span div{
        width:100%
      }
      .button-group .button {
        float: left;
      }
      .button-group a.print{
        border: none;
        color: #8e9aad !important;
        font-weight: 100;
        text-decoration: underline;
        padding-right: 20px !important;
        float:left;
        font-size:12px;
        top: 3px;
        position: relative;
      }
      .button-group .button:nth-child(2) {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        /* border-right: 0; */
      }
      .button-group .button:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
      .button, a.button:active, a.button:link, a.button:visited {
        background-color: #fff;
        border: 1px solid #d2d7df;
        border-radius: 2px;
        box-sizing: content-box;
        color: #434d5d;
        cursor: pointer;
        display: inline-block;
        font-style: inherit;
        font-weight: 700;
        font-size: 12px;
        min-width: 36px;
        outline: none;
        padding: 4px 11px 5px;
        text-decoration: none;
        text-shadow: none;
        transition: background-color .1s;
        vertical-align: middle;
      }
      .button.small, a.button:active.small, a.button:link.small, a.button:visited.small, button.small {
       font-size: 12px;
        padding: 2px 8px;
      }
      .button.selected{
        background: #eee!important;
      }

      iframe,textarea{
        height: 525px;
        width:100%;
        border: none;
        border-top: 1px solid #c6c6c6;
      }
      textarea{
        padding: 10px;
        font-family: Courier New, Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: #1F1F1F;
        font-weight: normal;
        outline:none;
      }


    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <span class="content">
          <p><strong>From:</strong> <?php echo $res['fromName']." &#60;".$res['fromEmail']."&#62;"; ?><br/></p>
          <?php if($res['replayToName'] && $res['replayToEmail']){ ?>
            <p><strong>Reply-To:</strong> <?php echo $res['replayToName']." &#60;".$res['replayToEmail']."&#62;"; ?><br/></p>
          <?php } ?>
          <?php if(!$res['replayToName'] AND $res['replayToEmail']){ ?>
            <p><strong>Reply-To:</strong> <?php echo $res['replayToEmail']; ?><br/></p>
          <?php }?>
          <p><strong>Subject:</strong> <?php echo $res['subject_line']; ?></p>

          <?php if($res['list_names'] AND sizeof($res['list_names']) > 0){?>
            <p><strong>List Name:</strong> 
              <?php 
                foreach($res['list_names'] as $key => $value){
                  echo $value['list_name'];
                  if(sizeof($res['list_names']) === $key){echo ', ';}
                }//End foreach
              ?>
            </p>
          <?php } ?>

        </span>
      </div>
      <div>
        <span class="content">
          <?php if($plaintext_data){?>
            <div class="button-group" id="action_btn">
              <!-- <a href="#" class="small print">Print Preview</a> -->
              <a href="#" class="button small" id="html_c" onclick="showHide('html')">HTML</a>
              <a href="#" class="button small" id="plaintext_c" onclick="showHide('plaintext')">Plain text</a>
            </div>
          <?php }?>
        </span>
      </div>
    </div>


    

    <div id="html_container">
      <iframe srcdoc="<?php echo htmlentities($html_data); ?>"></iframe>
    </div>
    <div id="plainText_container">
      <textarea><?php echo $plaintext_data; ?></textarea>
    </div>



      <script>
        showHide("html");
        function showHide(type){
          //console.log(this);
          var html = document.getElementById("html_container");
          var html_lik = document.getElementById("html_c");
          var plaintext = document.getElementById("plainText_container");
          var plaintext_lik = document.getElementById("plaintext_c");

          if(type == 'html'){
            html.style.display = 'block';
            plaintext.style.display = 'none';
            html_lik.classList.add("selected");
            plaintext_lik.classList.remove("selected");
          }else{
            html.style.display = 'none';
            plaintext.style.display = 'block';
            html_lik.classList.remove("selected");
            plaintext_lik.classList.add("selected");
          }//End if condition
        }//End function
      </script>





  </body>
</html>