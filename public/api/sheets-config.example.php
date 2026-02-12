<?php
// Copy this file to sheets-config.php and fill in real values.
// Place your service account JSON in public_html/storage/sheets-credentials.json
// and keep storage protected by .htaccess.

return [
  // Option A (simpler): Apps Script web app URL.
  // If set, it will be used instead of service account credentials.
  'apps_script_url' => 'PASTE_APPS_SCRIPT_URL_HERE',

  // Option B (service account):
  // 'sheet_id' => 'YOUR_SHEET_ID',
  // 'range' => 'Sheet1!A1',
  // 'credentials_path' => __DIR__ . '/../storage/sheets-credentials.json',
];
