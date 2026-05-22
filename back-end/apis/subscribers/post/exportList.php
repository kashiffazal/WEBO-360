<?php

    include "../../../others/config.php";

    $list_id =  encrypt_decrypt('decrypt',$_GET['id']);
    $list_name =  $_GET['list_name'];
    $exportIn = $_GET['exportIn'];


    $data = dbQuery("
        SELECT s.email,s.full_name,s.inserted_date,s.inserted_time,
        ss.status
        FROM $subscribers_table AS s
        LEFT JOIN $subscriber_status_table AS ss ON s.status = ss.id
        WHERE s.list_ref_id LIKE '%$list_id%' AND s.inserted_by = '$session_user_id'
    ");
    $data = $data['data'];
    //print_r($data);die();

    $header = "
    <table border='0' width='100%' style='font-size:12px'>
      <tr>
        <td width='40%'>" . $companyName . "</td>
        <td width='60%' style='text-align:right'>" . $list_name . "</td>
      </tr>
    </table>
    <hr style='margin:5px 0px;border: 0.5pt solid #ccc'/>
    
  ";

  $footer = "
  <hr style='margin:5px 0px;border: 0.5pt solid #ccc'/>
  <table border='0' width='100%' style='font-size:12'>
    <tr>
      <td width='40%'>" . set_date($server_date . $server_time, true, true) . "</td>
      <td width='60%' style='text-align:right'>Page {PAGENO} of {nbpg}</td>
    </tr>
  </table>
";

$html = '
  <html xmlns:x="urn:schemas-microsoft-com:office:excel">
  <head>
      <title>Reporting</title>
      <!--[if gte mso 9]>
      <xml>
          <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                      <x:Name>Student Data</x:Name>
                      <x:WorksheetOptions>
                          <x:Print>
                              <x:ValidPrinterInfo/>
                          </x:Print>
                      </x:WorksheetOptions>
                  </x:ExcelWorksheet>
              </x:ExcelWorksheets>
          </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        .list_table{
          font-size: 12px;
          border-left:1px solid #d8d8d8;
        }
        .list_table th{
          padding:6px 10px;
          border-top:1px solid #d8d8d8;
          // text-align:left;
          border-bottom: 1px solid #e2e2e2;
          border-right:1px solid #d8d8d8
        }
        .list_table td{
          padding:4px 10px;
          border-bottom: 1px solid #e2e2e2;
          border-right:1px solid #d8d8d8
        }
        .list_table tr:nth-child(even) {background: #f5f5f5}
        .list_table tr:nth-child(odd) {background: #FFF}
      </style>
    </head>';


$html .='
    <body style="font-family: \'Roboto\', sans-serif;">

    <div style="text-align:center">
        <p style="margin:0px">List Name</p>
        <h4 style="margin:0px;margin-bottom:10px">' . $list_name . '</h4>
    </div>
  
        <table width="100%" class="list_table" cellspacing="0px">
            <tr>
                <th width="31%">Email</th>
                <th width="25%">Full Name</th>
                <th width="14%">Status</th>
                <th width="30%">Date Time</th>
            </tr>';
        foreach ($data as $value) {
            $html .= '
                <tr>
                    <td>'.$value['email'].'</td>
                    <td>'.$value['full_name'].'</td>
                    <td>'.$value['status'].'</td>
                    <td>'.set_date(array('date' => $value['inserted_date'] . $value['inserted_time'], 'format' => 'F d, Y')).'</td>
                </tr>';
        } //End foreach

$html .= '
        </table>
    </body>
</html>';


    $filePath = '../../../uploaded_files/reports/' . $session_user_id;
    if($exportIn === 'excel'){
        $res = saveFile($list_name.'.xls',$html,$filePath);
    }else if($exportIn === 'csv'){
      $res = htmlTableToCSV($html,$list_name,$filePath);
    }else{
        ini_set("pcre.backtrack_limit", "5000000");
        require_once '../../../plugins/mpdf-8.0.5.0/vendor/autoload.php';
        $res = createPDF(
            $filePath,
            $list_name, //File Name
            $html,
            $header,
            $footer
        );
    }//End if condition
    $res['path'] = $domainPath . "/uploaded_files/reports/" . $session_user_id . "/" . $res['fileName'].'?us='.rand();
    echo json_encode($res);

?>