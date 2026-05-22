<?php
include '../../../others/config.php';
$list_data = dbQuery( "
  SELECT slt.*,
  COUNT(st.id) AS totalSubscribers
  FROM $subscriber_list_table as slt 
  LEFT JOIN $subscribers_table AS st ON st.status = '1' AND st.list_ref_id LIKE concat('%',slt.id,'%')
  WHERE slt.status = 'active' AND slt.inserted_by = '$session_user_id' 
  GROUP BY slt.id
  ORDER BY slt.id DESC
" );

foreach ( $list_data['data'] as $key => $value ) {
    $list_id = $value['id'];
    //$data = dbQuery( "SELECT COUNT(*) AS totalSubscribers FROM $subscribers_table WHERE status = '1' AND list_ref_id LIKE '%$list_id%'" );
    //$value['totalSubscribers'] = $data['data'][0]['totalSubscribers'];
    $value['dateTime'] = set_date( $value['inserted_date'].$value['inserted_time'] );
    //Encrypt id for showing in URL
    $value['id'] = encrypt_decrypt( 'encrypt', $value['id'] );
    $list_data['data'][$key] = $value;
}
//End foreach

echo json_encode( $list_data );

?>
