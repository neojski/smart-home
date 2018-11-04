<?php

$filename = 'data.log';

if (isset($_POST['data'])) {
  $data = str_replace("\n", '', $_POST['data']);
  file_put_contents($filename, $data . "\n", FILE_APPEND);
} else {
  echo shell_exec('tail -n1 ' . $filename);
}

?>
