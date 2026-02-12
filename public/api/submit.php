<?php
// Simple form handler for VUKA Travels.
// Accepts JSON POST and logs to CSV + Excel-compatible XLS.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function json_response(int $status, array $payload): void {
  http_response_code($status);
  echo json_encode($payload);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  json_response(405, ['error' => 'Method not allowed']);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
  $data = $_POST;
}

if (!is_array($data)) {
  json_response(400, ['error' => 'Invalid payload']);
}

if (!empty($data['website'])) {
  // Honeypot field filled. Pretend success.
  json_response(200, ['ok' => true]);
}

function clean_value($value): string {
  if (is_array($value) || is_object($value)) {
    $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  }
  $value = is_string($value) ? $value : (string)$value;
  $value = trim($value);
  $value = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value);
  if ($value === null) {
    $value = '';
  }
  if (strlen($value) > 4000) {
    $value = substr($value, 0, 4000);
  }
  return $value;
}

function pick_value(array $data, array $keys): string {
  foreach ($keys as $key) {
    if (array_key_exists($key, $data) && $data[$key] !== '') {
      return clean_value($data[$key]);
    }
  }
  return '';
}

$formType = pick_value($data, ['formType', 'form_type']);
if ($formType === '') {
  json_response(400, ['error' => 'Missing form type']);
}

$name = pick_value($data, ['name', 'fullName', 'full_name']);
$email = pick_value($data, ['email']);
$phone = pick_value($data, ['phone']);
$subject = pick_value($data, ['subject']);
$message = pick_value($data, ['message']);
$destination = pick_value($data, ['destination']);
$from = pick_value($data, ['from']);
$to = pick_value($data, ['to']);
$departureDate = pick_value($data, ['departureDate', 'departure_date']);
$returnDate = pick_value($data, ['returnDate', 'return_date']);
$passengers = pick_value($data, ['passengers']);
$cabinClass = pick_value($data, ['cabinClass', 'cabin_class']);
$tripType = pick_value($data, ['tripType', 'trip_type']);
$pageUrl = pick_value($data, ['pageUrl', 'page_url']);

$requiredByType = [
  'contact' => ['name', 'email', 'subject', 'message'],
  'home_contact' => ['name', 'email', 'message'],
  'sidebar_contact' => ['name', 'email', 'message'],
  'hero_flight_search' => ['name', 'email', 'from', 'to', 'departure_date'],
  'sidebar_flight_search' => ['name', 'email', 'from', 'to', 'departure_date'],
];

$required = $requiredByType[$formType] ?? ['email'];
$missing = [];
foreach ($required as $field) {
  switch ($field) {
    case 'name':
      if ($name === '') $missing[] = 'name';
      break;
    case 'email':
      if ($email === '') $missing[] = 'email';
      break;
    case 'subject':
      if ($subject === '') $missing[] = 'subject';
      break;
    case 'message':
      if ($message === '') $missing[] = 'message';
      break;
    case 'from':
      if ($from === '') $missing[] = 'from';
      break;
    case 'to':
      if ($to === '') $missing[] = 'to';
      break;
    case 'departure_date':
      if ($departureDate === '') $missing[] = 'departureDate';
      break;
  }
}

if (!empty($missing)) {
  json_response(400, ['error' => 'Missing required fields: ' . implode(', ', $missing)]);
}

$submittedAt = gmdate('Y-m-d H:i:s');
$ip = clean_value($_SERVER['REMOTE_ADDR'] ?? '');
$userAgent = clean_value($_SERVER['HTTP_USER_AGENT'] ?? '');

$fields = [
  'submitted_at' => $submittedAt,
  'form_type' => $formType,
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'subject' => $subject,
  'message' => $message,
  'destination' => $destination,
  'from' => $from,
  'to' => $to,
  'departure_date' => $departureDate,
  'return_date' => $returnDate,
  'passengers' => $passengers,
  'cabin_class' => $cabinClass,
  'trip_type' => $tripType,
  'page_url' => $pageUrl,
  'ip' => $ip,
  'user_agent' => $userAgent,
];

$storageDir = __DIR__ . '/../storage';
if (!is_dir($storageDir)) {
  @mkdir($storageDir, 0755, true);
}

function log_mail_error(string $message): void {
  $storageDir = __DIR__ . '/../storage';
  $errorLog = $storageDir . '/mail-errors.log';
  @file_put_contents(
    $errorLog,
    '[' . gmdate('Y-m-d H:i:s') . '] ' . $message . PHP_EOL,
    FILE_APPEND | LOCK_EX
  );
}

function log_sheets_error(string $message): void {
  $storageDir = __DIR__ . '/../storage';
  $errorLog = $storageDir . '/sheets-errors.log';
  @file_put_contents(
    $errorLog,
    '[' . gmdate('Y-m-d H:i:s') . '] ' . $message . PHP_EOL,
    FILE_APPEND | LOCK_EX
  );
}

