<?php
$exportIn = $_GET['exportIn'];
include "./index.php";

//print_r($arr);die();
#Header ---------------------------------//
$header = "
    <table border='0' width='100%' style='font-size:12px'>
    <tr>
        <td width='40%'>" . $companyName . "</td>
        <td width='60%' style='text-align:right'>Campaign : " . $data['campaign_name'] . "</td>
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
</head>
<body style="font-family: \'Roboto\', sans-serif;">
';
$html .= '
    <table width="100%" style="font-size:12px">
      <tr>
        <td colspan="4">' . $data['tableLabel'] . '</td>
      </tr>
      <tr>
        <td colspan="4">' . $data['tableDesc1'] . '<br/>' . $data['tableDesc2'] . '</td>
      </tr>
    </table><br/>
        <table width="100%" class="list_table" cellspacing="0px">
        <tr>
            <th>Sr</th>
            <th>Email</th>
            <th>Full name</th>';
            if (@$arr[0]['list_name']) {$html .= '<th>List Name</th>';}
            if (@$arr[0]['campaign_name']) {$html .= '<th>Campaign Name</th>';}
            if (@$arr[0]['server_name']) {$html .= '<th>ESPS Server</th>';}
            if (@$arr[0]['account_name']) {$html .= '<th>ESPS Account</th>';}
            if (@$arr[0]['action']) {$html .= '<th>Action</th>';}
        $html .= '
            <th>Action Date Time</th>
        </tr>';
$i = 1;
foreach ($arr as $value) {
    $acDateTime = $value['action_date'] !== '-' ? explode(',', $value['action_date']) : null;
    $html .= '<tr>';
    $html .= '<td>' . $i . '</td>';
    $html .= '<td>' . $value['email'] . '</td>';
    $html .= '<td>' . $value['full_name'] . '</td>';
    $html .= @$value['list_name'] ? '<td>' . $value['list_name'] . '</td>' : '';
    $html .= @$value['campaign_name'] ? '<td>' . $value['campaign_name'] . '</td>' : '';
    $html .= @$value['server_name'] ? '<td>' . $value['server_name'] . '</td>' : '';
    $html .= @$value['account_name'] ? '<td>' . $value['account_name'] . '</td>' : '';
    $html .= @$value['action'] ? '<td>' . $value['action'] . '</td>' : '';
    $html .= $acDateTime ? '<td>' . date('M jS Y', strtotime($acDateTime[0])) . ', ' . $acDateTime[1] . '</td>' : '<td></td>';
    $html .= '</tr>';
    $i++;
} //End foreach
$html .= '</table></body></html>';

$filePath = '../../../uploaded_files/reports/' . $session_user_id;
if ($exportIn === 'excel') {
    $res = saveFile('reports' . $session_user_id . '.xls', $html,$filePath);
}else if($exportIn === 'csv'){
    $res = htmlTableToCSV($html,'reports' . $session_user_id,$filePath);
} else {
    ini_set("pcre.backtrack_limit", "50000000");
    require_once '../../../plugins/mpdf-8.0.5.0/vendor/autoload.php';
    $res = createPDF(
        $filePath,
        'report' . $session_user_id, //File Name
        $html,
        $header,
        $footer
    );
} //End if condition
$res['path'] = $domainPath . "/uploaded_files/reports/" . $session_user_id . "/" . $res['fileName'].'?us='.rand();
echo json_encode($res);
