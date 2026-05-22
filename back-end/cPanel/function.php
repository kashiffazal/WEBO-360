<?php

    require dirname(__FILE__) . "/api.php";
    require dirname(__FILE__) . "/supporting_functions.php";
    /*
    - cPanel - Username (Required)
    - cPanel - Password (Required)
    - Server - IP Address (Required)
    - Server - Port (Optional) - Default is 2083
    */
    $cPanel = new cPanel($server_username, $server_password, $server_ip,$server_port);


    function domain_list($type = 'all'){
        global $cPanel;
        $result = $cPanel->execute('uapi','DomainInfo', 'list_domains');
        $res = array();
        if (!$result->status == 1) {
            $res['status'] = false;
            $res['errorMsg'] = "Cannot fetch domains list | " .$result->errors[0];
        }else{
            $res['status'] = true;
            switch ($type) {
                case 'all':
                    $res['data'] = json_decode(json_encode($result->data), true);
                    break;
                case 'sub_domains':
                    $res['data'] = json_decode(json_encode($result->data->sub_domains), true);
                    break;
                case 'parked_domains':
                    $res['data'] = json_decode(json_encode($result->data->parked_domains), true);
                    break;
                case 'addon_domains':
                    $res['data'] = json_decode(json_encode($result->data->addon_domains), true);
                    break;
                default:
                    $res['status'] = false;
                    $res['errorMsg'] = "Invalid type :all, sub_domains, parked_domains and addon_domains keyword are accepted";
                    break;
            }//End switch case
        }
        return $res;
    }//End function

    function domain_info($domain_name){
        global $cPanel;
        $result = $cPanel->execute('uapi','DomainInfo', 'single_domain_data', array('domain' => $domain_name));
        $res = array();
        if (!$result->status == 1) {
            $res['status'] = false;
            $res['errorMsg'] = "Cannot show domain information : {$result->messages[0]} | {$result->errors[0]}";
        }else{
            $res['status'] = true;
            $res['data'] = json_decode(json_encode($result->data), true);
        }
        return $res;
    }//End function

    function add_sub_domain($sub_domain_name,$root_domain_name){
        global $cPanel;

        if(getType($root_domain_name) != 'array'){
            return array(
                'status' => false,
                'errorMsg' => "Root domain must be provided in array"
            );
            die();
        }//End if condition

        $response = array();
        foreach($root_domain_name as $value){
            $res = array();
            $parameters = array(
                'domain' => $sub_domain_name,
                'rootdomain' => $value,
                'dir' => "/public_html/app_client_sub_domains/",
                'disallowdot' => 1,
            );
            $result = $cPanel->execute('api2',"SubDomain", "addsubdomain" , $parameters);
            if(isset($result->cpanelresult->error)){
                $res['status'] = false;
                $res['data'] = "Cannot add sub domain : {$result->cpanelresult->error} ";
            }else{
                $res['status'] = true;
                $res['data'] = "Sub domain added successfully";
            }//End if condition
            $response[] = $res;
        }//End foreach
        return $response;
    }//End function

    function delete_sub_domain($sub_domain){
        global $cPanel;
        if(getType($sub_domain) != 'array'){
            return array(
                'status' => false,
                'errorMsg' => "Root domain must be provided in array"
            );
            die();
        }//End if condition
        
        $response = array();
        foreach($sub_domain as $value){
            $res = array();
            $result = $cPanel->execute('api2',"SubDomain", "delsubdomain" ,  array('domain' => $value));
            if(isset($result->cpanelresult->error)){
                $res['status'] = false;
                $res['data'] = "Cannot delete sub domain : {$result->cpanelresult->error} ";
            }else{
                $res['status'] = true;
                $res['data'] = "Sub domain deleted successfully";
            }//End if condition
            $response[] = $res;
        }
        return $response;
    }//End function

    function edit_sub_domain($sub_domain_old,$sub_domain_new,$main_domain_arr){
        //Edit is not possible it just delete old and create new
        $sub_domain_arr = array();
        foreach($main_domain_arr as $key => $value){
            $sub_domain_arr[] = $sub_domain_old.$value;
            $main_domain_arr[$key] = substr($value, 1);//Removing starting . and _
        }//End foreach
        $res = delete_sub_domain($sub_domain_arr);
        if($res[0]['status']){
            $res = add_sub_domain($sub_domain_new,$main_domain_arr);
        }//End function
        return $res;
    }//End function
    
    function create_cron_job($date_time_arr,$api_or_path){
        global $cPanel;
        $date_time = set_cronjob_date_format($date_time_arr,false,5);
        //print_r($date_time);die();
        $return_error = array('status' => false);
        if (!isset($api_or_path))  {$return_error['errorMsg'] = "Please provide api server path e.g. '/usr/local/bin/php /home/{folder_name}/public_html/{file_path_with_name}' OR External URL";}
        if (!isset($date_time['day'])) {$return_error['errorMsg'] = "Please provide Day";}
        if (!isset($date_time['hour'])) {$return_error['errorMsg'] = "Please provide Hour";}
        if (!isset($date_time['minute'])) {$return_error['errorMsg'] = "Please provide Minute";}
        if (!isset($date_time['month'])) {$return_error['errorMsg'] = "Please provide Month";}
        if (!isset($date_time['weekday'])) {$return_error['errorMsg'] = "Please provide Weekday";}
        if (!isset($date_time['timezone'])) {$return_error['errorMsg'] = "Please provide Timezone";}
        if (isset($returnError['errorMsg'])) {return $returnError;die();}

        $cURL = strpos($api_or_path, 'http');
        if(isset($cURL)){
            $api_or_path = 'curl -s "'.$api_or_path.'"';
        }else{
            $api_or_path = "php ".$api_or_path;
        }//End if condition

        //Add Suffix (Don't email on cronjob set)
        $api_or_path = $api_or_path." > /dev/null 2>&1";

        $result = $cPanel->execute('api2',"Cron", "add_line" ,
            array(
                'command'        => $api_or_path,
                'day'            => $date_time['day'],
                'hour'           => $date_time['hour'],
                'minute'         => $date_time['minute'],
                'month'          => $date_time['month'],
                'weekday'        => $date_time['weekday']
            )
        );
        //return $result;
        $result = json_decode(json_encode($result->cpanelresult), true);
        $res = array();
        if (!isset($result['data'][0])) {
            $res['status'] = false;
            $res['errorMsg'] = "Cannot set cronjob : ".$result['error'];
        }else{
            $res['status'] = true;
            $res['data'] = $result['data'][0];
        }//End if condition
        return $res;
        //return $result;
    }//End function

    function remove_cron_job($lineKey){
        global $cPanel;  
        // List all cron jobs.
        $result = $cPanel->api2('Cron', 'fetchcron');
        $result = json_decode(json_encode($result->cpanelresult), true);
        foreach($result['data'] as $value){
            if($value['linekey'] == $lineKey){
                $line = $value['line'];
                break;
            }//End if condition
        }//End foreach

        if(isset($line)){
            $execut = $cPanel->api2('Cron', 'remove_line', array('line' => (int) $line));
            $result = array('status' => true , 'data' => $execut);
        }else{
            $result = array('status' => false, 'errorMsg' => 'Line key not found');
        }//End if condition

        return $result;
    }//End function

    //$k = domain_list();
    //$k = domain_info('webo360mailer.com');
    //$k = add_sub_domain("kashifss",array("webo360mailer.com","createwebo1.com"));

    
    #Note:
    #To delete the subdomain of an addon domain, separate the subdomain with an underscore (_) instead of a dot (.). For example, use the following format:
    #subdomain_addondomain.com (usa.createwebo1.com to usa_createwebo1.com)
    //$k = delete_sub_domain(array('kashiffazal.webo360mailer.com','kashiffazal_createwebo1.com'));
    //$k = edit_sub_domain("kashifss","kashiffazal", array('.webo360mailer.com','_createwebo1.com'));


    //$k = create_cron_job();
    //print_r($k);


?>