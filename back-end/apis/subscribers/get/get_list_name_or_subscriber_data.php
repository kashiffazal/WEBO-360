<?php

  include "../../../others/config.php";

  $limit = @$_GET['limit'];
  $list_id = @encrypt_decrypt('decrypt',$_GET['id']);

  if($list_id){

    #Getting and Saprating array into status
    $data = dbQuery("SELECT id,list_ref_id,full_name,email,status,inserted_date,inserted_time,updated_date,updated_time FROM $subscribers_table WHERE list_ref_id LIKE '%$list_id%' AND inserted_by = '$session_user_id'");
    $data['data'] = separate_list_by_status($data['data']);

    //Getting List name
    $list_name = dbQuery("SELECT id,list_name,description FROM $subscriber_list_table WHERE id = '$list_id' AND inserted_by = '$session_user_id'");
    $data['data']['list_name'] = $list_name['data'][0]['list_name'];
    $data['data']['description'] = $list_name['data'][0]['description'];

  }else{
    $data = dbQuery("SELECT id,list_name,description FROM $subscriber_list_table WHERE inserted_by = '$session_user_id' ORDER BY id DESC LIMIT $limit");

    //Adding encrypt id
    if($data['status']){
      foreach($data['data'] as $key => $value){
        $value['id'] = @encrypt_decrypt('encrypt',$value['id']);
        $data['data'][$key] = $value;
      }//End foreach
    }//End if condition

  }//End if condition

  echo json_encode($data);



?>
