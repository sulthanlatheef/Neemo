<?php

require_once __DIR__ . '/vendor/autoload.php';

use WebSocket\Client;

const MINT_URL =
    "https://formsaiplugin.unysite.com/figmaimport/auth/token";

const MINT_SECRET =
    "Xm3K8_nUjqn1Z09HG0oFxQ1VTyAazITJh81t7ixlHDA";

const WS_URL =
    "ws://localhost:5000/figmaimport/convert/ws";

const FIGMA_URL =
    "https://www.figma.com/design/FjAHtSa3bbEQD5lgttD7pM/NextGen-Forms-Demo-3?node-id=0-1&p=f&viewport=272%2C389%2C0.13&t=vn9j6KvCkq9fTOtn-0";

function getFreshToken()
{
    echo "🔄 Requesting token...\n";

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

    $httpCode = curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );

    curl_close($ch);

    echo "HTTP Status: {$httpCode}\n";

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
            "Token not found:\n" .
            json_encode($data, JSON_PRETTY_PRINT)
        );
    }

    echo "✅ Token received\n";

    return $token;
}

try {

    $token = getFreshToken();

    echo "🔌 Connecting WebSocket...\n";

    $client = new Client(
        WS_URL,
        [
            "timeout" => 300,
            "headers" => [
                "Authorization" => "Bearer {$token}"
            ]
        ]
    );

    echo "✅ WebSocket connected\n";

    $submitRequest = [
        "type" => "submit_url",
        "request_id" => "req-1",
        "figma_url" => FIGMA_URL
    ];

    echo "📤 Sending submit_url...\n";

    $client->send(
        json_encode($submitRequest)
    );

    while (true) {

        $message = $client->receive();

        echo "\n====================================\n";
        echo "RAW MESSAGE\n";
        echo "====================================\n";
        echo $message . "\n";

        $data = json_decode(
            $message,
            true
        );

        if (!$data) {
            continue;
        }

        $type = $data["type"] ?? "";

        // ------------------------------------
        // Ping
        // ------------------------------------

        if ($type === "ping") {

            echo "🏓 Sending pong\n";

            $client->send(
                json_encode([
                    "type" => "pong"
                ])
            );

            continue;
        }

        // ------------------------------------
        // Queue Status
        // ------------------------------------

        if ($type === "queue_status") {

            echo sprintf(
                "📊 Queue | Pending=%s Active=%s Processed=%s\n",
                $data["pending"] ?? 0,
                $data["active"] ?? 0,
                $data["processed"] ?? 0
            );

            continue;
        }

        // ------------------------------------
        // Error
        // ------------------------------------

        if ($type === "error") {

            echo "❌ ERROR\n";

            print_r($data);

            break;
        }

        // ------------------------------------
        // Submit URL Response
        // ------------------------------------

        if ($type === "submit_url_response") {

    echo "\n✅ FIGMA FILE LOADED\n";

    $result = $data["result"] ?? [];

    $fileKey = $result["filekey"] ?? "";

    $frames = $result["frame_list"] ?? [];

    foreach ($frames as $index => $frame) {

        echo sprintf(
            "[%d] %s (%s)\n",
            $index + 1,
            $frame["name"] ?? "",
            $frame["id"] ?? ""
        );
    }

    // --------------------------------------------------
    // Select first frame for testing
    // --------------------------------------------------

    $selectedFrame = $frames[0];

    echo "\n🎯 Selected Frame: "
        . $selectedFrame["name"]
        . "\n";

    $client->send(json_encode([

        "type" => "convert",

        "request_id" => "req-2",

        "file_key" => $fileKey,

        "frame_name" => $selectedFrame["name"]

    ]));

    echo "📤 Convert request sent\n";

    continue;
}
if ($type === "convert_response") {

    $resultJson = json_encode(
        $data["result"] ?? [],
        JSON_PRETTY_PRINT |
        JSON_UNESCAPED_UNICODE
    );

    file_put_contents(
        "converted_template.json",
        $resultJson
    );

    // Copy to Windows clipboard
    $process = popen('clip', 'w');

    if ($process) {
        fwrite($process, $resultJson);
        pclose($process);
    }

    echo "\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ CONVERSION COMPLETED SUCCESSFULLY\n";
    echo str_repeat("=", 60) . "\n";
    echo "📋 Template copied to clipboard\n";
    echo "📄 Saved to converted_template.json\n";
    echo "📏 Template Size: "
        . number_format(strlen($resultJson))
        . " characters\n";
    echo str_repeat("=", 60) . "\n";

    break;
}
    }

} catch (Throwable $e) {

    echo "\n❌ ERROR\n";
    echo $e->getMessage() . "\n";
}