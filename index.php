<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">
    <link
    rel="icon"
    type="image/png"
    href="favicon.png"
/>
    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Neemo — The Figma URL Eater</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

    <style>

        
    </style>

</head>

<body>

<div class="bg-grid"></div>

<div class="glow glow1"></div>

<div class="glow glow2"></div>

<div class="dashboard">

    <!-- SIDEBAR -->

    <div class="sidebar">

        <div class="logo-box glass" style="padding:20px;">

            <h1 style="font-size:31px;">FIGMA</h1>

            <p style="font-size:14px;">API DASHBOARD</p>

      <!-- SERVER STATUS -->

<div
    style="
        display:flex;
        flex-direction:column;
        gap:12px;
        margin-top:15px;
    "
>

    <!-- SERVER STATUS -->

    <div
        class="status"
        id="serverStatus"
        style="
            font-size:14px;
            margin-top:0;
            width:190px;
            justify-content:center;
        "
    >

        <div class="status-dot"></div>

        Checking Server...

    </div>

    <!-- FLASK STATUS -->

    <div
        class="status"
        id="flaskStatus"
        style="
            font-size:14px;
            margin-top:0;
            width:190px;
            justify-content:center;
        "
    >

        <div class="status-dot "></div>

        Checking Flask...

    </div>

</div>




<div id="serverAnimation"></div>

        </div>

        <!-- URL PANEL -->
<div class="panel glass">

    <div class="panel-title figma-header">
        <p class="performance-title">Figma URL</p>

        <div class="env-switch">
            <span class="env-label active" id="localLabel">LOCAL</span>

            <label class="switch">
                <input type="checkbox" id="environmentToggle">
                <span class="slider"></span>
            </label>

            <span class="env-label" id="devLabel">DEV</span>
        </div>
    </div>

    <input
        type="text"
        id="figmaUrl"
        placeholder="Paste Figma URL..."
    >

    <button id="loadFramesBtn" style="font-size:15px;">
        <i class="fa-solid fa-bowl-food btn-icon"></i>
        Feed URL
    </button>

</div>

        <!-- FRAME PANEL -->
         
         

        <div class="panel glass">

            <div class="panel-title">
                <P class="performance-title">  Select Frame<P>
            </div>

            <div class="custom-select">

                <div
                    class="select-header"
                    id="selectHeader"
                >

                    <span id="selectedText">
                        -- Select Frame --
                    </span>

                    <span>▼</span>

                </div>

                <div
                    class="dropdown"
                    id="dropdown"
                ></div>

            </div>

             <button id="generateBtn" style="font-size:15px;">

    <i class="fa-solid fa-robot btn-icon"></i>

    Generate Json

</button>


        </div>
      <button
    id="startNemoBtn"
    class="nemo-control-btn nemo-start"
>

    <i class="fa-solid fa-play"></i>

    <span id="startNemoText">
        Start Neemo
    </span>

</button>

<button
    id="stopNemoBtn"
    class="nemo-control-btn nemo-stop"
    style="margin-top:16px;"
>

    <i class="fa-solid fa-power-off"></i>

    Stop Neemo

</button>
<div class="nemo-footer">
    © 2026 <span>Neemo v1.0 Beta </span> • All Rights Reserved
</div>

    </div>
    <!-- DEV CONSOLE -->

<div class="dev-console">

    <!-- CONTROL PANEL -->

    <div class="panel glass">

        <div class="panel-title">
           <p class= "performance-title"> Dev Controls<P>
        </div>

       <div class="dev-buttons">

    <button
        id="startServerBtn"
        class="dev-btn start-btn"
    >
        <i class="fa-solid fa-play"></i>
        Start
    </button>

    <button
        id="stopServerBtn"
        class="dev-btn stop-btn"
    >
        <i class="fa-solid fa-stop"></i>
        Stop
    </button>

    <button
        id="restartServerBtn"
        class="dev-btn restart-btn"
    >
        <i class="fa-solid fa-rotate-right"></i>
        Restart
    </button>

</div>

    </div>

<!-- LIVE LOGS -->

