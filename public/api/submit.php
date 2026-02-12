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

$mailOk = @mail($to, $subjectLine, $body, $headersStr, '-f' . $from);
if (!$mailOk) {
  $errorLog = $storageDir . '/mail-errors.log';
  $lastError = error_get_last();
  $message = $lastError && isset($lastError['message']) ? $lastError['message'] : 'mail() failed';
  @file_put_contents(
    $errorLog,
    '[' . $submittedAt . '] ' . $message . PHP_EOL,
    FILE_APPEND | LOCK_EX
  );
  json_response(500, ['error' => 'Submission saved, but email notification failed.']);
}

json_response(200, ['ok' => true]);
