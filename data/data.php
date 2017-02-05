<?php

$filename = 'data.log';

if (isset($_POST['data'])) {
  $data = str_replace("\n", '', $_POST['data']);
  file_put_contents($filename, date('c') . ' ' . $data . "\n", FILE_APPEND);
} else {
  $res = shell_exec('tail -n1 ' . $filename);

  $index = strpos($res, ' ');
  $timestamp = strtotime(substr($res, 0, $index));
  $data = substr($res, $index + 1);

  $age = time() - $timestamp;
  if ($age > 60) {
    http_response_code(404);
    exit('Last record older than ' . $age . ' seconds');
  }

  echo $data;
}

?>