<div class="logs-panel glass" id="logsPanel">

    <div
        style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:18px;
        "
    >
        <p class="performance-title">
            Live Server Logs
        </p>

        <button
            id="expandLogsBtn"
            style="
                width:auto;
                padding:10px 14px;
                border-radius:12px;
                font-size:13px;
            "
        >
            <i class="fa-solid fa-expand"></i>
        </button>
    </div>

    <div id="logContainer">

        <div class="waiting-log">
            Waiting for logs...
        </div>

    </div>

    <!-- DEV MODE OVERLAY -->
   <div class="dev-overlay">

    <lottie-player
        src="https://lottie.host/3756aa18-0154-49c1-996d-f18a2066fc18/VbhDN14UJ9.json"
        background="transparent"
        speed="1"
        style="width:240px;height:240px; margin-bottom:-25px;"
        loop
        autoplay>
    </lottie-player>

    <div class="dev-message">

    <div class="dev-badge">
        DEV ENVIRONMENT
    </div>

    

    <div class="subtitle">
        Live log streaming is available only in Local mode.
    </div>

</div>

</div>

</div>
    

</div>
    

    <!-- MAIN -->

    <div class="main">

        <!-- TOPBAR -->

        <div class="topbar glass">

            <div>

    <div class="nemo-header">
    <h2 class="nemo-title">
        Meet Neemo — The Figma URL Eater
    </h2>

    <i
        id="nemoSettingsBtn"
        class="fa-solid fa-gear nemo-settings"
        title="Settings"
    ></i>
</div>

<p class="nemo-subtitle"></p>

    <p class="nemo-subtitle">
       
    </p>

</div>

            <button
                class="copy-btn"
                id="copyBtn"
               
            >
            <i class="fa-solid fa-copy btn-icon" ></i>
                Copy Response
            </button>

        </div>

        <!-- STATS -->

        <div class="stats">

            <div class="stat-card glass">

                <div class="stat-label">
                    File Key
                </div>

                <div
                    class="stat-value"
                    id="fileKey"
                >
                    —
                </div>

            </div>

            <div class="stat-card glass">

                <div class="stat-label">
                    Frames Loaded
                </div>

                <div
                    class="stat-value"
                    id="framesLoaded"
                >
                    —
                </div>

            </div>

            <div class="stat-card glass">

                <div class="stat-label">
                    Selected Frame
                </div>

                <div
                    class="stat-value"
                    id="selectedFrame"
                >
                    —
                </div>

            </div>

        </div>

        <!-- RESPONSE -->
        <!-- LIVE PERFORMANCE PANEL -->

<!-- ====================================== -->
<!-- LIVE PERFORMANCE PANEL -->
<!-- ====================================== -->

<div
    class="performance-panel glass"
    id="performancePanel"
>
<div class="weather-overlay"></div>

    <!-- TOP HEADER -->

    <div class="performance-header">

        <div class="performance-title">
            Environment Console
        </div>
          <!-- WEATHER MINI WIDGET -->

    <div class="weather-mini" id="weatherMini">

        <div class="weather-icon">
            <i class="fa-solid fa-cloud-sun"></i>
        </div>

        <div class="weather-info">

            <div
                class="weather-temp"
                id="weatherTemp"
            >
                --°C
            </div>

            <div
                class="weather-location"
                id="weatherLocation"
            >
               
            </div>

        </div>

    </div>


        <div class="performance-live">

            <span class="live-dot"></span>

            LIVE

        </div>

    </div>

    <!-- GRAPH CONTAINER -->

    <div class="performance-graph-container">

        <!-- GRID -->

        <div class="graph-grid"></div>

        <!-- GRAPH -->

        <svg
            class="performance-graph"
            viewBox="0 0 1000 220"
            preserveAspectRatio="none"
        >

            <defs>

                <!-- LINE GRADIENT -->

                <linearGradient
                    id="graphGlow"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >

                    <stop
                        offset="0%"
                        stop-color="#00f5ff"
                    />

                    <stop
                        offset="50%"
                        stop-color="#38bdf8"
                    />

                    <stop
                        offset="100%"
                        stop-color="#8b5cf6"
                    />

                </linearGradient>

                <!-- AREA -->

                <linearGradient
                    id="areaGlow"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >

                    <stop
                        offset="0%"
                        stop-color="rgba(0,245,255,0.22)"
                    />

                    <stop
                        offset="100%"
                        stop-color="rgba(0,245,255,0)"
                    />

                </linearGradient>

            </defs>

            <!-- AREA -->

            <path
                d="
                    M0 180
                    C120 70 200 185 320 110
                    C430 40 520 170 640 80
                    C760 10 850 150 1000 55
                    L1000 220
                    L0 220
                    Z
                "
                fill="url(#areaGlow)"
            />

            <!-- MAIN LINE -->

            <path
                id="graphPath"
                d="
                    M0 180
                    C120 70 200 185 320 110
                    C430 40 520 170 640 80
                    C760 10 850 150 1000 55
                "
                fill="none"
                stroke="url(#graphGlow)"
                stroke-width="5"
                stroke-linecap="round"
            />

        </svg>

        <!-- CPU POINT -->

        <div
            class="graph-point"
            style="
                left:28%;
                top:61.2%;
            "
        >

            <div class="point-dot"></div>

            <div class="point-card">

                <div class="point-label">
                    CPU
                </div>

                <div
                    class="point-value"
                    id="cpuUsage"
                >
                    0 %
                </div>

            </div>

        </div>

        <!-- RAM POINT -->

        <div
            class="graph-point"
            style="
                left:54%;
                top:43.8%;
            "
        >

            <div class="point-dot"></div>

            <div class="point-card">

                <div class="point-label">
                    RAM
                </div>

                <div
                    class="point-value"
                    id="ramUsage"
                >
                    0 %
                </div>

            </div>

        </div>

        <!-- REQUESTS POINT -->

       <!-- INTERNET SPEED POINT -->

