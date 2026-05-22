<?php
  //Update bounce in DB
  $bsEmails = $bs['bounce'];
  $apiBounceCount = sizeof($bs['bounce']);
  if($apiBounceCount > 0){#if there is bounce email then update
    #if DB bounce count and Api bounce count are Equal the don't update because it's already updated in DB
    if(trim($c_data['bounceCount']) != $apiBounceCount){
      $query_split_count = 4;
      $emails_divide_rate = 500;
      $sql_query = "UPDATE $subscribers_table SET status = '3', bounce_by_campaign = '$campaign_id' WHERE (";

      #Add List ref in query 'Where' ---------------------#
      $list_ref_id = $c_data['list_ref_id'];
      $list_ref_id = explode(",",$list_ref_id);
      foreach($list_ref_id as $value){$sql_query .= "list_ref_id LIKE '%$value%' OR ";}//End foreach
      $sql_query = substr($sql_query,0,strlen($sql_query)-4).')';
      #----------------------------------------------------#

      #if API bounce count is greater then 1000 the split query;
      if($apiBounceCount > $emails_divide_rate){
        $divide_count = ceil($apiBounceCount / $query_split_count);
        $bsEmails = array_chunk($bsEmails,$divide_count);
        //print_r($bsEmails);
        $query_arr = array();
        foreach($bsEmails as $key => $emailArr){
          @$query_arr[$key] = $sql_query." AND (";
          foreach($emailArr as $emails){
            @$query_arr[$key] .= "email = '".$emails."' OR ";
          }//End foreach
          @$query_arr[$key] = substr(@$query_arr[$key],0,strlen(@$query_arr[$key])-4).")";
          dbQuery(@$query_arr[$key]);
        }//End foreach
      }else{
        $sql_query .=" AND (";
        foreach($bsEmails as $key => $email){$sql_query .= "email = '".$email."' OR ";}//End foreach
        $sql_query = substr($sql_query,0,strlen($sql_query)-4).")";
        dbQuery($sql_query);
      }//End if condition
      //Update bounce count in db
      dbQuery("UPDATE $campaign_table SET bounceCount = '$apiBounceCount' WHERE id = '$campaign_id'");
      //echo $sql_query;
      //print_r($query_arr);
    }//End if condition
  }//End if condition
?>