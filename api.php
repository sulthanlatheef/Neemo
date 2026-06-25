<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
require_once __DIR__ . '/vendor/autoload.php';

use WebSocket\Client;

const MINT_URL =
    "https://formsaiplugin.unysite.com/figmaimport/auth/token";

const MINT_SECRET =
    "Xm3K8_nUjqn1Z09HG0oFxQ1VTyAazITJh81t7ixlHDA";

const WS_URL =
    "ws://localhost:5000/figmaimport/convert/ws";

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
function getFreshToken()
{
    $ch = curl_init();

    curl_setopt_array($ch, [

        CURLOPT_URL => MINT_URL,

        CURLOPT_POST => true,

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_HTTPHEADER => [
            "X-Mint-Secret: " . MINT_SECRET,
            "Content-Type: application/json"
        ],

        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false

    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception(
            curl_error($ch)
        );
    }

    curl_close($ch);

    $data = json_decode(
        $response,
        true
    );

    $token =
        $data["access_token"]
        ?? $data["token"]
        ?? $data["jwt"]
        ?? null;

    if (!$token) {
        throw new Exception(
            "Token not found"
        );
    }

    return $token;
}

function createWebSocketClient()
{
    $token = getFreshToken();

    return new Client(
        WS_URL,
        [
            "timeout" => 300,
            "headers" => [
                "Authorization" => "Bearer {$token}"
            ]
        ]
    );
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

        $batFile = "C:\\wamp64\\www\\Neemo\\start_nemo.bat";

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
/*
|--------------------------------------------------------------------------
| LOAD FRAMES
|--------------------------------------------------------------------------
*/

if ($action === 'load_frames') {

    try {

        $input = json_decode(
            file_get_contents("php://input"),
            true
        );

        $figmaUrl =
            $input['figma_url'] ?? '';

        $client =
            createWebSocketClient();

        $client->send(
            json_encode([
                "type" => "submit_url",
                "request_id" => uniqid(),
                "figma_url" => $figmaUrl
            ])
        );

        while (true) {

            $message = json_decode(
                $client->receive(),
                true
            );

            $type =
                $message["type"] ?? "";

            if ($type === "ping") {

                $client->send(
                    json_encode([
                        "type" => "pong"
                    ])
                );

                continue;
            }

            if ($type === "error") {

                echo json_encode([
                    "status" => "error",
                    "message" =>
                        $message["message"]
                        ?? "Unknown error"
                ]);

                exit;
            }

            if ($type === "submit_url_response") {

                echo json_encode(
                    $message["result"]
                );

                exit;
            }
        }

    } catch (Throwable $e) {

        http_response_code(500);

        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }

    exit;
}
/*
|--------------------------------------------------------------------------
| GENERATE JSON
|--------------------------------------------------------------------------
*/

if ($action === 'generate_json') {

    set_time_limit(0);
    ini_set('max_execution_time', 0);

    try {

        $input = json_decode(
            file_get_contents("php://input"),
            true
        );

        $fileKey =
            $input['file_key'] ?? '';

        $frameName =
            $input['frame_name'] ?? '';

        $client =
            createWebSocketClient();

        $client->send(
            json_encode([
                "type" => "convert",
                "request_id" => uniqid(),
                "file_key" => $fileKey,
                "frame_name" => $frameName
            ])
        );

        while (true) {

            $message = json_decode(
                $client->receive(),
                true
            );

            $type =
                $message["type"] ?? "";

            if ($type === "ping") {

                $client->send(
                    json_encode([
                        "type" => "pong"
                    ])
                );

                continue;
            }

            if ($type === "error") {

                echo json_encode([
                    "status" => "error",
                    "message" =>
                        $message["message"]
                        ?? "Unknown error"
                ]);

                exit;
            }

            if ($type === "convert_response") {

                echo json_encode(
                    $message["result"],
                    JSON_UNESCAPED_UNICODE
                );

                exit;
            }
        }

    } catch (Throwable $e) {

        http_response_code(500);

        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }

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