<div
    class="graph-point"
    style="
        left:82%;
        top:27.5%;
    "
>

    <div class="point-dot"></div>

    <div class="point-card"  style= "margin-top:10px">

        <div  class="point-label">
            Network
        </div>

        <div
            class="point-value"
            id="internetSpeed"
        >
            0 Mbps
        </div>

    </div>

</div>

    </div>

</div>

        <div class="response glass">
           <div class="response-header">

    <p class="performance-title">
        Response Console
    </p>

    <div class="response-header-right">

        <div id="responseTimer" class="response-timer">
            <i class="fa-regular fa-clock"></i>
            <span>00:00</span>
        </div>

        <button id="expandResponseBtn">
            <i class="fa-solid fa-expand"></i>
        </button>

    </div>

</div>
            <div class="response-wrapper">

                <pre id="responseBox">
                    

    <div class="empty-state">
        

        <lottie-player
            src="https://lottie.host/7366b9f9-d6e4-42ef-8282-8e49255938cc/c6IwXDOqYl.json"
            background="transparent"
            speed="1"
            style="width: 425px; height: 425px; margin-top:-70px;"
            loop
            autoplay
        ></lottie-player>

        <div class="empty-text">
            
        </div>

    </div>

</pre>

            </div>

        </div>

    </div>

</div>
<!-- ====================================== -->
<!-- LOG VIEWER MODAL -->
<!-- ====================================== -->

<div
    id="logsModal"
    class="logs-modal-overlay"
>
    <div class="logs-modal glass">

       <div class="logs-modal-header">

    <div class="modal-admin-section">

        <div class="modal-admin-text">

            <h2 class="modal-admin-title">
                Neemo Apex
            </h2>

            <p class="modal-admin-subtitle">
            Log Monitoring Console
            </p>

        </div>

        <div
            id="modalLottie"
            class="modal-lottie"
        >

            <lottie-player
                src="https://lottie.host/4b72c6de-82f9-414c-81d9-5bb49edea0bb/PUYdJTwQyd.json"
                background="transparent"
                speed="1"
                 style="width: 125px; height: 125px; margin-top:-12px;margin-left:-34px;"
                loop
                autoplay
            ></lottie-player>

        </div>
        

    </div>
  <div class="modal-actions"> 
   <div class="search-wrapper">

    <i
        class="fa-solid fa-magnifying-glass search-icon"
        style="margin-top:0px;"
    ></i>

    <input
        type="text"
        id="logSearchInput"
        class="log-search-input"
        style="margin-right:0px;"
        placeholder="Search In Apex..."
    >

</div>
    <button
    id="debugFilterBtn"
    class="debug-filter-btn"
>
    <i class="fa-solid fa-bug"></i>
    Debug Filter
</button>
 <button
        id="stickBottomBtn"
        class="stick-bottom-btn"
    >
        <i class="fa-solid fa-anchor"></i>
        Stick To Surface
    </button>
    <button
        id="closeLogsModal"
        class="logs-close-btn"
    >
        <i class="fa-solid fa-xmark"></i>
    </button>

</div>
</div>

        <div
            id="modalLogContainer"
            class="modal-log-container"
        ></div>

    </div>
</div>
<!-- ====================================== -->
<!-- RESPONSE VIEWER MODAL -->
<!-- ====================================== -->

<div
    id="responseModal"
    class="logs-modal-overlay"
