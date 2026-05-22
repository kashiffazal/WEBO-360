<?php
    include "../../../others/config.php";


    $response = array();
    $response['status'] = true;

    #Getting ESPS Mailing Accounts
    $res = getESPSserverAndAccountList();
    $response['data']['esps'] = $res['data'];

    #Getting Subscriber Action
    $response['data']['action_data'] = array(
        array('key' => 1, 'value' => 'Opened'),
        array('key' => 2, 'value' => 'Clicked'),
        array('key' => 3, 'value' => 'Unsubscribed'),
        array('key' => 4, 'value' => 'Not Open')  
    );

    echo json_encode($response);

?>