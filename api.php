<?php

require_once __DIR__ . "/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);

$dotenv->load();

if (empty($_ENV["NEEMO_BAT_FILE"])) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => "Environment file was not loaded or NEEMO_BAT_FILE is missing."
    ]);

    exit;
}

error_reporting(E_ALL);

ini_set('display_errors', 1);

header("Content-Type: application/json");

$action = $_GET['action'] ?? '';

$fastapiBaseUrl = "http://127.0.0.1:5000/figmaimport";

$devControllerBaseUrl = "http://127.0.0.1:3001";

/*
|--------------------------------------------------------------------------
| HELPER FUNCTION
|--------------------------------------------------------------------------
*/

function sendGetRequest($url)
{
    $ch = curl_init();

    curl_setopt_array($ch, [

        CURLOPT_URL => $url,

        CURLOPT_RETURNTRANSFER => true

    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {

        return json_encode([
            "error" => curl_error($ch)
        ]);
    }

    return $response;
}

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

if ($action === 'start_server') {

    echo sendGetRequest(
        $devControllerBaseUrl . "/start"
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| STOP SERVER
|--------------------------------------------------------------------------
*/

if ($action === 'stop_server') {

    echo sendGetRequest(
        $devControllerBaseUrl . "/stop"
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| RESTART SERVER
|--------------------------------------------------------------------------
*/

if ($action === 'restart_server') {

    echo sendGetRequest(
        $devControllerBaseUrl . "/restart"
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| GET LOGS
|--------------------------------------------------------------------------
*/

if ($action === 'get_logs') {

    echo sendGetRequest(
        $devControllerBaseUrl . "/logs"
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| GET SERVER STATUS
|--------------------------------------------------------------------------
*/

if ($action === 'get_status') {

    echo sendGetRequest(
        $devControllerBaseUrl . "/status"
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| START NEMO CONTROLLER
|--------------------------------------------------------------------------
*/

if ($action === 'start_nemo') {

    try {

        $batFile = $_ENV["NEEMO_BAT_FILE"];

        $process = popen(
            'cmd /c start "" "' . $batFile . '"',
            'r'
        );

        if ($process === false) {
            throw new Exception("Failed to start Nemo.");
        }

        pclose($process);

        echo json_encode([
            "status" => "started"
        ]);

    } catch (Exception $e) {

        http_response_code(500);

        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }

    exit;
}
function postJsonRequest($url, $payload)
{
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 0
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }

    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($status >= 400) {
        throw new Exception($response);
    }

    return $response;
}
/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

if ($action === 'health') {

    echo sendGetRequest(
        "http://127.0.0.1:5000/health"
    );

    exit;
}
/*
|--------------------------------------------------------------------------
| LOAD FRAMES
|--------------------------------------------------------------------------
*/

if ($action === 'load_frames') {

   $input = json_decode(file_get_contents("php://input"), true);

echo postJsonRequest(
    "http://127.0.0.1:3001/load_frames",
    [
        "figma_url" => $input["figma_url"]
    ]
);

exit;
}
/*
|--------------------------------------------------------------------------
| GENERATE JSON
|--------------------------------------------------------------------------
*/

if ($action === 'generate_json') {

   $input = json_decode(file_get_contents("php://input"), true);

echo postJsonRequest(
    "http://127.0.0.1:3001/generate_json",
    [
        "file_key" => $input["file_key"],
        "frame_name" => $input["frame_name"]
    ]
);

exit;
}


if ($action === "update_nemo") {

    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => "http://127.0.0.1:3001/update-client",
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => false,

        // Maximum execution time: 2 minutes
        CURLOPT_TIMEOUT => 120
    ]);

    $response = curl_exec($ch);

    $curlError = curl_error($ch);
    $curlErrorNo = curl_errno($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);


    // ⏱ Timeout exceeded
    if ($curlErrorNo === CURLE_OPERATION_TIMEDOUT) {

        http_response_code(504);

        echo json_encode([
            "status" => "error",
            "message" => "Update request timeout exceeded.Please retry!"
        ]);

        exit;
    }


    // cURL itself failed
    if ($response === false) {

        http_response_code(500);

        echo json_encode([
            "status" => "error",
            "message" => "Failed to contact update server.",
            "curl_error" => $curlError
        ]);

        exit;
    }


    // Return Python's response regardless of HTTP status
    http_response_code($httpCode ?: 500);

    echo $response;

    exit;
}


/*
|--------------------------------------------------------------------------
| INVALID ACTION
|--------------------------------------------------------------------------
*/

echo json_encode([
    "error" => "Invalid action"
]);