<?php
  include "../../../others/config.php";

  $list_id =  encrypt_decrypt('decrypt',$_GET['id']);

  $res = dbQuery("UPDATE $subscriber_list_table SET status = 'delete' WHERE id = '$list_id' AND inserted_by = '$session_user_id'");
  $res['successNotify'] = true;
  $res['successMsg'] = "List has been deleted successfully.";

  #Delete List with subscribers from db
  // $res = dbQuery("SELECT id FROM $subscriber_list_table WHERE id = '$list_id' AND inserted_by = '$session_user_id'");
  // if($res['status']){
  //   //Delete all subscribers in bulk with single list subscriber
  //   dbQuery("DELETE FROM $subscribers_table WHERE list_ref_id = '$list_id'");
  //   $data = dbQuery("SELECT list_ref_id FROM $subscribers_table WHERE list_ref_id LIKE '%$list_id%'");
  //   $data = array_unique_multidimensional_by_key($data['data'],'list_ref_id');
  //   foreach($data as $value){
  //     $db_list_ref_id = $value['list_ref_id'];
  //     $list_ref_id = remove_list_id_from_subscriber($db_list_ref_id,$list_id);
  //     dbQuery("UPDATE $subscribers_table SET list_ref_id = '$list_ref_id' WHERE list_ref_id = '$db_list_ref_id'");
  //   }//End if condition
  //   $res = dbQuery("DELETE FROM $subscriber_list_table WHERE id = '$list_id'");
  // }//End if condition

  echo json_encode($res);
?>
