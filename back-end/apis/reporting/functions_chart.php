<?php

    function xAxisListOfDateTime($startDateTime,$addHour = 24){
        //Get total hour from sent hour to next day 12 am;
        $temp = explode(" ",$startDateTime);
        $temp = (int) explode(":",$temp[1]);
        //print_r($temp);
        $remaimHour = (12 - @$temp[0]) ;
        $remaimHour = $remaimHour + $addHour;//add hour (24 = 1 day)
        //------------------------------------------//

        $xAxis = array();
        for($i = 0; $i < $remaimHour; $i++){
            if($i != 0){//Skip this at first time
                $temp = explode(" ",$startDateTime);
                $temp[1] = date('H:i:s', strtotime('+1 hour',strtotime($temp[1])));
                $startDateTime = $temp[0]." ".$temp[1];
                $date = new DateTime($startDateTime);
                $startDateTime = $date->format('Y-m-d g:i:s');
            }//End if condition
            $xAxis[] = $startDateTime;
        }//End for loop

        $i = 0;
        $day = 0;
        foreach($xAxis as $key => $value){
            if($i == 0){$ampm = explode(" ",$value);$ampm = strtolower($ampm[2]);}
            $dateTime = explode(" ",$value);
            $timePartial = explode(":",$dateTime[1]);
            $hour = $timePartial[0];

            $dateTime[0] = dateIncDecDays($dateTime[0],$day);

            if($hour == '12'){
                if(trim($ampm) == 'am'){
                    $ampm = 'pm';
                }else{
                    $ampm = 'am';
                    $day++;
                    $dateTime[0] = dateIncDecDays($dateTime[0]);
                }//End if condition
            }//End if condition
            $value = date("d M",strtotime($dateTime[0])).", ".roundTimeToNearestHour(implode(":",$timePartial)." ".$ampm);
            $xAxis[$key] =  $value;
            $i++;
        }//End foreach
        return $xAxis;
    }//End function

    function getOpenClickUnsubscribeChartArr($xAxis,$campaign_report_data,$campaign_sent_data){
        global $campaign_report_table;
        global $infoArr;

        $graphArray = array();
        foreach($infoArr['labelIndex'] as $v){$graphArray[$v] = array();}
        $other = $infoArr['other'];

        $dateArr = array(
            $campaign_sent_data,
            dateIncDecDays($campaign_sent_data)//increment by 1 'default'
        );
        #Loop on campaign report data
        foreach($campaign_report_data as $value){
            if(dateCprBet($value['action_date'],$dateArr)){
                $value['action_date_graph'] = date('d M',strtoTime($value['action_date']));
                $value['action_time_graph'] = roundTimeToNearestHour($value['action_time']);
                $comparableDateTime = trim($value['action_date_graph'].", ".$value['action_time_graph']);
                foreach($xAxis as $xaValue){
                    if(trim($comparableDateTime) == trim($xaValue)){
                        @$graphArray[$value['action']][$xaValue] = ($graphArray[$value['action']][$xaValue]+1);
                    }else{
                        @$graphArray[$value['action']][$xaValue] = ($graphArray[$value['action']][$xaValue]+0);
                    }//End if condition
                }//End foreach
            }//End if condition
        }//End foreach
        //print_r($graphArray);exit();
        $res = array();
        $i = 0;
        foreach($graphArray as $key => $value){
            $res[$key]['name'] = $infoArr['name'][$i];
            $res[$key]['color'] = $infoArr['color'][$i];
            $res[$key]['lineWidth'] = $infoArr['lineWidth'][$i];
            foreach($value as $ke => $val){
                if($i == 0){$res['xAxis'][] = $ke;}//End if condition
                $res[$key]['data'][] = $val;
            }//End foreach
            $i++;
        }//End foreach
        $res['others'] = $other;
        return $res;
    }//End function

    function campaign_report($id = false,$campaign_data = false,$campaign_report_data = false){
        global $campaign_table;
        global $campaign_report_table;
  
        if($id){
            #Get campaign data
            $c_data = dbQuery("SELECT campaign_name,sent_date,sent_time,recipientsCount,bounceCount,spamCount FROM $campaign_table WHERE id = '$id'");
            $c_data = $c_data['data'][0];
  
            #Get campaign report data
            $cr_data = dbQuery("SELECT * FROM $campaign_report_table WHERE campaign_ref_id = '$id'");
            $cr_data = $cr_data['data'];
        }else{
            $c_data     = $campaign_data;
            $cr_data    = $campaign_report_data;
        }//End if condition
  
        $c_data['bounceCount'] = $c_data['bounceCount'] ? $c_data['bounceCount'] : 0;
        $c_data['spamCount'] = $c_data['spamCount'] ? $c_data['spamCount'] : 0;


        // if(sizeof($cr_data))
        // echo "<hr/>";
        // print_r($cr_data);
        // echo "<hr/>";
  
  
        $openKey = 'Opened';
        $clickKey = 'Clicked';
        $unsubscribeKey = 'Unsubscribed';
  
        $uniqueData   = array(
            $openKey => array(),
            $clickKey => array(),
            $unsubscribeKey => array()
        );
        $totalOpen = array();
        $popularLinks = array();
        $topCountries = array();
        foreach($cr_data as $value){
            //Getting total open
            if($value['action'] == $openKey){$totalOpen[] = $value;}//End if condition
            
            //Getting popular links
            if($value['action'] == $clickKey){
                $popularLinks[$value['click_url']][$value['email_ref_id']][] =  $value;
            }//End if condition
  
            if($value['location']){
                parse_str($value['location'], $value['location']);
                $topCountries[$value['location']['country']][] = $value;
            }//End if condition
  
            @$uniqueData[$value['action']][$value['email_ref_id']] = ($uniqueData[$value['action']][$value['email_ref_id']]+1);
        }//End foreach
        //print_r($popularLinks);
        //print_r($topCountries);
  
  
        #Get actual percentage for all status --------------------//
        $total   = $c_data['recipientsCount'];
        $sent    = $c_data['recipientsCount'] - $c_data['bounceCount'];
        $bounced = $c_data['bounceCount'];
        $spam    = $c_data['spamCount'];
        
        $sentPercent = round($sent / $total * 100,2);
        $bouncedPercent = round($bounced / $total * 100,2);
        $spamPercent = round($spam / $total * 100,2);
        //---------------------------------------------------------//
        
        $resPie = array($openKey => array(),$clickKey => array());
        
        #Get open detail ----------------------------------------//
        $obtainValue = sizeof($uniqueData[$openKey]);
        $totalValue = $sent;
        $remainBounce = (100 - $bouncedPercent);
        $unique_open = (round($remainBounce / $totalValue * $obtainValue,2));
        $not_open = ($remainBounce - $unique_open); 
  
        $resPie[$openKey] = array(
            'unique_open' => $unique_open,
            'not_open' => $not_open,
            'bounced' => $bouncedPercent,
            'spam' => $spamPercent,
            'names' => array(
                'open' => 'Opens',
                'bounce' => 'Bounced',
                'not_open' => 'Not Open',
                'spam' => 'Spam'
            ),
            'color' => array(
                'open' => '#55b532',
                'bounce' => '#e7542b',
                'not_open' => '#468dc7',
                'spam' => '#90ed7d'
            )
        );
        //---------------------------------------------------------//
  
        #Get click detail ----------------------------------------//
        $click_count = sizeof($uniqueData[$clickKey]);
        if($uniqueData[$openKey]){
            $click_percent = round(sizeof($uniqueData[$clickKey]) / $sent * 100,2);
            //$click_percent = round(sizeof($uniqueData[$clickKey]) / sizeof($uniqueData[$openKey]) * 100,2);
        }else{
            $click_percent = 0;
        }
        //$click_percent = round(sizeof($uniqueData[$clickKey]) / sizeof($uniqueData[$openKey]) * 100,2);
        $resPie[$clickKey] = array(
            'click' => $click_count,
            'click_percent' => $click_percent
        );
        //---------------------------------------------------------//
  
        #Get unsubscribe detail ----------------------------------------//
        if(isset($uniqueData[$unsubscribeKey])){
            $unsCount = sizeof($uniqueData[$unsubscribeKey]);
        }else{
            $unsCount = 0;
        }//End if condition
  
        if(isset($uniqueData[$unsubscribeKey])){
            $unsCount = sizeof($uniqueData[$unsubscribeKey]);
        }else{
            $unsCount = 0;
        }//End if condition
  
        $resPie[$unsubscribeKey] = array(
            'unsubscribed' => $unsCount,
            'unsubscribe_percent' => round($unsCount / $sent * 100,2)
        );
        //---------------------------------------------------------//
  
  
        #Get proper popular links --------------------------------//
        $tempProperLink = array();
        //print_r($popularLinks);
        $totalClicks = 0;
        $totalClickByPersons = array();
        $avarage_clicks_per_person = array();
        foreach($popularLinks as $key => $value){
          $clicks = array();
          $l = 0;
          $click_person = array();
          foreach($value as $inKey => $inValue){
            @$clicks[$l] = $clicks[$l] + sizeof($inValue);
            $click_person[] = $inKey;
          }//End foreach
  
          $totalClicks = ($totalClicks+$clicks[0]);
          $totalClickByPersons = array_merge($totalClickByPersons,$click_person);
          $totalClickByPersons = array_unique($totalClickByPersons);
          
          $avarage_clicks_per_person[] = sizeof($click_person);
  
          $tempProperLink[] = array(
            'link' => $key,
            'clicks' => $clicks[0],
            'click_person_count' => sizeof($click_person),
            'click_unique_person' => $click_person
          );
        }//End foreach
  
        if($avarage_clicks_per_person){
          $avarageClickPercen =  round(array_sum($avarage_clicks_per_person) / count($avarage_clicks_per_person));//Normal average method (total/count)
        }else{
            $avarageClickPercen = 0;
        }//End if condition
  
        $popularLinks = array();
        $popularLinks['link_list'] = $tempProperLink;
        $popularLinks['details'] = array(
          'person_clicked' => $click_count,
          'clicked_rate' => $click_percent,
          'total_clicks' => $totalClicks,
          'clicks_made_by_total_person' => sizeof($totalClickByPersons),
          'avarage_clicks_per_person' => $avarageClickPercen,
          'not_clicked' => ($sent - $click_count),
          'not_clicked_persent' => (100 - $click_percent),
        );
        $resPie['popular_links'] = $popularLinks;
        //--------------------------------------------------------//
        //print_r($popularLinks);
  
  
        #Get to countries list ----------------------------------//
        $tempTopCountries = array();
        foreach($topCountries as $key => $value){
            $temp = array();
            foreach($value as $inKey => $inValue){
                $temp[$inValue['action']]['email_ref_id'][] = $inValue['email_ref_id'];
            }//End foreach
  
            if(isset($temp['Opened']['email_ref_id'])){
                $openSizeof = sizeof($temp['Opened']['email_ref_id']);
            }else{
                $openSizeof = 0;
            }//End if condition
  
            $tempTopCountries[] = array(
                'country' => $key,
                'click' => @$value['action'],
                'open' => $openSizeof,
                'click' => @sizeof(gettype($temp['Clicked']['email_ref_id']) === 'array' ? $temp['Clicked']['email_ref_id'] : []),
                'open_subscribers' => @$temp['Opened']['email_ref_id'],
                'click_subscribers' => @$temp['Clicked']['email_ref_id']
            );
        }//End foreach
        $resPie['top_countries'] = $tempTopCountries;
        //--------------------------------------------------------//
        //print_r($tempTopCountries);
  
        $resPie['details'] = array(
            'count' => array(
                'unique_open' => sizeof($uniqueData[$openKey]),
                'bounced' => $c_data['bounceCount'],
                'spam' => $c_data['spamCount'],
                'not_opened' => $c_data['recipientsCount'] - sizeof($uniqueData[$openKey]) - $c_data['bounceCount'],
                'total_open' => sizeof($totalOpen),
            )
        );
        $resPie['campaign_details'] = $c_data;
        return $resPie;
    }//End function

    function getOpenClickUnsubscribeChartArrFull($campaign_report_data,$campaign_sent_data){
        
        global $infoArr;

        $graphArray = array();
        foreach($infoArr['labelIndex'] as $v){$graphArray[$v] = array();}
        $other = $infoArr['other'];

        $startDate = dateIncDecDays($campaign_sent_data,-1);
        $endDate = end($campaign_report_data);
        $endDate = $endDate['action_date'];
        //die('There is no data');
        if(!isset($endDate)){$endDate = $startDate;}//End if condition
        
        $xAxis = array();
        while(true){
            $startDate = dateIncDecDays($startDate);
            $xAxis[] = date("d M Y",strtotime($startDate));
            if(trim($startDate) == trim($endDate)){break;}//End if condition
        }//End while loop
        
        foreach($campaign_report_data as $value){
            $actionDate = date('d M Y',strtoTime($value['action_date']));
            foreach($xAxis as $xaValue){
                //echo $actionDate ."==". $xaValue;
                if($actionDate == $xaValue){
                    @$graphArray[$value['action']][$xaValue] = ($graphArray[$value['action']][$xaValue]+1);
                }else{
                    @$graphArray[$value['action']][$xaValue] = ($graphArray[$value['action']][$xaValue]+0);
                }//End if condition
            }//End foreach
        }//End foreach

        $res = array();
        $i = 0;
        foreach($graphArray as $key => $value){
            $res[$key]['name'] = $infoArr['name'][$i];
            $res[$key]['color'] = $infoArr['color'][$i];
            $res[$key]['lineWidth'] = $infoArr['lineWidth'][$i];
            foreach($value as $ke => $val){
                if($i == 0){$res['xAxis'][] = $ke;}//End if condition
                $res[$key]['data'][] = $val;
            }//End foreach
            $i++;
        }//End foreach
        $res['others'] = $other;
        //print_r($res);
        //print_r($graphArray);
        //print_r($xAxis);
        return $res;
    }//End function

    function get_campaign_report_data($col = '*',$campaign_id,$action = false){
        global $campaign_report_table;
        if($action){
            $sql = "SELECT $col FROM $campaign_report_table WHERE campaign_ref_id = '$campaign_id' AND action = '$action'";
        }else{
            $sql = "SELECT $col FROM $campaign_report_table WHERE campaign_ref_id = '$campaign_id'";
        }//End if condition
        $res = dbQuery($sql);
        return $res['data'];
    }//End function

    function unique_opened($campaign_id){
        global $subscribers_table;
        $res                  = get_campaign_report_data("email_ref_id",$campaign_id,'Opened');
        $unique_subscribers   = array_unique_multidimensional_by_key($res,'email_ref_id');
        $duplicate_count      = array_duplicate_count_by_key($res,'email_ref_id');
        
        $i = 1;
        $unique_list = array('status' => true);
        foreach($unique_subscribers as $key => $value){
            $subscriber_id = $value['email_ref_id'];
            $subscriber = dbQuery("SELECT full_name,email FROM $subscribers_table WHERE id = '$subscriber_id'");
            $data = $subscriber['data'][0];
            $data['count'] = $duplicate_count[$subscriber_id];
            $data['key'] = $i++;
            $unique_list['data']['list'][] = $data;
        }//End foreach
        $unique_list['data']['cols'] = array(
            setCol('Sr','key',15,true,false),
            setCol('Name','full_name',35,true,true),
            setCol('Email','email',35,true,true),
            setCol('Open Count','count',15,true,false)
        );
        $unique_list['data']['label'] = "Unique open";
        $unique_list['data']['desc'] = array_sum($duplicate_count)." total opens to date";
        $unique_list['data']['expandedRow'] = false;
        
        return $unique_list;
    }//End function

    function not_opened($campaign_id){
        global $subscribers_table;
        $opened_subscribers = get_campaign_report_data("email_ref_id",$campaign_id,'Opened');
        $opened_subscribers = multidimensional_array_to_single_array_by_key($opened_subscribers, 'email_ref_id');
        $list_ref_id        = get_campaign_data('list_ref_id',$campaign_id);
        $list_ref_id        = explode(",",$list_ref_id['list_ref_id']);
        $arr = array();
        $i = 1;
        foreach($list_ref_id as $list_id){
            $pdo_res = executePDO("SELECT id,email,full_name FROM $subscribers_table WHERE status = '1' AND list_ref_id LIKE '%$list_id%'");
            while($row = $pdo_res['data']->fetch()){
                #if it's id found in $opened_subscribers array then skip this (not include in new array)
                if(!in_array($row['id'],$opened_subscribers)){
                    //unset($row['id']);
                    $row['key'] = $i++;
                    $arr[] = $row;
                }//End if condition
            }//End while loop
        }//End foreach
        $res = array();
        $res['status'] = true;
        $res['data']['list'] = $arr;
        $res['data']['label'] = "Not Opened";
        $res['data']['desc'] = "Total ".sizeof($arr)." subscriber still not open.";
        $res['data']['expandedRow'] = false;
        $res['data']['cols'] = array(
            setCol('Sr','key',15,true,false),
            setCol('Name','full_name',40,true,true),
            setCol('Email','email',45,true,true)
        );
        return $res;
    }//End function

    function opened_all($campaign_id){
        global $subscribers_table;
        $subscribers = get_campaign_report_data("email_ref_id,action_date,action_time",$campaign_id,'Opened');
        $i = 1;
        foreach($subscribers as $key => $value){
            $subscriber_id = $value['email_ref_id'];
            $subscriberData = dbQuery("SELECT full_name,email FROM $subscribers_table WHERE id = '$subscriber_id'");
            $data = $subscriberData['data'][0];
            $value['full_name'] = $data['full_name'];
            $value['email'] = $data['email'];
            $value['dateTime'] = set_date($value['action_date'].' '.$value['action_time'],true,true);
            $value['key'] = $i++;
            unset($value['email_ref_id']);
            unset($value['action_date']);
            unset($value['action_time']);
            $subscribers[$key] = $value;
        }//End foreach
        $res = array();
        $res['status'] = true;
        $res['data']['list'] = $subscribers;
        $res['data']['label'] = "Opened All";
        $res['data']['desc'] = "Total ".sizeof($subscribers)." times opened so far";
        $res['data']['cols'] = array(
            setCol('Sr','key',10,true,false),
            setCol('Name','full_name',25,true,true),
            setCol('Email','email',35,true,true),
            setCol('Open date and time','dateTime',35,true,true)
        );
        $res['data']['expandedRow'] = false;
        return $res;
    }//End function

    function clicked_links($campaign_id){

        global $subscribers_table;
        global $campaign_report_table;
    
        $clicked_subscribers = get_campaign_report_data("email_ref_id",$campaign_id,'Clicked');
        $arr   = array_unique_multidimensional_by_key($clicked_subscribers,'email_ref_id');
        $i = 1;
        foreach($arr as $key => $value){
            $subscriber_id = $value['email_ref_id'];
            //Get name and email -------------------------------#
            $subscriberData = dbQuery("SELECT full_name,email FROM $subscribers_table WHERE id = '$subscriber_id'");
            $data = $subscriberData['data'][0];
            $value['full_name'] = $data['full_name'];
            $value['email'] = $data['email'];
            #---------------------------------------------------#
            //Get clicked links --------------------------------#
            $subscriberLink = dbQuery("SELECT click_url,action_date,action_time FROM $campaign_report_table WHERE email_ref_id = '$subscriber_id' AND action = 'Clicked'");
            $link   = array_unique_multidimensional_by_key($subscriberLink['data'],'click_url');
            $count = array_duplicate_count_by_key($subscriberLink['data'],'click_url');
            foreach($link as $inKey => $inValue){
                $inValue['count'] = $count[$inValue['click_url']];
                $inValue['dateTime'] = set_date($inValue['action_date'].','.$inValue['action_time'],true,true);
                unset($inValue['action_date']);
                unset($inValue['action_time']);
                $link[$inKey] = $inValue;
            }//End foreach
            $value['links'] = $link;
            #---------------------------------------------------#
            $value['key'] = $i++;
            unset($value['email_ref_id']);
            $arr[$key] = $value;
        }//End foreach
    
        $res = array();
        $res['status'] = true;
        $res['data']['list'] = $arr;
        $res['data']['label'] = "Clicked a link";
        $res['data']['desc'] = "Total ".sizeof($arr)." person clicked";
        $res['data']['cols'] = array(
            setCol('Sr','key',10,true,false),
            setCol('Name','full_name',40,true,true),
            setCol('Email','email',40,true,true)
        );
        $res['data']['expandedRow'] = true;
        return $res;
    }//End function

    function unsubscribed($campaign_id){
        global $subscribers_table;
        $unsubscribed_subscribers = get_campaign_report_data("email_ref_id,action_date,action_time",$campaign_id,'Unsubscribed');
        $i = 1;
        foreach($unsubscribed_subscribers as $key => $value){
            $subscriber_id = $value['email_ref_id'];
            $subscriberData = dbQuery("SELECT full_name,email FROM $subscribers_table WHERE id = '$subscriber_id'");
            $data = $subscriberData['data'][0];
            $value['full_name'] = $data['full_name'];
            $value['email'] = $data['email'];
            $value['dateTime'] = set_date($value['action_date'].' '.$value['action_time'],true,true);
            $value['key'] = $i++;
            unset($value['email_ref_id']);
            unset($value['action_date']);
            unset($value['action_time']);
            $unsubscribed_subscribers[$key] = $value;
        }//End foreach
        $res = array();
        $res['status'] = true;
        $res['data']['list'] = $unsubscribed_subscribers;
        $res['data']['label'] = "Unsubscribed";
        $res['data']['desc'] = "Total ".sizeof($unsubscribed_subscribers)." person unsubscribed";
        $res['data']['expandedRow'] = false;
        $res['data']['cols'] = array(
            setCol('Sr','key',10,true,false),
            setCol('Name','full_name',25,true,true),
            setCol('Email','email',35,true,true),
            setCol('Unsubscribe date and time','dateTime',30,true,true)
        );
        return $res;
    }//End function
    
    function unique_link_per_person($subscriber_id_arr){
        global $subscribers_table;
        $i = 1;
        $res = array();
        foreach($subscriber_id_arr as $value){
        $s_data = dbQuery("SELECT email,full_name FROM $subscribers_table WHERE id = '$value'");
        $s_data = $s_data['data'][0];
        $s_data['key'] = $i++;
        $res['data']['list'][] = $s_data;
        }//End foreach
        $res['data']['cols'] = array(
        setCol('Sr','key',15,true,false),
        setCol('Name','full_name',40,true,true),
        setCol('Email','email',45,true,true)
        );
        $res['data']['label'] = "Unique person clicked";
        $res['data']['desc'] = sizeof($subscriber_id_arr)." Unique person clicked";
        $res['status'] = true;
        return $res;
    }//End function


    function bounced($campaign_id){
        global $subscribers_table;
        $list_ref_id        = get_campaign_data('list_ref_id',$campaign_id);
        $list_ref_id        = explode(",",$list_ref_id['list_ref_id']);
        $arr = array();
        $i = 1;
        foreach($list_ref_id as $list_id){
            $pdo_res = executePDO("SELECT full_name,email FROM $subscribers_table WHERE status = '3' AND list_ref_id LIKE '%$list_id%' AND bounce_by_campaign LIKE '%$campaign_id%'");
            while($row = $pdo_res['data']->fetch()){
                //unset($row['id']);
                $row['key'] = $i++;
                $arr[] = $row;
            }//End while loop
        }//End foreach
        $res = array();
        $res['data']['list'] = $arr;
        $res['data']['cols'] = array(
            setCol('Sr','key',15,true,false),
            setCol('Name','full_name',40,true,true),
            setCol('Email','email',45,true,true)
        );
        $res['data']['label'] = "Bounced Emails";
        $res['data']['desc'] = sizeof($arr)." Emails has been bounced";
        $res['status'] = true;

        return $res;
    }//End function


    function spam($campaign_id){
        global $subscribers_table;
        $list_ref_id        = get_campaign_data('list_ref_id',$campaign_id);
        $list_ref_id        = explode(",",$list_ref_id['list_ref_id']);
        $arr = array();
        $i = 1;
        foreach($list_ref_id as $list_id){
            $pdo_res = executePDO("SELECT full_name,email FROM $subscribers_table WHERE status = '4' AND list_ref_id LIKE '%$list_id%' AND spam_by_campaign LIKE '%$campaign_id%'");
            while($row = $pdo_res['data']->fetch()){
                //unset($row['id']);
                $row['key'] = $i++;
                $arr[] = $row;
            }//End while loop
        }//End foreach
        $res = array();
        $res['data']['list'] = $arr;
        $res['data']['cols'] = array(
            setCol('Sr','key',15,true,false),
            setCol('Name','full_name',40,true,true),
            setCol('Email','email',45,true,true)
        );
        $res['data']['label'] = "Spam Emails";
        $res['data']['desc'] = sizeof($arr)." Emails has been spam";
        $res['status'] = true;

        return $res;
    }//End function



  #$emailArr - Specific array for bounce or spam (e.g. $bs['bounce'] or $bs['spam'])
  #$dbCount - Specific type of Email(s) count from db (e.g. $c_data['bounceCount'] or $c_data['spamCount'])
  #$keyword - (e.g. bounce or spam)
  #$listRefId - List ref id(s) from db
  function updateBounceOrSpamInDB($emailArr,$campaignId,$dbCount,$listRefId,$keyword){

    if(!(sizeof($emailArr) > 0)){return false;}
    global $subscribers_table;
    global $campaign_table;

    if($keyword === 'bounce'){
      $statusId = '3';
      $lColName = 'bounce_by_campaign';
      $cColName = 'bounceCount';
    }//End if condition

    if($keyword === 'spam'){
      $statusId = '4';
      $lColName = 'spam_by_campaign';
      $cColName = 'spamCount';
    }//End if condition

    //Update bounce in DB
    $emailCount = sizeof($emailArr);
    if($emailCount > 0){#if there is bounce email then update
        
        #if DB bounce count and Api bounce count are Equal the don't update because it's already updated in DB
        if(trim($dbCount) != $emailCount){
        $emailsDivideRate = 500;
        $sql_query = "UPDATE $subscribers_table SET status = $statusId, $lColName = '$campaignId' WHERE (";

        #Add List ref in query 'Where' ---------------------#
        $listRefId = explode(",",$listRefId);
        foreach($listRefId as $value){$sql_query .= "list_ref_id LIKE '%$value%' OR ";}//End foreach
        $sql_query = substr($sql_query,0,strlen($sql_query)-4).')';
        #----------------------------------------------------#

        $emailArr = array_chunk($emailArr,$emailsDivideRate);
        foreach($emailArr as $key => $emailArrVal){
            $query = $sql_query." AND (";
            foreach($emailArrVal as $emails){$query .= "email = '".$emails."' OR ";}//End foreach
            $query = substr($query,0,strlen($query)-4).")";
            dbQuery($query);
        }//End foreach
        
        //Update bounce count in db
        return dbQuery("UPDATE $campaign_table SET $cColName = '$emailCount' WHERE id = '$campaignId'");
        }//End if condition
    }//End if condition


    }//End function

?>