>

    <div class="logs-modal glass">

        <div class="logs-modal-header">

            <div class="modal-admin-section">

                <div class="modal-admin-text">

                    <h2 class="modal-admin-title">
                        Neemo Terra
                    </h2>

                    <p class="modal-admin-subtitle">
                        JSON Response Viewer
                    </p>

                </div>
                <div
            id="modalLottie"
            class="modal-lottie"
        >

            <lottie-player
                src="https://lottie.host/68a8f8a3-188a-431c-abea-720ed2d921fe/7NMLumdGqI.json"
                background="transparent"
                speed="1"
                 style="width: 140px; height: 140px; margin-top:-20px;margin-left:-34px;"
                loop
                autoplay
            ></lottie-player>

        </div>
        <div
    id="virtualizationIndicator"
    class="virtualization-indicator"
    style="display:None;"
>
    <span class="virtual-pulse"></span>
    Hyper Engine Active
</div>


            </div>
            
           <div class="json-search-wrapper">

    <button id="prevJsonMatch">
        <i class="fa-solid fa-chevron-left"></i>
    </button>

    <input
        id="jsonSearchInput"
        type="text"
        placeholder="Search JSON..."
    >

    <span id="jsonSearchCount">
        0 / 0
    </span>

    <button id="nextJsonMatch">
        <i class="fa-solid fa-chevron-right"></i>
    </button>

</div>
            <button
                id="closeResponseModal"
                class="modal-close-btn"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>

        <div
            id="modalResponseContainer"
            class="modal-response-container"
        ></div>

    </div>

