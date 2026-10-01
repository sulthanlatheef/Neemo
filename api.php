<?php

// require_once __DIR__ . "/vendor/autoload.php";

// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);

// $dotenv->load();

// if (empty($_ENV["NEEMO_BAT_FILE"])) {

//     http_response_code(500);

//     echo json_encode([
//         "status" => "error",
//         "message" => "Environment file was not loaded or NEEMO_BAT_FILE is missing."
//     ]);

//     exit;
// }

error_reporting(E_ALL);

ini_set('display_errors', 0);
ini_set('log_errors', 1);

header("Content-Type: application/json");
set_error_handler(function ($severity, $message, $file, $line) {

    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "message" => $message,
        "file" => basename($file),
        "line" => $line
    ]);

    exit;
});

$action = $_GET['action'] ?? '';

$fastapiBaseUrl = "http://host.docker.internal:5000/figmaimport";

$devControllerBaseUrl = "http://host.docker.internal:3001";

$neemoControllerBaseUrl = "http://host.docker.internal:5003";
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
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5
    ]);

    $response = curl_exec($ch);

    $curlError = curl_error($ch);
    $curlErrorNo = curl_errno($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($response === false) {

        http_response_code(500);

        return json_encode([
            "status" => "error",
            "message" => "Failed to contact server.",
            "url" => $url,
            "curl_error" => $curlError,
            "curl_error_code" => $curlErrorNo
        ]);
    }

    http_response_code($httpCode ?: 200);

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

    echo sendGetRequest(
        $neemoControllerBaseUrl . "/start"
    );

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
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 5
    ]);

    $response = curl_exec($ch);

    $curlError = curl_error($ch);
    $curlErrorNo = curl_errno($ch);

    $status = curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );

    curl_close($ch);


    // =====================================================
    // CURL CONNECTION ERROR
    // =====================================================

    if ($response === false) {

        http_response_code(502);

        return json_encode([
            "status" => "error",
            "message" => "Failed to connect to backend server.",
            "url" => $url,
            "curl_error" => $curlError,
            "curl_error_code" => $curlErrorNo
        ]);
    }


    // =====================================================
    // EMPTY BACKEND RESPONSE
    // =====================================================

    if ($response === "") {

        http_response_code(
            $status >= 400
                ? $status
                : 502
        );

        return json_encode([
            "status" => "error",
            "message" => "Backend returned an empty response.",
            "url" => $url,
            "http_status" => $status
        ]);
    }


    // =====================================================
    // BACKEND RETURNED ERROR
    // =====================================================

    if ($status >= 400) {

        http_response_code($status);

        return json_encode([
            "status" => "error",
            "message" => "Backend returned an error.",
            "backend_status" => $status,
            "backend_response" => $response,
            "url" => $url
        ]);
    }


    // =====================================================
    // SUCCESS
    // =====================================================

    return $response;
} 
/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

if ($action === 'health') {

    echo sendGetRequest(
        "http://host.docker.internal:5000/health"
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
    "http://host.docker.internal:3001/load_frames",
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
    "http://host.docker.internal:3001/generate_json",
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
        CURLOPT_URL => "http://host.docker.internal:3001/update-client",
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
| FETCH FIGMA JSON
|--------------------------------------------------------------------------
*/
$flaskBaseUrl = "http://host.docker.internal:3001";

if ($action === 'fetch_figma_json') {

    try {

        $input = json_decode(
            file_get_contents("php://input"),
            true
        );

        if (!is_array($input)) {

            http_response_code(400);

            echo json_encode([
                "status" => "error",
                "message" => "Invalid request body."
            ]);

            exit;
        }


        /*
        |--------------------------------------------------------------------------
        | GET INPUT
        |--------------------------------------------------------------------------
        */

        $mode = trim(
            $input["mode"] ?? "url"
        );

        $figmaUrl = trim(
            $input["figma_url"] ?? ""
        );

        $fileKey = trim(
            $input["file_key"] ?? ""
        );


        /*
        |--------------------------------------------------------------------------
        | FILE KEY MODE
        |--------------------------------------------------------------------------
        */

        if ($mode === "key") {

            if ($fileKey === "") {

                http_response_code(400);

                echo json_encode([
                    "status" => "error",
                    "message" => "Figma file key is required."
                ]);

                exit;
            }

        }


        /*
        |--------------------------------------------------------------------------
        | URL MODE
        |--------------------------------------------------------------------------
        */

        else {

            if ($figmaUrl === "") {

                http_response_code(400);

                echo json_encode([
                    "status" => "error",
                    "message" => "Figma URL is required."
                ]);

                exit;
            }


            /*
            |--------------------------------------------------------------------------
            | PARSE FIGMA URL
            |--------------------------------------------------------------------------
            */

            $parsedUrl = parse_url($figmaUrl);

            $host = strtolower(
                $parsedUrl["host"] ?? ""
            );

            $path = $parsedUrl["path"] ?? "";


            /*
            |--------------------------------------------------------------------------
            | VALIDATE FIGMA HOST
            |--------------------------------------------------------------------------
            */

            if (
                $host !== "figma.com" &&
                $host !== "www.figma.com"
            ) {

                http_response_code(400);

                echo json_encode([
                    "status" => "error",
                    "message" => "Please provide a valid Figma URL."
                ]);

                exit;
            }


            /*
            |--------------------------------------------------------------------------
            | EXTRACT FILE KEY
            |--------------------------------------------------------------------------
            |
            | Supports:
            |
            | /design/FILE_KEY/...
            | /file/FILE_KEY/...
            |
            */

            $pathParts = array_values(
                array_filter(
                    explode(
                        "/",
                        trim($path, "/")
                    )
                )
            );

            $fileKey = "";

            foreach ($pathParts as $index => $part) {

                if (
                    ($part === "design" || $part === "file")
                    &&
                    isset($pathParts[$index + 1])
                ) {

                    $fileKey =
                        trim(
                            $pathParts[$index + 1]
                        );

                    break;
                }
            }


            /*
            |--------------------------------------------------------------------------
            | FILE KEY NOT FOUND
            |--------------------------------------------------------------------------
            */

            if ($fileKey === "") {

                http_response_code(400);

                echo json_encode([
                    "status" => "error",
                    "message" =>
                        "Unable to extract Figma file key from the provided URL."
                ]);

                exit;
            }

        }


        /*
        |--------------------------------------------------------------------------
        | PHP → FLASK / NEMO ENGINE
        |--------------------------------------------------------------------------
        */

        echo postJsonRequest(
            $flaskBaseUrl . "/figma/file",
            [
                "file_key" => $fileKey
            ]
        );

        exit;


    } catch (Exception $e) {

        http_response_code(500);

        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);

        exit;
    }
}

/*
|--------------------------------------------------------------------------
| INVALID ACTION
|--------------------------------------------------------------------------
*/

echo json_encode([
    "error" => "Invalid action"
]);