<?php

    $app_post_data = true;
    include "../../../others/config.php";
    include "../functions_chart.php";
    require_once '../../../plugins/mpdf-8.0.5.0/vendor/autoload.php';

    $user_id    = $session_user_id;
    $lineChart  = $_POST['cLineChart'];
    $pieChart   = $_POST['cPieChart'];
    $campaignId = $_POST['id'];

    $data       = campaign_report($campaignId);
    
    $cd         = $data;
    $details    = $data['details']['count'];
    $cdd        = $data['campaign_details'];
    $links      = $data['popular_links'];

    #Header ---------------------------------//
    $header = "
        <div style='margin:0px -20px'>
            <table border='0' width='100%'>
                <tr>
                    <td width='60%'><h2 style='font-size:20px;margin:0px;color:#424242'>".$cdd['campaign_name']."</h2></td>
                    <td width='40%' style='font-size:12px;text-align:right;color:#424242'>Sent ".date('F d, Y', strtotime($cdd['sent_date']))." at ".$cdd['sent_time']."</td>
                </tr>
            </table>
            <hr style='margin:5px 0px;border: 0.5pt solid #ccc'/>
        </div>
    ";
    //---------------------------------------//


    //print_r($_POST['cLineChart']);
    //print_r($_POST['cPieChart']);
    //exit();
    
    //echo $clientPath."/css/reportingFrontEndBackEnd.css";
    //exit();

        
        $html_start = '
        <html>
        <head>
            <title>Reporting</title>
            <style>
            @page {
                margin-top: 1cm;
                margin-bottom: 1cm;
                margin-left: 1cm;
                margin-right: 1cm;
            }
            .titalBar{
                background:#666666;
                color:#fff;
                font-size:18px;
                padding:10px 10px
            }
            .lineChartLabel{
                text-align: right;
                font-size: 11px;
                color:#444;
                padding-top: 2px;
            }
            .pieLabel{
                font-size: 15px;
                padding-left: 5px;
                color: #3e3e3e;
            }
            .pieDesc{
                font-size: 12px;
                color: #7f7f7f;
                
            }
            .pieNumber{
                font-size: 16px;
                color: #3e3e3e;
            }

            .linkclickContainer{
                background: #f4f4f4;
                border: 1px solid #dddddd;
                border-radius: 5px;
                margin: 5px 0 20px;
                padding: 0px 0px;
            }
            .peopleClicked{
                font-size: 20px;
                font-weight: 900;
                text-align: center;
                padding: 0px 2px;
                margin-right: 10px;
                background: #ababab;
                color: #ffffff;
            }
            .linkLabel{
                font-size: 14px;
                color: #4a4a47;
                padding: 2px 0 1px;
                line-height: 18px;
                margin: 0px;
                font-weight: 500;
                // margin-top:3px;
            }
            .linkDesc{
                font-size: 11px;
                margin: 0px;
                color: #565656;
                
            }
            .linkBorder{
                border-bottom: 1px solid #dddddd;
            }
            </style>
        </head>
        <body style="font-family: \'Roboto\', sans-serif;">
        ';
        
        $html = '

            <br/><br/><br/>
            <table border="0" class="lineChartLabel" width="100%">
                <tr>
                    <td style="text-align:left">Sent to '.($cdd['recipientsCount']+$cdd['bounceCount']).' subscriber(s)</td>
                    <td width="50%">
                        <img src="./imgs/lc-open.jpg" width="8px" height="8px" alt=""/> &nbsp;Opens 
                        &nbsp;
                        &nbsp;
                        <img src="./imgs/lc-click.jpg" width="8px" height="8px" alt=""/> &nbsp;Link Clicks for first day
                    </td>
                </tr>
            </table>
            <img src="'.$lineChart.'" width="100%" alt=""/>
            <br/>
            <br/>
            <div class="titalBar">Campaign Overview</div>
            <br/>
            <table border="0" width="100%">
                <tr>
                    <td width="30%">
                        <img src="'.$pieChart.'" width="30%" alt=""/>
                    </td>
                    <td width="33.33%" valign="top">
                    
                        <div class="pieLabel">
                            <img src="./imgs/pi-open.jpg" width="10px" height="10px" alt=""/>
                            <b style="font-size:16px">&nbsp;'.$details['unique_open'].'</b> Unique open
                            <p class="pieDesc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$details['total_open'].' total opens to date</p>
                        </div>
                        <br/>
                        <div class="pieLabel">
                            <img src="./imgs/pi-bounce.jpg" width="10px" height="10px" alt=""/>
                            <b style="font-size:16px">&nbsp;'.$details['bounced'].'</b> Bounced
                            <p class="pieDesc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All emails appear to be delivered</p>
                        </div>
                        <br/>
                        <div class="pieLabel">
                            <img src="./imgs/pi-not-open.jpg" width="10px" height="10px" alt=""/>
                            <b style="font-size:16px">&nbsp;'.$details['not_opened'].'</b> Not Opened
                            <p class="pieDesc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Open rates are only estimates</p>
                        </div>
                    
                    </td>
                    <td width="36.66%" valign="top">
                    
                        <div class="pieLabel">
                            <p class="pieDesc"><b class="pieNumber">'.$cd['Opened']['unique_open'].'%</b> of all recipients opened so far</p>
                            <br/>
                            <p class="pieDesc"><b class="pieNumber">'.$cd['Clicked']['click_percent'].'%</b> clicked a link ('.$cd['Clicked']['click'].' person)</p>
                            <br/>
                            <p class="pieDesc"><b class="pieNumber">'.$cd['Unsubscribed']['unsubscribe_percent'].'%</b> unsubscribed ('.$cd['Unsubscribed']['unsubscribed'].' people)</p>
                        </div>

                    </td>
                </tr>
            </table>
            <br/>

            
            <div class="titalBar">Links Clicked</div>
            
            <table border="0" width="100%" class="linkclickContainer" style="margin-top:10px;margin-bottom:10px">
                <tr>
                    <td width="50%">
                        
                        <table width="100%" cellppadding="10" cellspacing="10">
                            <tbody>
                                <tr>
                                    <td nowrap="" style="padding-bottom:5px" class="peopleClicked">'.number_format($links['details']['person_clicked']).'</td>
                                    <td style="padding-bottom:10px" class="linkDesc linkBorder"><h2 class="linkLabel">person clicked</h2>Giving you a <strong>'.$links['details']['clicked_rate'].'%</strong> click rate.</td>
                                </tr>
                                <tr>
                                    <td nowrap="" style="padding-top:10px" class="peopleClicked">'.number_format($links['details']['avarage_clicks_per_person']).'</td>
                                    <td style="padding-top:5px" class="linkDesc"><h2 class="linkLabel">clicks per person</h2>Average of all those who clicked.</td>
                                </tr>
                            </tbody>
                        </table>
                    
                    </td>
                    <td width="50%">
                    
                        <table width="100%" cellppadding="10" cellspacing="10">
                            <tbody>
                                <tr>
                                    <td nowrap="" style="padding-bottom:5px" class="peopleClicked">'.number_format($links['details']['person_clicked']).'</td>
                                    <td style="padding-bottom:10px" class="linkDesc linkBorder"><h2 class="linkLabel">total clicks</h2>Made by '.$links['details']['clicks_made_by_total_person'].' person</td>
                                </tr>
                                <tr>
                                    <td nowrap="" style="padding-top:10px" class="peopleClicked">'.number_format($links['details']['not_clicked']).'</td>
                                    <td style="padding-bottom:5px" class="linkDesc"><h2 class="linkLabel">didn\'t click</h2>That\'s '.$links['details']['not_clicked_persent'].'% of all those who opened.</td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                </tr>
            </table>


            <table border="0" width="100%" style="font-size:10px">
                <tr style="background:#e3e3e3">
                    <td width="80%" style="padding:10px"><b>Link (URL)</b></td>
                    <th width="10%" style="padding:10px"><b>Unique</b></th>
                    <th width="10%" style="padding:10px"><b>Total</b></th>
                </tr>';

                foreach($links['link_list'] as $value){
                    $html .='
                        <tr>
                            <td style="padding-top:5px; padding-bottom:5px">
                                <a style="color:#3e3e3e;text-decoration:none" href="'.$value['link'].'" target="_blank">
                                    '.$value['link'].'
                                </a>
                            </td>
                            <td style="padding-top:5px; padding-bottom:5px" align="center"><b>'.$value['click_person_count'].'</b></td>
                            <td style="padding-top:5px; padding-bottom:5px" align="center">'.$value['clicks'].'</td>
                        </tr>
                    ';
                }//Emnd foreach


        $html .= '</table>';
        

        

        
        $html_end = '</body></html>';
            
        

        $html = $header.$html_start.$html.$html_end;
        //echo $html;
        //exit();



    //Creating PDF ====================================================================//
    $res = createPDF(
        '../../../uploaded_files/reports/'.$session_user_id,
        'campaign_report',//File Name
        $html,
        $header
    );
    $res['path'] = $domainPath."/uploaded_files/reports/".$session_user_id."/".$res['fileName'];

    echo json_encode($res);
    
?>