</div>
<div id="updateModal" class="update-modal">

    <div class="update-window">

        <div class="gradient-border"></div>

        <!-- Hero Animation -->
        <div class="hero-wrapper">

            <div id="updateLottie">
                  <lottie-player
        src="https://lottie.host/ab0016d4-3a15-4882-bdba-9eae6ea6a57e/1hgZTMw6o3.json"
        background="transparent"
        speed="1"
        style="width:240px;height:240px; margin-top:-60px;position:absolute;margin-left:-30px;"
        loop
        autoplay>
    </lottie-player>
            </div>

            <div class="update-badge">

                <span class="pulse"></span>

                UPDATE AVAILABLE

            </div>

        </div>

        <!-- Heading -->

        <div class="update-title">

            Neemo Just Got Better

        </div>

        <div class="update-subtitle">

            Update your local repository to enjoy the latest features
            

        </div>

        <!-- Version Comparison -->

        <div class="version-section">

            <div class="version-box">

                <div class="version-caption">

                    Installed

                </div>

                <div
                    class="version-number"
                    id="localVersion">

                </div>

            </div>

            <div class="version-transfer">

                <div class="transfer-line"></div>

                <div class="transfer-arrow">

                    ➜

                </div>

            </div>

            <div class="version-box latest">

                <div class="version-caption">

                    Latest

                </div>

                <div
                    class="version-number"
                    id="serverVersion">

                </div>

            </div>

        </div>

        <!-- Release Highlights -->

        <div class="whats-new">

            <div class="section-header">

                <span class="section-icon">

                    

                </span>

                <span>

                   <i class="fa-solid fa-cloud-arrow-up" style="padding-right:8px;"></i> What's New

                </span>

            </div>

            <div
                id="releaseList"
                class="release-grid">

                <!-- Example item (remove this if you're generating dynamically) -->

                <!--
                <div class="release-item">

                    <div class="release-icon">

                        ⚡

                    </div>

                    <div class="release-text">

                        Faster image processing

                    </div>

                </div>
                -->

            </div>

        </div>

        <!-- Footer -->
        <div id="updateActionContainer" class="update-action-container">

    <button
       style="margin-top:30px;"
        id="updateNowBtn"
        class="close-update"
        onclick="startUpdate()">

        <i class="fa-brands fa-space-awesome" style="padding-right:5px;font-size:20px;"></i> Launch Update

    </button>

</div>
    </div>

</div>

<!-- =========================================================
     NEMO SETTINGS MODAL
========================================================= -->

<div
    id="nemoSettingsModal"
    class="nemo-settings-modal"
    aria-hidden="true"
>

    <div class="nemo-settings-backdrop"></div>

    <div
        class="nemo-settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nemoSettingsTitle"
    >

        <!-- Header -->
        <div class="nemo-settings-header">

            <div class="nemo-settings-heading">

                <div class="nemo-settings-title-icon">
                    <i class="fa-solid fa-gear"></i>
                </div>

                <div>
                    <h2 id="nemoSettingsTitle">
                        Settings
                    </h2>

                    <span>
                        Manage your Neemo experience
                    </span>
                </div>

            </div>

            <button
                id="closeNemoSettingsBtn"
                class="nemo-settings-close"
                aria-label="Close settings"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>


        <!-- Navigation -->
        <div class="nemo-settings-tabs">

            <button
                class="nemo-settings-tab active"
                data-settings-tab="user"
            >
                <i class="fa-solid fa-circle-user"></i>
                <span>User Info</span>
            </button>

            <button
                class="nemo-settings-tab"
                data-settings-tab="usage"
            >
                <i class="fa-solid fa-chart-pie"></i>
                <span>Usage Statistics</span>
            </button>

            <button
                class="nemo-settings-tab"
                data-settings-tab="bug"
            >
                <i class="fa-solid fa-bug"></i>
                <span>Raise a Bug</span>
            </button>

            

        </div>


        <!-- Content -->
        <div class="nemo-settings-content">


            <!-- =================================================
                 USER INFO
            ================================================== -->

            <section
                class="nemo-settings-panel active"
                data-settings-panel="user"
            >

                <div class="nemo-user-avatar">

    <img
        id="nemoUserAvatar"
        class="nemo-avatar-image"
        alt="User avatar"
    >

</div>


               <div
    class="nemo-user-name"
    id="nemoUserActualName"
>
    Loading...
</div>

                <div class="nemo-user-subtitle">
                    Neemo Account
                </div>


                <div class="nemo-user-details">

                    <div class="nemo-user-detail">

                        <div class="nemo-detail-icon">
                            <i class="fa-solid fa-fingerprint"></i>
                        </div>

                        <div class="nemo-detail-content">

                            <span class="nemo-detail-label">
                                Neemo User ID
                            </span>

                           <strong id="nemoUserId">
    Loading...
</strong>

                        </div>

                    </div>


                    <div class="nemo-user-detail">

                        <div class="nemo-detail-icon">
                            <i class="fa-solid fa-user"></i>
                        </div>

                        <div class="nemo-detail-content">

                            <span class="nemo-detail-label">
                                Neemo Username
                            </span>

                            <strong id="nemoUserName">
    Loading...
</strong>

                        </div>

                    </div>


                    <div class="nemo-user-detail">

                        <div class="nemo-detail-icon">
                            <i class="fa-solid fa-code-branch"></i>
                        </div>

                        <div class="nemo-detail-content">

                            <span class="nemo-detail-label">
                                Neemo Version
                            </span>

                          <strong id="nemoVersion">
    --
</strong>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 USAGE STATISTICS
            ================================================== -->

            <section
                class="nemo-settings-panel"
                data-settings-panel="usage"
            >

                <div class="nemo-usage-header">

                    <h3>
                        Today's Usage
                    </h3>

                    <span>
                        Requests made today
                    </span>

                </div>


                <div class="nemo-usage-circle">

                    <div class="nemo-usage-circle-inner">

                        <strong id="nemoDailyRequests">
                            0
                        </strong>

                        <span>
                            Requests
                        </span>

                    </div>

                </div>


                <div class="nemo-usage-description">

                    Your daily Neemo request statistics
                    will appear here.

                </div>

            </section>


            <!-- =================================================
                 RAISE A BUG
            ================================================== -->

            <section
                class="nemo-settings-panel"
                data-settings-panel="bug"
            >

                <div class="nemo-bug-header">

                    <div class="nemo-bug-icon">
                        <i class="fa-solid fa-bug"></i>
                    </div>

                    <div>

                        <h3>
                            Found a problem?
                        </h3>

                        <span>
                            Help us make Neemo better
                        </span>

                    </div>

                </div>


                <form id="nemoBugForm">

                    <div class="nemo-form-group">

                        <label for="nemoBugTitle">
                            Bug Title
                        </label>

                        <input
                            type="text"
                            id="nemoBugTitle"
                            name="title"
                            placeholder="Briefly describe the issue"
                            autocomplete="off"
                        >

                    </div>


                    <div class="nemo-form-group">

                        <label for="nemoBugDescription">
                            Description
                        </label>

                        <textarea
                            id="nemoBugDescription"
                            name="description"
                            rows="5"
                            placeholder="Tell us what happened..."
                        ></textarea>

                    </div>


                    <button
                        type="submit"
                        class="nemo-raise-bug-btn"
                    >

                        <i class="fa-solid fa-bug-slash"></i>

                        Slash Bug

                    </button>

                </form>

            </section>

        </div>

    </div>

</div>
 <script src="js/script.js"></script>
</body>
</html>