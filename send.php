<?php 
$to = $_REQUEST['to']; 
$from = $_REQUEST['from']; 
$message = $_REQUEST['content']; 
$subject = $_REQUEST['name'] . $_REQUEST['subject']; 
$header = "From: <".$from.">" ."\r\n"; 
$send = @mail($to, $subject, $message, $header);
if(!$send){ die(); } 
?>