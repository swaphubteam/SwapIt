<?php
// Direct test for Google config
require_once '../../back_end/api/google-oauth.php';

header('Content-Type: application/json');
echo json_encode(getGoogleConfig());
?>
