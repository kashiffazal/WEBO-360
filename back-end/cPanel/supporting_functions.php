<?php
  function set_cronjob_date_format($strDateTime,$incressDate = false,$decressDate = false){
    parse_str($strDateTime,$d);
    $seconds = get_timezone_difference($d['time']['timeZone']);
    $d = add_seconds_into_selected_datetime($d,$seconds,$incressDate,$decressDate);

    $year = $d['date']['year'];
    $month = (int )$d['date']['month'];
    $day = (int) $d['date']['day'];
    $hour = (int) $d['time']['hour'];
    $min = (int) $d['time']['min'];
    $timezone = $d['time']['timeZone'];
    $ampm = $d['time']['ampm'];

    if(($ampm == 'pm' OR $ampm == 'PM') && $hour !== 12){$hour = $hour + 12;}
    if(($ampm == 'am' OR $ampm == 'AM') && $hour == 12){$hour = 0;}

    $weekDay = date("w", strtotime($year."-".$month."-".$day));
    if($weekDay == '0'){$weekDay = 7;}

    $res = array(
      'day'            => $day,
      'hour'           => $hour,
      'minute'         => $min,
      'month'          => $month,
      'weekday'        => $weekDay,
      'timezone'       => $timezone
    );
    return $res;
  }//End function

  function get_timezone_difference($timezone){
    //$server_tz = date_default_timezone_get();
    $server_tz = 'UTC';
    $server_tz = new DateTimeZone($server_tz);
    $server_time = new DateTime('now', $server_tz);
    
    $selected_tz = new DateTimeZone($timezone);
    $selected_time = new DateTime('now', $selected_tz);
    
    $server_offset = $server_time->getOffset();
    $selected_offset = $selected_time->getOffset();

    // Calculating the seconds between the timezones    
    $seconds = $selected_offset - $server_offset;
    return $seconds;
  }//End function

  function add_seconds_into_selected_datetime($datetime,$seconds,$incressDate = false,$decressDate = false){
    $year = $datetime['date']['year'];
    $month = $datetime['date']['month'];
    $day = $datetime['date']['day'];
    $hour = $datetime['time']['hour'];
    $min = $datetime['time']['min'];
    $timezone = $datetime['time']['timeZone'];
    $ampm = $datetime['time']['ampm'];

    $seconds = (($seconds < 0) ? '+' : '-').$seconds.'seconds';
    
    $date = "$year-$month-$day $hour:$min $ampm";    
    if($incressDate){$date = strtotime('+'.$incressDate.' hour',strtotime($date));}//End if condition
    if($decressDate){$date = strtotime('-'.$decressDate.' hour',strtotime($date));}//End if condition
    if(!$incressDate AND !$decressDate){$date = strtotime($date);}//End if condition
    $strTime = strtotime($seconds,$date);

    //echo date('d-m-Y h:i A',$strTime);
    $datetime['date']['year'] = date('Y',$strTime);
    $datetime['date']['month'] = date('m',$strTime);
    $datetime['date']['day'] = date('d',$strTime);
    $datetime['time']['hour'] = date('h',$strTime);
    $datetime['time']['min'] = date('i',$strTime);
    $datetime['time']['ampm'] = date('A',$strTime);

    return $datetime;

  }//End function

?>