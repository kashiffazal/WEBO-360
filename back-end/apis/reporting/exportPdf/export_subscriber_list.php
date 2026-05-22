<?php

$campaign_id = $_GET['id'];
$exportType = $_GET['exportType'];
$exportIn = $_GET['exportIn'];

//Allow POST just for 'uniquePersonClicked' keyword
if ($exportType === 'uniquePersonClicked') {
    $app_post_data = true;
} //End if condition

include "../../../others/config.php";
//include "../functions_chart.php";


//Getting campaign name
$campaign_data = get_campaign_data('campaign_name,sent_date,sent_time', $campaign_id);

if ($exportType === 'uniquePersonClicked') {
    $data = callAPI("POST", $domainPath . "/apis/reporting/subscriber_list/index.php?id=" . $campaign_id . "&keyword=" . $exportType . "&app_no_session=true&session_user_id=" . $session_user_id, $_POST, true);
} else {
    $data = callAPI("GET", $domainPath . "/apis/reporting/subscriber_list/index.php?id=" . $campaign_id . "&keyword=" . $exportType . "&app_no_session=true&session_user_id=" . $session_user_id, false, true);
} //End if condition
$data = $data['data'];

#Header ---------------------------------//
$header = "
    <table border='0' width='100%' style='font-size:12px'>
      <tr>
        <td width='40%'>" . $companyName . "</td>
        <td width='60%' style='text-align:right'>" . $data['label'] . "</td>
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

    <!--h4 style="margin:0px">' . $data['label'] . '</h4-->
    <table width="100%" style="font-size:12px">
      <tr>
        <td width="20%"><b>Campaign Name</b></td>
        <td width="80%">: &nbsp;&nbsp;&nbsp;' . $campaign_data['campaign_name'] . '</td>
      </tr>
      <tr>
        <td><b>Campaign Sent on</b></td>
        <td>: &nbsp;&nbsp;&nbsp;' . set_date(array('date' => $campaign_data['sent_date'] . $campaign_data['sent_time'], 'format' => 'F d, Y')) . '</td>
      </tr>
      <tr>
        <td><b>Report Name</b></td>
        <td>: &nbsp;&nbsp;&nbsp;' . $data['label'] . '</td>
      </tr>
    </table><br/>';
$html .= '
          <table width="100%" class="list_table" cellspacing="0px">
            <tr>';
foreach ($data['cols'] as $value) {
    $html .= '<th width="' . $value['width'] . '">' . $value['title'] . '</th>';
} //End foreach
$html .= '</tr>';
foreach ($data['list'] as $value) {
    $html .= '<tr>';
    foreach ($data['cols'] as $valueInner) {
        $html .= '<td>' . $value[$valueInner['dataIndex']] . '</td>';
    } //End foreach
    $html .= '</tr>';
} //End foreach
$html .= '</table>';
$html .= '</body></html>';

$filePath = '../../../uploaded_files/reports/' . $session_user_id;
if($exportIn === 'excel'){
  $res = saveFile($data['label'].'.xls',$html,$filePath);
}else if($exportIn === 'csv'){
  $res = htmlTableToCSV($html,$data['label'],$filePath);
}else{
  ini_set("pcre.backtrack_limit", "5000000");
  require_once '../../../plugins/mpdf-8.0.5.0/vendor/autoload.php';
  $res = createPDF(
    $filePath,
    $data['label'], //File Name
    $html,
    $header,
    $footer
  );
}//End if condition


$res['path'] = $domainPath . "/uploaded_files/reports/" . $session_user_id . "/" . $res['fileName'].'?us='.rand();

echo json_encode($res);
