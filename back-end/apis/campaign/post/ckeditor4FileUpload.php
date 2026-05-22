<?php
    error_reporting(0);
    $app_post_data = true;
    include "../../../others/config.php";

  
    
    if(isset($_FILES['upload']['name']))
    {
     $file = $_FILES['upload']['tmp_name'];
     $file_name = $_FILES['upload']['name'];
     $file_name_array = explode(".", $file_name);
     $extension = end($file_name_array);
     $new_image_name = rand() . '.' . $extension;
     chmod('../../../uploaded_files/t-i', 0777);
     $allowed_extension = array("jpg", "gif", "png");
     if(in_array($extension, $allowed_extension))
     {
      move_uploaded_file($file, '../../../uploaded_files/t-i/'.$new_image_name);
      $function_number = $_GET['CKEditorFuncNum'];
      $url = $domainPath.'/uploaded_files/t-i/' . $new_image_name;
      $message = '';
      echo '<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction('.$function_number.', "'.$url.'", "'.$message.'");</script>';
     }
    }



?>