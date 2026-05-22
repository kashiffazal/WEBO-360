<?php
  include "../../../others/config.php";

  $ids = $_GET['id'];
  $ids = explode(',',$ids);

  $response = array();
  foreach($ids as $id){
    //Getting template name
    $data = dbQuery("SELECT template_file_name FROM $campaign_table WHERE id = '$id' AND inserted_by = '$session_user_id'");
    $templateName = $data['data'][0]['template_file_name'];
    
    //Delete record from DB
    $res = dbQuery("DELETE FROM $campaign_table WHERE id = '$id' AND inserted_by = '$session_user_id'");
    
    //Delete campaign files from directory
    if($res['status']){
      $res = dbQuery("DELETE FROM $campaign_report_table WHERE campaign_ref_id = '$id'");
      //Deleting files
      @unlink("../../../uploaded_files/templates/".$templateName);
      @unlink("../../../uploaded_files/plaintext/".$id."-plainText.txt");
  
      $res['successNotify'] = true;
      $res['successMsg'] = 'Record has been deleted';
    }//End if condition
    $response[] = $res;
  }//end foreach
  
  echo json_encode(bulk_response($response));

?>

