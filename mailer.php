<?php
  if(isset($_POST['inputName'])){
    $fName = $_POST['inputName'];
  } else {
    $fName = "[field was left empty]";
  }

  if(isset($_POST['inputEmail'])){
    $fEmail = $_POST['inputEmail'];
  } else {
    $fEmail = "[field was left empty]";
  }

  if(isset($_POST['inputTel'])){
    $fTel = $_POST['inputTel'];
  } else {
    $fTel = "[field was left empty]";
  }

  if(isset($_POST['inputMessage'])){
    $fMessage = $_POST['inputMessage'];
  } else {
    $fMessage = "[field was left empty]";
  }

//create email message
  $message = "NAME: "     . $fName    . "\n
              EMAIL: "    . $fEmail   . "\n
              TELEPHONE: ". $fTel     . "\n
              MESSAGE: \n". $fMessage;
  $to      = 'sean.fried@gmail.com';
  $subject = 'Sean Fried Dev Site Form Submition | ' . $fName . ' - ' . $fEmail;
  $headers = 'From: ' . $fEmail . "\r\n" .
      'Reply-To: ' . $fEmail . "\r\n" .
      'X-Mailer: PHP/' . phpversion();

  if(mail($to, $subject, $message, $headers)){
      echo "{success: true}";
  } else {
      echo "{success: false";
  }
?>