function respond_and_continue(array $payload): void {
  http_response_code(200);
  $body = json_encode($payload);
  echo $body;

  if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
    return;
  }

  if (function_exists('apache_setenv')) {
    @apache_setenv('no-gzip', '1');
  }
  @ini_set('zlib.output_compression', '0');
  @ini_set('output_buffering', '0');
  header('Content-Length: ' . strlen($body));
  @ob_end_flush();
  flush();
}

$csvPath = $storageDir . '/submissions.csv';
$csvHandle = @fopen($csvPath, 'a');
if (!$csvHandle) {
  json_response(500, ['error' => 'Unable to write submissions log']);
}

flock($csvHandle, LOCK_EX);
if (filesize($csvPath) === 0) {
  fputcsv($csvHandle, array_keys($fields));
}
fputcsv($csvHandle, array_values($fields));
flock($csvHandle, LOCK_UN);
fclose($csvHandle);

// Generate an Excel-compatible .xls file from the CSV log.
$xlsPath = $storageDir . '/submissions.xls';
$csvRead = @fopen($csvPath, 'r');
if ($csvRead) {
  $rows = [];
  while (($row = fgetcsv($csvRead)) !== false) {
    $rows[] = $row;
  }
  fclose($csvRead);

  $html = "<html><head><meta charset=\"UTF-8\"></head><body><table border=\"1\">";
  foreach ($rows as $rowIndex => $row) {
    $html .= '<tr>';
    foreach ($row as $cell) {
      $tag = $rowIndex === 0 ? 'th' : 'td';
      $html .= '<' . $tag . '>' . htmlspecialchars((string)$cell, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</' . $tag . '>';
    }
    $html .= '</tr>';
  }
  $html .= '</table></body></html>';
  @file_put_contents($xlsPath, $html, LOCK_EX);
}

$to = 'info@vukatravels.co.uk';
$from = 'info@vukatravels.co.uk';
$replyTo = $email !== '' ? $email : $from;
$subjectLine = '[Website] ' . ucwords(str_replace('_', ' ', $formType)) . ' submission';

$bodyLines = [];
foreach ($fields as $key => $value) {
  if ($value === '') {
    continue;
  }
  $label = ucwords(str_replace('_', ' ', $key));
  $bodyLines[] = $label . ': ' . $value;
}
$body = implode("\n", $bodyLines);

$headers = [];
$headers[] = 'From: ' . $from;
$headers[] = 'Reply-To: ' . $replyTo;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headersStr = implode("\r\n", $headers);

function smtp_read($socket): string {
  $data = '';
  while ($line = fgets($socket, 515)) {
    $data .= $line;
    if (preg_match('/^\d{3} /', $line)) {
      break;
    }
  }
  return $data;
}

function smtp_command($socket, string $command, array $expectCodes): string {
  if ($command !== '') {
    fwrite($socket, $command . "\r\n");
  }
  $response = smtp_read($socket);
  $code = (int)substr($response, 0, 3);
  if (!in_array($code, $expectCodes, true)) {
    throw new RuntimeException('SMTP error (' . $command . '): ' . trim($response));
  }
  return $response;
}

function smtp_send(array $config, string $to, string $from, string $replyTo, string $subject, string $body): void {
  $host = $config['host'] ?? '';
  $port = (int)($config['port'] ?? 465);
  $secure = $config['secure'] ?? 'ssl';
  $username = $config['username'] ?? '';
  $password = $config['password'] ?? '';

  if ($host === '' || $username === '' || $password === '') {
    throw new RuntimeException('SMTP config is incomplete');
  }

  $remote = $secure === 'ssl' ? "ssl://{$host}:{$port}" : "{$host}:{$port}";
  $socket = stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT);
  if (!$socket) {
    throw new RuntimeException('SMTP connect failed: ' . $errstr . ' (' . $errno . ')');
  }
  stream_set_timeout($socket, 30);

  smtp_read($socket);
  smtp_command($socket, 'EHLO vukatravels.co.uk', [250]);

  if ($secure === 'tls') {
    smtp_command($socket, 'STARTTLS', [220]);
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      throw new RuntimeException('Failed to start TLS');
    }
    smtp_command($socket, 'EHLO vukatravels.co.uk', [250]);
  }

  smtp_command($socket, 'AUTH LOGIN', [334]);
  smtp_command($socket, base64_encode($username), [334]);
  smtp_command($socket, base64_encode($password), [235]);

  smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250]);
  smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
  smtp_command($socket, 'DATA', [354]);

  $headers = [
    'From: ' . $from,
    'Reply-To: ' . $replyTo,
    'To: ' . $to,
    'Subject: ' . $subject,
    'Date: ' . date('r'),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
  ];
  $message = implode("\r\n", $headers) . "\r\n\r\n" . $body;
  $message = str_replace("\r\n.", "\r\n..", str_replace("\n", "\r\n", $message));

  fwrite($socket, $message . "\r\n.\r\n");
  smtp_read($socket);
  smtp_command($socket, 'QUIT', [221, 250]);
  fclose($socket);
}

