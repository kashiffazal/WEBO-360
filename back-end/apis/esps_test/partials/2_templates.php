<?php
#Getting user's Test or Campaign template data -----------------------------------#
$upFlPath = "../../uploaded_files";
if (isset($_POST) && @$_POST['campaign_id']) {

    $template = getTemplateAndPlainText('template', $_POST['campaign_id'], $upFlPath);
    #Set Template with shorter links with DB
    $template = setTemplateWithDBLinks($template,getTemplateLinkFromDB($_POST['campaign_id']),$subDomain,true,array(
        'first_name' => $firstName,
        'last_name' => $lastName,
        'full_name' => $toName
    ));//echo $eTemp;die();

    $plaintext = getTemplateAndPlainText('plaintext', $_POST['campaign_id'], $upFlPath);
} else {
    $testTemplate = $upFlPath . "/templates/test_template/" . $user_id . ".html";
    $testPlainText = $upFlPath . "/plaintext/test_plaintext/" . $user_id . ".txt";
    if (!file_exists($testTemplate)) {$testTemplate = $upFlPath . "/templates/test_template/default.html";} //End if condition
    if (!file_exists($testPlainText)) {$testPlainText = $upFlPath . "/plaintext/test_plaintext/default.txt";} //End if condition
    $template = companyTagsDecode(file_get_contents($testTemplate));
    $plaintext = file_get_contents($testPlainText);
} //End if condition
//--------------------------------------------------------------------------------#