$configFile = __DIR__ . '/mail-config.php';
$smtpConfig = null;
if (is_file($configFile)) {
  $loaded = include $configFile;
  if (is_array($loaded)) {
    $smtpConfig = $loaded;
  }
}

if ($smtpConfig && isset($smtpConfig['to'])) {
  $to = $smtpConfig['to'];
}
if ($smtpConfig && isset($smtpConfig['from'])) {
  $from = $smtpConfig['from'];
}

// Respond immediately after local logging to avoid delays.
respond_and_continue(['ok' => true]);

ignore_user_abort(true);
set_time_limit(30);

// Send email notification in background.
try {
  if ($smtpConfig) {
    smtp_send($smtpConfig, $to, $from, $replyTo, $subjectLine, $body);
  } else {
    $mailOk = @mail($to, $subjectLine, $body, $headersStr, '-f' . $from);
    if (!$mailOk) {
      $lastError = error_get_last();
      $message = $lastError && isset($lastError['message']) ? $lastError['message'] : 'mail() failed';
      throw new RuntimeException($message);
    }
  }
} catch (Throwable $error) {
  log_mail_error($error instanceof Throwable ? $error->getMessage() : 'mail failed');
}

function base64url_encode(string $data): string {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function get_sheets_config(): ?array {
  $configFile = __DIR__ . '/sheets-config.php';
  if (!is_file($configFile)) {
    return null;
  }
  $config = include $configFile;
  if (!is_array($config)) {
    return null;
  }
  if (!empty($config['apps_script_url'])) {
    return $config;
  }
  if (empty($config['sheet_id']) || empty($config['credentials_path'])) {
    return null;
  }
  return $config;
}

function google_access_token(array $creds): string {
  $now = time();
  $header = base64url_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
  $claims = [
    'iss' => $creds['client_email'],
    'scope' => 'https://www.googleapis.com/auth/spreadsheets',
    'aud' => $creds['token_uri'],
    'iat' => $now,
    'exp' => $now + 3600,
  ];
  $payload = base64url_encode(json_encode($claims));
  $signatureInput = $header . '.' . $payload;
  $signature = '';
  $privateKey = $creds['private_key'];
  if (!openssl_sign($signatureInput, $signature, $privateKey, 'SHA256')) {
    throw new RuntimeException('Unable to sign JWT');
  }
  $jwt = $signatureInput . '.' . base64url_encode($signature);

  $postData = http_build_query([
    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'assertion' => $jwt,
  ]);

  $ch = curl_init($creds['token_uri']);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
  $response = curl_exec($ch);
  if ($response === false) {
    throw new RuntimeException('Token request failed: ' . curl_error($ch));
  }
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($status >= 300) {
    throw new RuntimeException('Token request error: ' . $response);
  }
  $data = json_decode($response, true);
  if (!is_array($data) || empty($data['access_token'])) {
    throw new RuntimeException('Invalid token response');
  }
  return $data['access_token'];
}

function append_to_sheet(array $config, array $fields): void {
  if (!empty($config['apps_script_url'])) {
    $payload = json_encode([
      'values' => [array_values($fields)],
    ]);
    $ch = curl_init($config['apps_script_url']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    $response = curl_exec($ch);
    if ($response === false) {
      throw new RuntimeException('Apps Script append failed: ' . curl_error($ch));
    }
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status >= 300) {
      throw new RuntimeException('Apps Script error: ' . $response);
    }
    return;
  }

  $credsPath = $config['credentials_path'];
  if (!is_file($credsPath)) {
    throw new RuntimeException('Sheets credentials not found');
  }
  $creds = json_decode(file_get_contents($credsPath), true);
  if (!is_array($creds)) {
    throw new RuntimeException('Invalid sheets credentials JSON');
  }
  $token = google_access_token($creds);
  $sheetId = $config['sheet_id'];
  $range = $config['range'] ?? 'Sheet1!A1';

  $values = array_values($fields);
  $payload = json_encode([
    'values' => [$values],
  ]);

  $url = 'https://sheets.googleapis.com/v4/spreadsheets/' . urlencode($sheetId) .
    '/values/' . urlencode($range) . ':append?valueInputOption=USER_ENTERED';

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
  $response = curl_exec($ch);
  if ($response === false) {
    throw new RuntimeException('Sheets append failed: ' . curl_error($ch));
  }
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($status >= 300) {
    throw new RuntimeException('Sheets append error: ' . $response);
  }
}

// Append to Google Sheets in background if configured.
try {
  $sheetsConfig = get_sheets_config();
  if ($sheetsConfig) {
    append_to_sheet($sheetsConfig, $fields);
  }
} catch (Throwable $error) {
  log_sheets_error($error instanceof Throwable ? $error->getMessage() : 'sheets failed');
}

exit;
