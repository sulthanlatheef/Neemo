
/*
===========================================
Nemo Client Version
(Update this for every release)
===========================================
*/
const NEMO_VERSION = "1.0.6 Beta";
const CONTROL_SERVER =
    "https://neemo-controller-server.onrender.com";
   

const expandLogsBtn =
    document.getElementById(
        "expandLogsBtn"
    );

const logsModal =
    document.getElementById(
        "logsModal"
    );

const closeLogsModal =
    document.getElementById(
        "closeLogsModal"
    );

const modalLogContainer =
    document.getElementById(
        "modalLogContainer"
    );


    const loadBtn =
        document.getElementById("loadFramesBtn");

    const generateBtn =
        document.getElementById("generateBtn");

    const figmaUrl =
        document.getElementById("figmaUrl");

    const responseBox =
        document.getElementById("responseBox");

    const copyBtn =
        document.getElementById("copyBtn");

    const dropdown =
        document.getElementById("dropdown");

    const selectHeader =
        document.getElementById("selectHeader");

    const selectedText =
        document.getElementById("selectedText");

    const fileKeyEl =
        document.getElementById("fileKey");

    const framesLoadedEl =
        document.getElementById("framesLoaded");

    const selectedFrameEl =
        document.getElementById("selectedFrame");
    const startServerBtn =
    document.getElementById("startServerBtn");

const stopServerBtn =
    document.getElementById("stopServerBtn");

const restartServerBtn =
    document.getElementById("restartServerBtn");

const logContainer =
    document.getElementById("logContainer");
const startNemoBtn =
    document.getElementById(
        "startNemoBtn"
    );
const stopNemoBtn =
    document.getElementById(
        "stopNemoBtn"
    );
const startNemoText =
    document.getElementById(
        "startNemoText"
    );
const flaskStatus =
    document.getElementById(
        "flaskStatus"
    );
const stickBottomBtn =
    document.getElementById(
        "stickBottomBtn"
    );
const debugFilterBtn =
    document.getElementById(
        "debugFilterBtn"
    );
const logSearchInput =
    document.getElementById(
        "logSearchInput"
    );
const expandResponseBtn =
    document.getElementById(
        "expandResponseBtn"
    );

const responseModal =
    document.getElementById(
        "responseModal"
    );

const closeResponseModal =
    document.getElementById(
        "closeResponseModal"
    );

const modalResponseContainer =
    document.getElementById(
        "modalResponseContainer"
    );
const jsonSearchInput =
    document.getElementById(
        "jsonSearchInput"
    );

const jsonSearchCount =
    document.getElementById(
        "jsonSearchCount"
    );

const nextJsonMatch =
    document.getElementById(
        "nextJsonMatch"
    );

const prevJsonMatch =
    document.getElementById(
        "prevJsonMatch"
    );


const envToggle = document.getElementById("environmentToggle");
const localLabel = document.getElementById("localLabel");
const devLabel = document.getElementById("devLabel");
const logsPanel = document.getElementById("logsPanel");

let environment = "local";

envToggle.addEventListener("change", async function () {

    if (this.checked) {
        environment = "dev";
        localLabel.classList.remove("active");
        devLabel.classList.add("active");

        logsPanel.classList.add("dev-mode");

    } else {
        environment = "local";
        localLabel.classList.add("active");
        devLabel.classList.remove("active");

        logsPanel.classList.remove("dev-mode");
    }

    try {

        const response = await fetch("http://127.0.0.1:3001/set-environment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                environment: environment
            })
        });

        const result = await response.json();

        console.log("Environment updated:", result.environment);

    } catch (err) {
        console.error("Failed to update environment:", err);
    }

});

async function loadEnvironment() {

    try {

        const response = await fetch("http://127.0.0.1:3001/get-environment");
        const data = await response.json();

        environment = data.environment;

        if (environment === "dev") {

            envToggle.checked = true;
            localLabel.classList.remove("active");
            devLabel.classList.add("active");

            logsPanel.classList.add("dev-mode");

        } else {

            envToggle.checked = false;
            localLabel.classList.add("active");
            devLabel.classList.remove("active");

            logsPanel.classList.remove("dev-mode");
        }

    } catch (err) {

        console.error("Failed to load environment:", err);

    }

}

window.addEventListener("DOMContentLoaded", loadEnvironment);

window.addEventListener("DOMContentLoaded", loadEnvironment);
function searchJson(){

    const query =
        jsonSearchInput.value
        .trim()
        .toLowerCase();

    currentSearchText =
        query;

    searchMatches = [];

    currentMatchIndex = -1;

    if(!query){

        jsonSearchCount.textContent =
            "0 / 0";

        renderVirtualRows();

        return;
    }

    virtualLines.forEach(

        (line,index)=>{

            if(

                line
                .toLowerCase()
                .includes(query)

            ){

                searchMatches.push(index);

            }

        }

    );

    if(searchMatches.length){

        currentMatchIndex = 0;

        jumpToMatch(0);

    }

    updateSearchCounter();

    renderVirtualRows();
}

function searchNormalJson(){

    const query =
        jsonSearchInput.value
        .trim()
        .toLowerCase();

    normalSearchMatches = [];

    normalMatchIndex = -1;

   
   if(!query){

    jsonSearchCount.textContent =
        "0 / 0";

    renderNormalRows();

    return;
}

   normalLines.forEach(

    (line,index)=>{

        if(

            line
            .toLowerCase()
            .includes(query)

        ){

            normalSearchMatches.push(
                index
            );
        }
    }
);

  if(
    normalSearchMatches.length
){

    normalMatchIndex = 0;

    renderNormalRows();

    jumpToNormalMatch(0);
}

    updateNormalCounter();
}
function updateNormalCounter(){

    if(
        !normalSearchMatches.length
    ){

        jsonSearchCount.textContent =
            "0 / 0";

        return;
    }

    jsonSearchCount.textContent =

        `${normalMatchIndex + 1}
         /
         ${normalSearchMatches.length}`;
}

    

function jumpToNormalMatch(
    index
){

    const rows =

        modalResponseContainer
        .querySelectorAll(
            ".json-line"
        );

    const target =

        rows[
            normalSearchMatches[
                index
            ]
        ];

    if(!target){
        return;
    }

    target.scrollIntoView({

        behavior:"smooth",

        block:"center"
    });

}
function updateSearchCounter(){

    if(!searchMatches.length){

        jsonSearchCount.textContent =
            "0 / 0";

        return;
    }

    jsonSearchCount.textContent =

        `${currentMatchIndex + 1}
         /
         ${searchMatches.length}`;
}

function jumpToMatch(index){

    const viewport =
        document.getElementById(
            "virtualViewport"
        );

    if(!viewport){
        return;
    }

    const targetLine =
        searchMatches[index];

    viewport.scrollTop =

        targetLine *
        LINE_HEIGHT;
}
nextJsonMatch.addEventListener(

    "click",

    ()=>{

        const viewport =

            document.getElementById(
                "virtualViewport"
            );

        if(viewport){

            if(
                !searchMatches.length
            ){
                return;
            }

            currentMatchIndex++;

            if(
                currentMatchIndex >=
                searchMatches.length
            ){

                currentMatchIndex = 0;
            }

            jumpToMatch(
                currentMatchIndex
            );

            updateSearchCounter();

            renderVirtualRows();

        }else{

            if(
                !normalSearchMatches.length
            ){
                return;
            }

            normalMatchIndex++;

            if(
                normalMatchIndex >=
                normalSearchMatches.length
            ){

                normalMatchIndex = 0;
            }
                renderNormalRows();

            jumpToNormalMatch(
                normalMatchIndex
            );
        

            updateNormalCounter();
        }
    }
);
prevJsonMatch.addEventListener(

    "click",

    ()=>{

        const viewport =

            document.getElementById(
                "virtualViewport"
            );

        if(viewport){

            if(
                !searchMatches.length
            ){
                return;
            }

            currentMatchIndex--;

            if(
                currentMatchIndex < 0
            ){

                currentMatchIndex =
                    searchMatches.length - 1;
            }

            jumpToMatch(
                currentMatchIndex
            );

            updateSearchCounter();

            renderVirtualRows();

        }else{

            if(
                !normalSearchMatches.length
            ){
                return;
            }

            normalMatchIndex--;

            if(
                normalMatchIndex < 0
            ){

                normalMatchIndex =
                    normalSearchMatches.length - 1;
            }
            renderNormalRows();;

            jumpToNormalMatch(
                normalMatchIndex
            );
            

            updateNormalCounter();
        }
    }
);
jsonSearchInput.addEventListener(

    "input",

    ()=>{

        const viewport =

            document.getElementById(
                "virtualViewport"
            );

        if(viewport){

            searchJson();

        }else{

            searchNormalJson();
        }
    }
);
    modalResponseContainer.addEventListener(

    "wheel",

    (e)=>{

        if(
            e.shiftKey ||
            e.altKey
        ){

            e.preventDefault();

            modalResponseContainer.scrollLeft +=
                e.deltaY;
        }
    },

    { passive:false }
);
    let currentFileKey = "";

    let frameList = [];

    let selectedIndex = null;
    let virtualLines = [];
    let normalLines = [];

const LINE_HEIGHT = 24;
let searchMatches = [];

let currentMatchIndex = -1;

let currentSearchText = "";
let normalSearchMatches = [];

let normalMatchIndex = -1;

const BUFFER_LINES = 0;
    let stickToBottom = false;
    let debugFilterEnabled = false;

stickBottomBtn.addEventListener(
    "click",
    () => {

        stickToBottom =
            !stickToBottom;

        if(stickToBottom){

            stickBottomBtn.classList.add(
                "active"
            );

            stickBottomBtn.innerHTML = `
                <i class="fa-solid fa-satellite-dish"></i>
                Following Logs
            `;

            modalLogContainer.scrollTop =
                modalLogContainer.scrollHeight;

        }else{

            stickBottomBtn.classList.remove(
                "active"
            );

            stickBottomBtn.innerHTML = `
                <i class="fa-solid fa-anchor"></i>
                Stick To Surface
            `;
        }
    }
);
debugFilterBtn.addEventListener(
    "click",
    () => {

        debugFilterEnabled =
            !debugFilterEnabled;

        debugFilterBtn.classList.toggle(
            "active"
        );

        if(debugFilterEnabled){

            debugFilterBtn.innerHTML = `
                <i class="fa-solid fa-bug"></i>
                Debug Filter
            `;

        }else{

            debugFilterBtn.innerHTML = `
                <i class="fa-solid fa-bug"></i>
                Debug Filter
            `;
        }

        applyDebugHighlight();
    }
);
logSearchInput.addEventListener(
    "input",
    filterLogs
);
expandResponseBtn.addEventListener(
    "click",
    openResponseModal
);

closeResponseModal.addEventListener(
    "click",
    closeResponseViewer
);

responseModal.addEventListener(
    "click",
    (e)=>{

        if(e.target === responseModal){

            closeResponseViewer();
        }
    }
);

document.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.key === "Escape" &&
            responseModal.classList.contains(
                "active"
            )
        ){

            closeResponseViewer();
        }
    }
);
function syntaxHighlightJson(json){

    if(typeof json !== "string"){

        json = JSON.stringify(
            json,
            null,
            4
        );
    }

    json = json
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");

    return json.replace(

        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,

        function(match){

            let cls = "json-number";

            if(/^"/.test(match)){

                if(/:$/.test(match)){

                    cls = "json-key";

                }else{

                    cls = "json-string";
                }

            }else if(
                /true|false/.test(match)
            ){

                cls = "json-boolean";

            }else if(
                /null/.test(match)
            ){

                cls = "json-null";
            }

            return `<span class="${cls}">${match}</span>`;
        }
    );
}
function addLineNumbers(
    jsonText
){

    const lines =
        jsonText.split("\n");

    return lines.map(

        (line,index)=>`

<div class="json-line">

    <span class="json-line-number">
        ${index + 1}
    </span>

    <span
        class="json-line-content"
        data-original="${encodeURIComponent(line)}"
    >

        ${
            syntaxHighlightJson(
                line
            )
        }

    </span>

</div>`

    ).join("");
}
function highlightSearchMatch(
    line,
    lineIndex
){

    if(!currentSearchText){

        return line;
    }

    const regex =
        new RegExp(
            currentSearchText,
            "gi"
        );

    const isCurrentLine =

        searchMatches[
            currentMatchIndex
        ] === lineIndex;

    return line.replace(

        regex,

        isCurrentLine

        ?

        "___CURRENT_MATCH___$&___END_MATCH___"

        :

        "___MATCH___$&___END_MATCH___"
    );
}
function highlightNormalMatch(
    line,
    lineIndex
){

    const query =
        jsonSearchInput.value
        .trim()
        .toLowerCase();

    if(!query){
        return line;
    }

    const regex =
        new RegExp(
            query,
            "gi"
        );

    const isCurrentLine =

        normalSearchMatches[
            normalMatchIndex
        ] === lineIndex;

    return line.replace(

        regex,

        isCurrentLine

        ?

        "___CURRENT_MATCH___$&___END_MATCH___"

        :

        "___MATCH___$&___END_MATCH___"
    );
}
function renderNormalRows(){

    let html = "";

    normalLines.forEach(

        (line,index)=>{

            const rawLine =

                highlightNormalMatch(
                    line,
                    index
                );

            let lineHtml =

                syntaxHighlightJson(
                    rawLine
                );

            lineHtml =

                lineHtml

                .replaceAll(
                    "___MATCH___",
                    '<span class="json-search-hit">'
                )

                .replaceAll(
                    "___CURRENT_MATCH___",
                    '<span class="current-json-match">'
                )

                .replaceAll(
                    "___END_MATCH___",
                    '</span>'
                );

html += `
<div
    class="json-line"
    style="
        display:flex;
        align-items:center;
        height:${LINE_HEIGHT}px;
    "
>
    <span class="json-line-number">${index + 1}</span>

    <span class="json-line-content">${lineHtml}</span>

</div>`;
        }
    );

    modalResponseContainer.innerHTML =
        html;
}
function renderVirtualRows(){
    

    const viewport =
        document.getElementById(
            "virtualViewport"
        );

    const content =
        document.getElementById(
            "virtualContent"
        );

    if(
        !viewport ||
        !content
    ){
        return;
    }

    const scrollTop =
        viewport.scrollTop;

    const viewportHeight =
        viewport.clientHeight;

    const startIndex =
        Math.max(
            0,
            Math.floor(
                scrollTop /
                LINE_HEIGHT
            ) - BUFFER_LINES
        );

    const visibleCount =
        Math.ceil(
            viewportHeight /
            LINE_HEIGHT
        ) + BUFFER_LINES * 2;

    const endIndex =
        Math.min(
            virtualLines.length,
            startIndex +
            visibleCount
        );

    let html = "";

    for(
    let i = startIndex;
    i < endIndex;
    i++
){

   const rawLine =

    highlightSearchMatch(
        virtualLines[i],
        i
    );

let lineHtml =

    syntaxHighlightJson(
        rawLine
    );
    lineHtml =

    lineHtml

    .replaceAll(

        "___MATCH___",

        '<span class="json-search-hit">'
    )

    .replaceAll(

        "___CURRENT_MATCH___",

        '<span class="current-json-match">'
    )

    .replaceAll(

        "___END_MATCH___",

        '</span>'
    );
  

   html += `
<div
    class="json-line"
    style="
        position:absolute;
        top:${i * LINE_HEIGHT}px;
        left:0;
        right:0;
        height:${LINE_HEIGHT}px;
        display:flex;
    "
>
    <span class="json-line-number">${i + 1}</span>
    <span class="json-line-content">${lineHtml}</span>
</div>`;
}
    content.innerHTML = html;

if(startIndex === 0){

    setTimeout(()=>{

        const row =
            document.querySelector(
                ".json-line"
            );

        if(row){

        }

    },100);
}
}
function openVirtualViewer(
    jsonText
){

    virtualLines =
        jsonText.split("\n");

    modalResponseContainer.innerHTML = `

        <div
<div
    id="virtualViewport"
    style="
        margin-top:0px;
        position:relative;
        height:100%;
        overflow-y:auto;
        overflow-x:auto;
        box-sizing:border-box;
    "
>
            <div
                id="virtualSpacer"
                style="
                    height:${
                        virtualLines.length *
                        LINE_HEIGHT
                    }px;
                "
            ></div>

            <div
    id="virtualContent"
    style="
        position:absolute;
        top:0;
        left:0;
        
        margin:0;
        padding:0;
    "
></div>

        </div>

    `;

    const viewport =
        document.getElementById(
            "virtualViewport"
        );
    viewport.addEventListener(

    "wheel",

    (e)=>{

        /*
        -----------------------------------
        SHIFT + WHEEL = HORIZONTAL SCROLL
        -----------------------------------
        */

        if(e.shiftKey){

            e.preventDefault();

            viewport.scrollLeft +=
                e.deltaY;
        }
    },

    { passive:false }
);

    viewport.addEventListener(
    "scroll",
    ()=>{

        renderVirtualRows();
    }
);

    renderVirtualRows();
}
function openResponseModal(){
    jsonSearchInput.value = "";

jsonSearchCount.textContent =
    "0 / 0";

searchMatches = [];

currentMatchIndex = -1;

normalSearchMatches = [];

normalMatchIndex = -1;

    try{

        const json =
            JSON.parse(
                responseBox.textContent
            );

       const jsonText =
    JSON.stringify(
        json,
        null,
        4
    );
    normalLines =
    jsonText.split("\n");

const lineCount =
    jsonText.split("\n").length;



if(lineCount > 5000){
     document
        .getElementById(
            "virtualizationIndicator"
        )
        .style.display = "flex";

    openVirtualViewer(
        jsonText
    );

    openVirtualViewer(
        jsonText
    );

}else{

renderNormalRows();
} 

    }catch{

        modalResponseContainer.textContent =
            responseBox.textContent;
    }

    responseModal.classList.add(
        "active"
    );
}


function closeResponseViewer(){

    responseModal.classList.remove(
        "active"
    );
    document
    .getElementById(
        "virtualizationIndicator"
    )
    .style.display = "none";
}
function filterLogs(){

    const query =
        logSearchInput.value
        .trim()
        .toLowerCase();

    const logs =
        modalLogContainer.children;

    let matchCount = 0;

    for(const log of logs){

        const text =
            log.textContent.toLowerCase();

        if(
            query === "" ||
            text.includes(query)
        ){

            log.style.display = "";

            matchCount++;

        }else{

            log.style.display = "none";
        }
    }

    if(
        query !== "" &&
        matchCount === 0
    ){

        logSearchInput.classList.add(
            "search-no-match"
        );

    }else{

        logSearchInput.classList.remove(
            "search-no-match"
        );
    }
}
function applyDebugHighlight(){

    const logs =
        modalLogContainer.children;

    for(const log of logs){

        const text =
            log.textContent.toLowerCase();

        if(
            debugFilterEnabled &&
            text.includes("neemo")
        ){

            log.classList.add(
                "debug-highlight"
            );

        }else{

            log.classList.remove(
                "debug-highlight"
            );
        }
    }
}
function openLogsModal(){

    modalLogContainer.innerHTML =
        logContainer.innerHTML;

    applyDebugHighlight();

    logsModal.classList.add(
        "active"
    );
}
function closeLogsViewer(){
    

    logsModal.classList.remove("active");
}


expandLogsBtn.addEventListener(
    "click",
    openLogsModal
);

closeLogsModal.addEventListener(
    "click",
    closeLogsViewer
);

/* Click outside */

logsModal.addEventListener(
    "click",
    (e) => {

        if(e.target === logsModal){

            closeLogsViewer();
        }
    }
);

/* ESC key */

document.addEventListener(
    "keydown",
    (e) => {

        if(
            e.key === "Escape" &&
            logsModal.classList.contains(
                "active"
            )
        ){

            closeLogsViewer();
        }
    }
);

/*
|--------------------------------------------------------------------------
| NEMO STATUS
|--------------------------------------------------------------------------
*/

async function checkNemoStatus(){

    try{

        const res = await fetch(
            "http://127.0.0.1:3001/status"
        );

        if(res.ok){
            const nemoEngineOverlay =
    document.getElementById(
        "nemoEngineOverlay"
    );
nemoEngineOverlay.classList.add("hidden");
             const slider =
        envToggle.nextElementSibling;

    if(slider){

        slider.style.setProperty(
            "--toggle-ball-color",
            "#ffffff"
        );

    }

            startNemoBtn.disabled = true;

            startNemoBtn.style.opacity = "0.6";

            startNemoBtn.style.cursor =
                "not-allowed";

             startNemoBtn.innerHTML = `
                <i class="fas fa-play"></i>
                Neemo Running
            `;
            /*
    |--------------------------------------------------------------------------
    | DISABLE DEPENDENT CONTROLS
    |--------------------------------------------------------------------------
    */
   envToggle.disabled=false;

    loadBtn.disabled = false;
    loadBtn.style.opacity = "1";
    loadBtn.style.cursor = "pointer";

    generateBtn.disabled = false;
    generateBtn.style.opacity = "1";
    generateBtn.style.cursor = "pointer";

   

        }else{

            throw new Error();
        }

    } catch(error){

    console.error("Neemo status check failed:", error);

    nemoEngineOverlay.classList.remove(
    "hidden"
);

    /*
    |--------------------------------------------------------------------------
    | SWITCH BACK TO LOCAL
    |--------------------------------------------------------------------------
    */

    environment = "local";

    envToggle.checked = false;
    envToggle.disabled = true;

    localLabel.classList.add("active");
    devLabel.classList.remove("active");

    logsPanel.classList.remove("dev-mode");


    /*
    |--------------------------------------------------------------------------
    | SLIDER BALL → RED
    |--------------------------------------------------------------------------
    */

    const slider =
        envToggle.nextElementSibling;

    if(slider){

        slider.style.setProperty(
            "--toggle-ball-color",
            "#ef4444"
        );

    }


    /*
    |--------------------------------------------------------------------------
    | NEMO BUTTON
    |--------------------------------------------------------------------------
    */

    startNemoBtn.disabled = false;

    startNemoBtn.style.opacity = "1";

    startNemoBtn.style.cursor = "pointer";

    startNemoText.textContent =
        "Start Nemo";


    /*
    |--------------------------------------------------------------------------
    | DISABLE DEPENDENT CONTROLS
    |--------------------------------------------------------------------------
    */

    loadBtn.disabled = true;
    loadBtn.style.opacity = "0.6";
    loadBtn.style.cursor = "not-allowed";

    generateBtn.disabled = true;
    generateBtn.style.opacity = "0.6";
    generateBtn.style.cursor = "not-allowed";

   
}
}
checkNemoStatus();

setInterval(
    checkNemoStatus,
    3000
);
    /*
|--------------------------------------------------------------------------
| LIVE LOGS
|--------------------------------------------------------------------------
*/
function updateLogWarningState() {

    const logsPanel =
        document.querySelector(".logs-panel");

    const restartBtn =
        document.getElementById("restartServerBtn");

    const logCount =
        logContainer.children.length;

    if (logCount > 5000) {

        logsPanel.classList.add(
            "log-warning"
        );

        restartBtn.classList.add(
            "warning-restart"
        );

    } else {

        logsPanel.classList.remove(
            "log-warning"
        );

        restartBtn.classList.remove(
            "warning-restart"
        );
    }
}

let lastLogCount = 0;

async function fetchLogs(){
    

    try{

        const res = await fetch(
            "http://127.0.0.1:3001/logs"
        );

        const data = await res.json();

        const logs = data.logs || [];

        /*
        |--------------------------------------------------------------------------
        | APPEND ONLY NEW LOGS
        |--------------------------------------------------------------------------
        */
         
        if(logs.length > lastLogCount){

            /*
            |--------------------------------------------------------------------------
            | REMOVE WAITING MESSAGE
            |--------------------------------------------------------------------------
            */

            if(
                logContainer.innerHTML.includes(
                    "Waiting for logs"
                )
            ){

                logContainer.innerHTML = "";
            }

            /*
            |--------------------------------------------------------------------------
            | ADD NEW LOGS
            |--------------------------------------------------------------------------
            */

            for(
                let i = lastLogCount;
                i < logs.length;
                i++
            ){

                const line =
                    document.createElement("div");

                line.textContent =
                    logs[i];

                /*
                |--------------------------------------------------------------------------
                | LOG CARD STYLE
                |--------------------------------------------------------------------------
                */

                line.style.marginBottom =
                    "10px";

                line.style.padding =
                    "10px 14px";

                line.style.borderRadius =
                    "14px";

                line.style.fontWeight =
                    "500";

                line.style.wordBreak =
                    "break-word";

                line.style.transition =
                    "0.25s";

                line.style.border =
                    "1px solid rgba(255,255,255,0.05)";

                line.style.backdropFilter =
                    "blur(12px)";

                /*
                |--------------------------------------------------------------------------
                | ALTERNATING COLORS
                |--------------------------------------------------------------------------
                */

                if(i % 2 === 0){

                    /*
                    |--------------------------------------------------------------------------
                    | GREEN LOG
                    |--------------------------------------------------------------------------
                    */

                    line.style.color =
                        "#00ff88";

                    line.style.background =
                        "rgba(0,255,136,0.07)";

                    line.style.boxShadow =
                        "0 0 18px rgba(0,255,136,0.08)";

                }else{

                    /*
                    |--------------------------------------------------------------------------
                    | BLUE LOG
                    |--------------------------------------------------------------------------
                    */

                    line.style.color =
                        "#38bdf8";

                    line.style.background =
                        "rgba(56,189,248,0.07)";

                    line.style.boxShadow =
                        "0 0 18px rgba(56,189,248,0.08)";
                }

                /*
                |--------------------------------------------------------------------------
                | HOVER EFFECT
                |--------------------------------------------------------------------------
                */

                line.addEventListener(
                    "mouseenter",
                    ()=>{

                        line.style.transform =
                            "translateX(4px)";
                    }
                );

                line.addEventListener(
                    "mouseleave",
                    ()=>{

                        line.style.transform =
                            "translateX(0px)";
                    }
                );

                /*
                |--------------------------------------------------------------------------
                | APPEND
                |--------------------------------------------------------------------------
                */

                logContainer.appendChild(line);
                updateLogWarningState();
                const modalLine =
    line.cloneNode(true);

modalLogContainer.appendChild(
    modalLine
);
if(
    logSearchInput.value &&
    !modalLine.textContent
        .toLowerCase()
        .includes(
            logSearchInput.value
            .toLowerCase()
        )
){

    modalLine.style.display = "none";
}
if(stickToBottom){

    modalLogContainer.scrollTop =
        modalLogContainer.scrollHeight;
}
if(
    debugFilterEnabled &&
    modalLine.textContent
        .toLowerCase()
        .includes("neemo")
){

    modalLine.classList.add(
        "debug-highlight"
    );
}
                
            }

            /*
            |--------------------------------------------------------------------------
            | UPDATE COUNT
            |--------------------------------------------------------------------------
            */

            lastLogCount = logs.length;

            /*
            |--------------------------------------------------------------------------
            | AUTO SCROLL
            |--------------------------------------------------------------------------
            */

            logContainer.scrollTop =
                logContainer.scrollHeight;
        }

    }catch(error){

        console.error(
            "Log fetch error:",
            error
        );
    }
}

/*
|--------------------------------------------------------------------------
| REFRESH LOGS
|--------------------------------------------------------------------------
*/

setInterval(
    fetchLogs,
    500
);
    /*
    |--------------------------------------------------------------------------
    | LOADING UI
    |--------------------------------------------------------------------------
    */

    function setLoading(text){
        startResponseTimer();

    responseBox.innerHTML = `

        <div class="loading">

            <lottie-player
                src="https://lottie.host/911371b4-7b18-4ff8-9234-351a695e7f35/AAdXLwMbtC.json"
                background="transparent"
                speed="1"
                style="width:252px;height:252px;margin-top:-170px;"
                loop
                autoplay
            ></lottie-player>

            <div" style="font-size:18px; margin-top:10px;">${text}</div>

        </div>

    `;
}
let responseTimerInterval;
let responseStartTime;

function startResponseTimer(){

    const timer =
        document.getElementById("responseTimer");

    timer.style.display = "flex";

    responseStartTime = Date.now();

    clearInterval(responseTimerInterval);

    responseTimerInterval = setInterval(()=>{

        const elapsed =
            Math.floor(
                (Date.now() - responseStartTime)/1000
            );

        const minutes =
            String(Math.floor(elapsed/60))
            .padStart(2,"0");

        const seconds =
            String(elapsed%60)
            .padStart(2,"0");

        timer.querySelector("span").textContent =
            `${minutes}:${seconds}`;

    },1000);
}

function stopResponseTimer(){

    clearInterval(responseTimerInterval);

    // Hide after 2 seconds
   

}

    /*
    |--------------------------------------------------------------------------
    | DROPDOWN
    |--------------------------------------------------------------------------
    */

    selectHeader.addEventListener("click", ()=>{

        dropdown.classList.toggle("active");

    });

    document.addEventListener("click",(e)=>{

        if(
            !selectHeader.contains(e.target) &&
            !dropdown.contains(e.target)
        ){
            dropdown.classList.remove("active");
        }

    });

    /*
    |--------------------------------------------------------------------------
    | LOAD FRAMES
    |--------------------------------------------------------------------------
    */
   const serverStatus =
    document.getElementById("serverStatus");

async function checkServerStatus(){

    try{

        const res = await fetch(
    "api.php?action=health"
);

        const data = await res.json();
       

        if (data.status === "healthy"){

            serverStatus.classList.remove(
                "status-offline"
            );

            document.getElementById(
                "serverAnimation"
            ).innerHTML = `

                <lottie-player
                    src="https://lottie.host/a6718bbf-7eef-48af-bfde-7bdfec792ce5/iz14kIgi9t.json"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                ></lottie-player>

            `;

            serverStatus.innerHTML = `
                <div class="status-dot"></div>
                Server Connected
            `;

        }else{

            throw new Error();
        }

    }catch(error){

        serverStatus.classList.add(
            "status-offline"
        );

        document.getElementById(
            "serverAnimation"
        ).innerHTML = `

            <lottie-player
                src="https://lottie.host/3a691b93-5f1f-4bd2-8892-bea32eae90b1/6Vyt6gGdLd.json"
                background="transparent"
                speed="1"
                loop
                autoplay
            ></lottie-player>

        `;

        serverStatus.innerHTML = `
            <div class="status-dot offline"></div>
            Server Down
        `;
    }
}

checkServerStatus();

setInterval(
    checkServerStatus,
    5000
);
async function updateStartServerButton() {

    try {

        const res = await fetch("api.php?action=health");
        const data = await res.json();

        if (data.status === "healthy") {

            startServerBtn.disabled = true;
            startServerBtn.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                Running
            `;

        } 
    } catch (error) {

        // Server is down
        startServerBtn.disabled = false;
        startServerBtn.innerHTML = `
            <i class="fa-solid fa-play"></i>
            Start
        `;
    }
}

// Check immediately
updateStartServerButton();


// Check every 500 ms
setInterval(updateStartServerButton, 5000);

    loadBtn.addEventListener("click", async ()=>{

        const url = figmaUrl.value.trim();

        if(!url){

             

        const originalPlaceholder =
            figmaUrl.placeholder;

        figmaUrl.placeholder =
            "Please provide a Figma URL !";

        figmaUrl.classList.add(
            "error-placeholder"
        );

        setTimeout(()=>{

            figmaUrl.placeholder =
                originalPlaceholder;

            figmaUrl.classList.remove(
                "error-placeholder"
            );

        }, 3000);
            return;
        }

        setLoading(
    '<p style="margin-top:-43px">Loading Frames...</p>'
);

        try{

            const res = await fetch(
                "api.php?action=load_frames",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        figma_url:url
                    })
                }
            );

            const data = await res.json();
            stopResponseTimer();

            responseBox.textContent =
                JSON.stringify(data,null,2);

            currentFileKey =
                data.filekey || "";

            frameList =
                data.frame_list || [];

            selectedIndex = null;

            fileKeyEl.textContent =
                currentFileKey || "—";

            framesLoadedEl.textContent =
                frameList.length;

            selectedFrameEl.textContent =
                "—";

            selectedText.textContent =
                "-- Select Frame --";

            dropdown.innerHTML = "";

            frameList.forEach((frame,index)=>{

                const item =
                    document.createElement("div");

                item.className =
                    "dropdown-item";

                item.innerHTML = `
                    <div class="frame-name">
                        ${frame.name}
                    </div>

                    <div class="frame-id">
                        ${frame.id}
                    </div>
                `;

                item.addEventListener("click", ()=>{

                    selectedIndex = index;

                    selectedText.textContent =
                        frame.name;

                    selectedFrameEl.textContent =
                        frame.name;

                    dropdown.classList.remove(
                        "active"
                    );

                });

                dropdown.appendChild(item);

            });

        }catch(error){
            stopResponseTimer();

            responseBox.textContent =
                "Error loading frames";

            console.error(error);

        }

    });

    /*
    |--------------------------------------------------------------------------
    | GENERATE JSON
    |--------------------------------------------------------------------------
    */

    generateBtn.addEventListener("click", async ()=>{

        if(selectedIndex === null){

    const originalText =
        selectedText.textContent;

    selectedText.textContent =
        "Please select a frame !";

    selectedText.classList.add(
        "error-message"
    );

    setTimeout(()=>{

        selectedText.textContent =
            originalText;

        selectedText.classList.remove(
            "error-message"
        );

    }, 3000);

    return;
}

        const frame =
            frameList[selectedIndex];

        setLoading(
    '<p style="margin-top:-43px">Generating JSON...</p>'
);

        try{

            const res = await fetch(
                "api.php?action=generate_json",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({

                        file_key:
                            currentFileKey,

                        frame_name:
                            frame.name,

                        frame_id:
                            frame.id
                    })
                }
            );

            const data = await res.json();
            stopResponseTimer();

            responseBox.textContent =
                JSON.stringify(data,null,2);

        }catch(error){
            stopResponseTimer();

            responseBox.textContent =
                "Error generating JSON";

            console.error(error);

        }

    });

    /*
    |--------------------------------------------------------------------------
    | COPY
    |--------------------------------------------------------------------------
    */

    copyBtn.addEventListener("click", async ()=>{

        const text =
            responseBox.textContent;

        if(!text.trim()){
            return;
        }

        try{

            await navigator.clipboard.writeText(
                text
            );

copyBtn.innerHTML =
    '<i class="fa-solid fa-circle-check btn-icon"></i> Copied!';

            setTimeout(()=>{

                copyBtn.innerHTML =
    '<i class="fa-solid fa-copy btn-icon"></i> Copy Response';

            },2000);

        }catch(error){

            console.error(error);
        }

    });
    /*
|--------------------------------------------------------------------------
| DEV SERVER CONTROLS
|--------------------------------------------------------------------------
*/
async function isFlaskRunning(){

    try{

        const res = await fetch(
            "http://127.0.0.1:5000/"
        );

        return res.ok;

    }catch(error){

        return false;
    }
}

async function startServer() {

  try {

    // Show loading spinner
    startServerBtn.disabled = true;
    startServerBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
    `;

    const response = await fetch("http://127.0.0.1:3001/start");

    if (!response.ok) {
        throw new Error("Failed to start server");
    }

    lastLogCount = 0;

    logContainer.innerHTML = `
        <div class="waiting-log">
            Starting server...
        </div>
    `;

    // Keep spinner visible for 3 seconds
   // setTimeout(() => {
       // startServerBtn.disabled = false;
       // startServerBtn.innerHTML = `
         //   <i class="fa-solid fa-play"></i>
          //  Start
      //  `;
    //}, 3000);

} catch (error) {

    console.error(error);

    // Restore button immediately if an error occurs
    startServerBtn.disabled = false;
    startServerBtn.innerHTML = `
        <i class="fa-solid fa-play"></i>
        Start
    `;
}
}

async function stopServer(){

    try{
         stopServerBtn.disabled = true;
    stopServerBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
    `;


        await fetch(
            "http://127.0.0.1:3001/stop"
        );

         
        stopServerBtn.disabled = false;
        stopServerBtn.innerHTML = `
           
            stopped !
        `;
    

     setTimeout(() => {
       
        stopServerBtn.innerHTML = `
            <i class="fa-solid fa-stop"></i>
            stop
        `;
    }, 2000);

         startServerBtn.disabled = false;
            startServerBtn.innerHTML = `
                <i class="fa-solid fa-play"></i>
                Start
            `;

    }catch(error){

        console.error(error);
    }
}

async function restartServer(){

    try{
        restartServerBtn.disabled = true;
    restartServerBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
    `; 

        logContainer.innerHTML = `
            <div class="waiting-log">
                Restarting server...
            </div>
        `;

        await fetch(
            "http://127.0.0.1:3001/restart"
        );

        lastLogCount = 0;
        
        restartServerBtn.disabled = false;
        restartServerBtn.innerHTML = `
           
            Initiated !
        `;
    

     setTimeout(() => {
       
        restartServerBtn.innerHTML = `
            <i class="fa-solid fa-rotate-right"></i>
            Restart
        `;
    }, 2000);

         
    }catch(error){

        console.error(error);
    }
}

startServerBtn.addEventListener(
    "click",
    startServer
);

stopServerBtn.addEventListener(
    "click",
    stopServer
);

restartServerBtn.addEventListener(
    "click",
    restartServer
);
startNemoBtn.addEventListener(
    "click",
    async ()=>{

        try{
            
            // Store original button content
            const originalHTML = startNemoBtn.innerHTML;
             startNemoBtn.disabled = true;
            startNemoBtn.style.opacity = "0.6";
            startNemoBtn.style.cursor="not-allowed";
            

            // Show loading state
            startNemoBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin" style="font-size: 19.5px;"></i>
                Starting Nemo...
            `;
            

            // Optional: disable button while starting
           

            response = await fetch(
                "api.php?action=start_nemo"
            );
            
            if (!response.ok) {
    throw new Error("Failed to start Nemo");
}
            

            setTimeout(()=>{

                checkNemoStatus();

             
                

            }, 3000);


        }catch(error){

            console.error(error);

            // Restore button if error occurs
            startNemoBtn.innerHTML = `
                <i class="fas fa-Warning"></i>
                Unexpected Error !
            `;

            startNemoBtn.disabled = false;
        }
    }
);
stopNemoBtn.addEventListener(

    "click",

    async ()=>{

        /*
        |--------------------------------------------------------------------------
        | STORE ORIGINAL BUTTON
        |--------------------------------------------------------------------------
        */

        const originalHTML =
            stopNemoBtn.innerHTML;

        /*
        |--------------------------------------------------------------------------
        | CHECK IF FLASK IS RUNNING
        |--------------------------------------------------------------------------
        */

        try{
            stopNemoBtn.disabled = true;
            
            

            const statusRes = await fetch(
                "http://127.0.0.1:3001/status"
            );

            /*
            |--------------------------------------------------------------------------
            | FLASK DOWN
            |--------------------------------------------------------------------------
            */

            if(!statusRes.ok){

                stopNemoBtn.innerHTML = `
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Flask Already Down
                `;

                stopNemoBtn.disabled = true;

                setTimeout(()=>{

                    stopNemoBtn.innerHTML =
                        originalHTML;

                    stopNemoBtn.disabled =
                        false;

                }, 2000);

                return;
            }

        }catch(error){

            /*
            |--------------------------------------------------------------------------
            | FETCH FAILED = FLASK DOWN
            |--------------------------------------------------------------------------
            */

            stopNemoBtn.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
                Flask Already Down
            `;

            stopNemoBtn.disabled = true;

            setTimeout(()=>{

                stopNemoBtn.innerHTML =
                    originalHTML;

                stopNemoBtn.disabled =
                    false;

            }, 2000);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | FLASK RUNNING → STOP IT
        |--------------------------------------------------------------------------
        */

        try{

            stopNemoBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"
                   style="font-size:19.5px;">
                </i>

                Stopping Nemo...
            `;

            stopNemoBtn.disabled = true;

            await fetch(
                "http://127.0.0.1:3001/shutdown"
            );
             setTimeout(()=>{

               
                 stopNemoBtn.innerHTML = `
                <i class="fas fa-cancel"
                   style="font-size:19.5px;">
                </i>

                Flask Terminated
            `;

                

            }, 1000);

            setTimeout(()=>{

                checkNemoStatus();

                checkFlaskStatus();

                stopNemoBtn.innerHTML =
                    originalHTML;

                stopNemoBtn.disabled =
                    false;
                 startNemoBtn.innerHTML = `
                <i class="fas fa-play" style="font-size: 19.5px;"></i>
                Start Neemo
            `;

            }, 3000);


        }catch(error){

            console.error(error);

            stopNemoBtn.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                Shutdown Failed
            `;

            setTimeout(()=>{

                stopNemoBtn.innerHTML =
                    originalHTML;

                stopNemoBtn.disabled =
                    false;

            }, 2000);
        }
    }
);
/*
|--------------------------------------------------------------------------
| FLASK STATUS
|--------------------------------------------------------------------------
*/

async function checkFlaskStatus(){

    try{

        const res = await fetch(
            "http://127.0.0.1:3001/status"
        );

        if(res.ok){

            flaskStatus.classList.remove(
                "status-offline"
            );

            flaskStatus.innerHTML = `
                <div class="status-dot"></div>
                Flask Running
            `;

        }else{

            throw new Error();
        }

    }catch(error){

        flaskStatus.classList.add(
            "status-offline"
        );

        flaskStatus.innerHTML = `
            <div class="status-dot offline"></div>
            Flask  Down
        `;
    }
}
/*
|--------------------------------------------------------------------------
| LIVE PERFORMANCE METRICS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| LIVE PERFORMANCE METRICS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| LIVE PERFORMANCE METRICS
|--------------------------------------------------------------------------
*/

async function updatePerformanceMetrics(){

    const panel =
        document.getElementById(
            "performancePanel"
        );

    try{

        const res = await fetch(
            "http://127.0.0.1:3001/metrics"
        );

        /*
        |--------------------------------------------------------------------------
        | FLASK RUNNING
        |--------------------------------------------------------------------------
        */

        panel.classList.remove(
            "offline-performance"
        );

        document.querySelector(
            ".performance-live"
        ).innerHTML = `

            <span class="live-dot"></span>

            LIVE
        `;

        /*
        |--------------------------------------------------------------------------
        | GET DATA
        |--------------------------------------------------------------------------
        */

        const data = await res.json();

        /*
        |--------------------------------------------------------------------------
        | UPDATE VALUES
        |--------------------------------------------------------------------------
        */

        document.getElementById(
            "cpuUsage"
        ).textContent =
            `${data.cpu} %`;

        document.getElementById(
            "ramUsage"
        ).textContent =
            `${data.ram}%`;

        document.getElementById(
            "internetSpeed"
        ).textContent =
            `${data.network} KB/s`;

        /*
        |--------------------------------------------------------------------------
        | UPDATE GRAPH
        |--------------------------------------------------------------------------
        */

      

    }catch(error){

        /*
        |--------------------------------------------------------------------------
        | FLASK DOWN
        |--------------------------------------------------------------------------
        */

        panel.classList.add(
            "offline-performance"
        );

        document.querySelector(
            ".performance-live"
        ).innerHTML = `

            <span class="live-dot"></span>

            OFFLINE
        `;

        /*
        |--------------------------------------------------------------------------
        | RESET VALUES
        |--------------------------------------------------------------------------
        */

        document.getElementById(
            "cpuUsage"
        ).textContent = "0 %";

        document.getElementById(
            "ramUsage"
        ).textContent = "0 %";

        document.getElementById(
            "internetSpeed"
        ).textContent = "0 KB/s";

        /*
        |--------------------------------------------------------------------------
        | FLAT GRAPH
        |--------------------------------------------------------------------------
        */

       
       
    }
}


checkFlaskStatus();

setInterval(
    checkFlaskStatus,
    5000
);
/*
|--------------------------------------------------------------------------
| START LIVE METRICS
|--------------------------------------------------------------------------
*/

updatePerformanceMetrics();

setInterval(

    updatePerformanceMetrics,

    1000
);
/* ====================================== */
/* LIVE WEATHER */
/* ====================================== */

/* ====================================== */
/* LIVE WEATHER */
/* ====================================== */

async function updateWeather(){

    try{

        /*
        |--------------------------------------------------------------------------
        | OPEN WEATHER API
        |--------------------------------------------------------------------------
        */

        const res = await fetch(

            "https://api.openweathermap.org/data/2.5/weather?zip=690501,IN&units=metric&appid=10d5f9d0ede41902de34abe536ade63d"

        );

        const data = await res.json();
        

        /*
        |--------------------------------------------------------------------------
        | WEATHER TYPE
        |--------------------------------------------------------------------------
        */

        const weatherType =
            data.weather[0]
                .main
                .toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | DAY / NIGHT
        |--------------------------------------------------------------------------
        */

        const weatherIconCode =
            data.weather[0]
                .icon;

        const isNight =
            weatherIconCode.includes(
                "n"
            );

        /*
        |--------------------------------------------------------------------------
        | TEMP
        |--------------------------------------------------------------------------
        */

        document.getElementById(
            "weatherTemp"
        ).textContent =

            `${Math.round(
                data.main.temp
            )}°C`;

        /*
        |--------------------------------------------------------------------------
        | THEME LABEL
        |--------------------------------------------------------------------------
        */

        const themeLabel =
            document.getElementById(
                "weatherLocation"
            );

        if(
            weatherType.includes(
                "clear"
            )
        ){

            if(isNight){

                themeLabel.textContent =
                    "MOONLIGHT";

            }else{

                themeLabel.textContent =
                    "CLEAR SKY";
            }

        }else if(
            weatherType.includes(
                "cloud"
            )
        ){

            themeLabel.textContent =
                "CLOUD MATRIX";

        }else if(
            weatherType.includes(
                "rain"
            )
        ){

            themeLabel.textContent =
                "RAIN PROTOCOL";

        }else if(
            weatherType.includes(
                "thunderstorm"
            )
        ){

            themeLabel.textContent =
                "STORM MODE";

        }else if(

            weatherType.includes(
                "mist"
            ) ||

            weatherType.includes(
                "fog"
            ) ||

            weatherType.includes(
                "haze"
            )

        ){

            themeLabel.textContent =
                "MIST ENVIRONMENT";

        }else{

            themeLabel.textContent =
                "DATA ERROR";
        }

        /*
        |--------------------------------------------------------------------------
        | ICON
        |--------------------------------------------------------------------------
        */

        const icon =
            document.querySelector(
                ".weather-icon i"
            );

        if(
            weatherType.includes(
                "clear"
            )
        ){

            if(isNight){

                icon.className =
                    "fa-solid fa-moon";

            }else{

                icon.className =
                    "fa-solid fa-sun";
            }

        }else if(
            weatherType.includes(
                "cloud"
            )
        ){

            icon.className =
                "fa-solid fa-cloud";

        }else if(
            weatherType.includes(
                "rain"
            )
        ){

            icon.className =
                "fa-solid fa-cloud-rain";

        }else if(
            weatherType.includes(
                "thunderstorm"
            )
        ){

            icon.className =
                "fa-solid fa-bolt";

        }else if(

            weatherType.includes(
                "mist"
            ) ||

            weatherType.includes(
                "fog"
            ) ||

            weatherType.includes(
                "haze"
            )

        ){

            icon.className =
                "fa-solid fa-smog";

        }else{

            icon.className =
                "fa-solid fa-cloud-sun";
        }

        /*
        |--------------------------------------------------------------------------
        | WEATHER THEME SYSTEM
        |--------------------------------------------------------------------------
        */

        console.log(
            weatherType
        );

        const panel =
            document.getElementById(
                "performancePanel"
            );

        /*
        |--------------------------------------------------------------------------
        | REMOVE OLD THEMES
        |--------------------------------------------------------------------------
        */

        panel.classList.remove(

            "weather-clear",

            "weather-clear-night",

            "weather-clouds",

            "weather-rain",

            "weather-thunderstorm",

            "weather-mist",
            "weather-atmosphere"
        );

        /*
        |--------------------------------------------------------------------------
        | APPLY NEW THEME
        |--------------------------------------------------------------------------
        */

        if(
            weatherType.includes(
                "clear"
            )
        ){

            /*
            |--------------------------------------------------------------------------
            | NIGHT CLEAR
            |--------------------------------------------------------------------------
            */

            if(isNight){

                panel.classList.add(
                    "weather-clear-night"
                );

            }

            /*
            |--------------------------------------------------------------------------
            | DAY CLEAR
            |--------------------------------------------------------------------------
            */

            else{

                panel.classList.add(
                    "weather-clear"
                );
            }

        }else if(
            weatherType.includes(
                "cloud"
            )
        ){

            panel.classList.add(
                "weather-clouds"
            );

        }else if(
            weatherType.includes(
                "rain"
            )
        ){

            panel.classList.add(
                "weather-rain"
            );

        }else if(
            weatherType.includes(
                "thunderstorm"
            )
        ){

            panel.classList.add(
                "weather-thunderstorm"
            );

        }else if(

            weatherType.includes(
                "mist"
            ) ||

            weatherType.includes(
                "fog"
            ) ||

            weatherType.includes(
                "haze"
            )

        ){

            panel.classList.add(
                "weather-mist"
            );
        }
        else{

    panel.classList.add(
        "weather-atmosphere"
    );
}

    }catch(error){

        console.error(

            "Weather fetch failed:",

            error
        );
    }
}
/* ====================================== */
/* START WEATHER */
/* ====================================== */

updateWeather();

setInterval(

    updateWeather,

    600000

);

function showUpdateModal(latestVersion, features){
    

    document.getElementById("updateModal")
        .style.display="flex";

    document.getElementById("localVersion")
        .textContent=NEMO_VERSION;

    document.getElementById("serverVersion")
        .textContent=latestVersion;

    const list=
        document.getElementById("releaseList");

    list.innerHTML="";

    features.forEach(feature=>{

        list.innerHTML+=`

            <div class="release-item">

                <div class="release-icon">

                    ✔

                </div>

                <div>

                    ${feature}

                </div>

            </div>

        `;

    });

}
function closeUpdateModal(){

    document.getElementById(
        "updateModal"
    ).style.display="none";

}
function updateProgress(percent, message) {

    const fill =
        document.getElementById("progressFill");

    const status =
        document.getElementById("progressStatus");

    fill.style.width = percent + "%";

    status.style.opacity = "0";

    setTimeout(() => {

        status.textContent = message;

        status.style.opacity = "1";

        if(message === "Connecting to Neemo Engine..."){

            status.classList.add(
                "connecting-status"
            );

        }
        else{

            status.classList.remove(
                "connecting-status"
            );

        }

    }, 150);

}
function updateSuccess() {

    document
        .getElementById("progressCard")
        .classList
        .add("progress-success");

    document
        .getElementById("progressTitle")
        .innerHTML =
        " Update Completed Successfully";

    updateProgress(
        100,
        "Neemo has been updated successfully."
    );

    setTimeout(
        startCountdown,
        1000
    );

}
function startCountdown(){

    let count=3;

    document
        .getElementById("progressTitle")
        .innerHTML=

        "Refreshing Neemo";

    const status=

        document.getElementById(
            "progressStatus"
        );

    status.textContent=

        `Refreshing in ${count}`;

    const timer=

        setInterval(()=>{

            count--;

            if(count>0){

                status.textContent=

                    `Refreshing in ${count}`;

            }

            else{

                clearInterval(timer);

                window.location.reload();

            }

        },1000);

}
function updateError(message){

    console.error(
        "Neemo Update Error:",
        message
    );

    document
        .getElementById("progressCard")
        .classList
        .add("progress-error");

    const title = document.getElementById("progressTitle");

title.innerHTML =
    '<i class="fa-solid fa-circle-exclamation blinking-icon" style="color:#ef4444"></i>Update Could Not Be Completed !';

title.style.color = "#ef4444";

title.style.fontWeight = "600";

   const status = document.getElementById("progressStatus");

status.style.color = "#ef4444";

status.textContent = message;
status.style.fontWeight = "600";
    
}
function simulateCompletion(){

    updateProgress(

        45,

        "Fetching latest changes..."

    );

    setTimeout(()=>{

        updateProgress(

            65,

            "Pulling latest version..."

        );

    },900);

    setTimeout(()=>{

        updateProgress(

            82,

            "Applying updates..."

        );

    },1500);

    setTimeout(()=>{

        updateProgress(

            95,

            "Restarting Neemo Engine..."

        );

    },2100);

    setTimeout(()=>{

        updateSuccess();

    },2800);

}
async function startUpdate() {

    showProgressCard();

    updateProgress(
        15,
        "Connecting to Neemo Engine..."
    );

    try {

        const response = await fetch(

            "api.php?action=update_nemo",

            {
                method: "POST"
            }

        );

     

        const result = await response.json();

        if(result.status !== "success"){

            updateError(
                result.message
            );

            return;

        }

        /*
        Nemo updated successfully.
        Now show a beautiful
        completion animation.
        */

        simulateCompletion();

    }

    catch(error){

        updateError(
            "Unable to connect with Neemo Engine."
        );

    }

}


function showProgressCard(){

    document
        .getElementById("updateActionContainer")
        .innerHTML=`

        <div
            id="progressCard"
            class="update-progress-card">

            <div
                id="progressTitle"
                class="update-progress-title">

              <i class="fa-solid fa-arrows-rotate"></i>  Updating Neemo

            </div>

            <div class="progress-bar">

                <div
                    id="progressFill"
                    class="progress-fill">

                </div>

            </div>

            <div
                id="progressStatus"
                style="margin-top:25px;"
                class="update-progress-status">
                

                Preparing update...

            </div>

        </div>

        `;

}




async function checkForUpdates(){

    try{

        const response=
            await fetch(
                `${CONTROL_SERVER}/version-figma`
            );

        const result=
            await response.json();

        if(result.status!=="success")
            return;

        const latestVersion=
            result.latest_version;

        if(latestVersion===NEMO_VERSION)
            return;

        const updateResponse=
            await fetch(
                `${CONTROL_SERVER}/update-figma/${latestVersion}`
            );

        const update=
            await updateResponse.json();

        if(update.status!=="success")
            return;

        showUpdateModal(
            latestVersion,
            update.data.features
        );

    }

   catch(error){

    console.log(
        "Unable to check updates.",
        error
    );

}

}
checkForUpdates();



async function syncRequestCount() {
    try {

        const response = await fetch(
            "http://127.0.0.1:3001/request-count"
        );

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        const count = data.count;

        // No new requests
        if (count === 0) {
            return;
        }

        // Send count to local Flask
        await fetch(
            "http://127.0.0.1:3001/sync-request-count",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    count: count
                })
            }
        );

    } catch (error) {
        console.error(
            "Failed to sync request count:",
            error
        );
    }
}
syncRequestCount();
setInterval(syncRequestCount, 60000);

/* =========================================================
   NEMO SETTINGS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const settingsBtn =
        document.getElementById("nemoSettingsBtn");

    const settingsModal =
        document.getElementById("nemoSettingsModal");

    const closeSettingsBtn =
        document.getElementById("closeNemoSettingsBtn");

    const settingsBackdrop =
        document.querySelector(".nemo-settings-backdrop");

    const settingsTabs =
        document.querySelectorAll(".nemo-settings-tab");

    const settingsPanels =
        document.querySelectorAll(".nemo-settings-panel");



    const bugForm =
        document.getElementById("nemoBugForm");

/* =====================================================
   LOAD NEMO USER INFORMATION
===================================================== */
/* =====================================================
   LOAD DAILY REQUEST COUNT
===================================================== */

async function loadNeemoDailyRequests() {

    const requestsElement =
        document.getElementById("nemoDailyRequests");


    if (!requestsElement) {
        return;
    }


    try {

        /*
         * Local Flask endpoint.
         *
         * Flask gets the user ID from .env
         * and communicates with the global
         * Neemo Controller Server.
         */

        const response = await fetch(
            "http://127.0.0.1:3001/get-neemo-daily-request-count"
        );


        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );

        }


        const result =
            await response.json();


        if (result.status !== "success") {

            throw new Error(
                result.message ||
                "Failed to load daily request count."
            );

        }


        const requests =
            result.data?.requests ?? 0;


        /*
         * Update UI
         */

        requestsElement.textContent =
            requests;


    } catch (error) {

        console.error(
            "Failed to load daily request count:",
            error
        );


        /*
         * Keep a safe fallback
         */

        requestsElement.textContent =
            "0";

    }

}

async function loadNeemoUserInfo() {

    const actualNameElement =
        document.getElementById("nemoUserActualName");

    const userIdElement =
        document.getElementById("nemoUserId");

    const userNameElement =
        document.getElementById("nemoUserName");


    try {

        /*
         * Local Flask endpoint.
         *
         * The user ID is NOT exposed here.
         * Flask gets it from .env and communicates
         * with the global Neemo Controller Server.
         */

        const response = await fetch(
            "http://127.0.0.1:3001/get-neemo-user-info"
        );


        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );

        }


        const result =
            await response.json();


        if (result.status !== "success") {

            throw new Error(
                result.message ||
                "Failed to load Neemo user information."
            );

        }


        const user =
            result.data;


        /*
         * Update UI
         */

        if (actualNameElement) {

            actualNameElement.textContent =
                user.actual_name || "Unknown User";

        }


        if (userIdElement) {

            userIdElement.textContent =
                user.user_id || "Unknown";

        }


        if (userNameElement) {

            userNameElement.textContent =
                user.user_name || "Unknown";

        }


    } catch (error) {

        console.error(
            "Failed to load Neemo user information:",
            error
        );


        /*
         * Fallback UI
         */

        if (actualNameElement) {
            actualNameElement.textContent =
                "Unable to load";
        }


        if (userIdElement) {
            userIdElement.textContent =
                "Unable to load";
        }


        if (userNameElement) {
            userNameElement.textContent =
                "Unable to load";
        }

    }

}
/* =====================================================
   RANDOM VOXEL AVATAR
===================================================== */

function loadRandomVoxelAvatar() {

    const avatar =
        document.getElementById("nemoUserAvatar");

    if (!avatar) {
        return;
    }

    const seed =
        crypto.randomUUID();

   avatar.src =
    `https://api.dicebear.com/10.x/voxel-bot/svg?seed=${encodeURIComponent(seed)}&backgroundColor=%23FFFFFF00&animationVariant=medium&animationProbability=100`;

}
/* =====================================================
   LOAD NEMO VERSION
===================================================== */

function loadNeemoVersion() {

    const versionElement =
        document.getElementById("nemoVersion");

    if (!versionElement) {
        return;
    }

    versionElement.textContent =
        NEMO_VERSION;
}
/* =====================================================
   LOAD NEMO VERSION ON FOOTER
===================================================== */

function loadNeemoVersion_footer() {

    const versionElement =
        document.getElementById("nemoVersion_footer");

    if (!versionElement) {
        return;
    }

    versionElement.textContent =
        NEMO_VERSION;
}

/* =====================================================
   OPEN MODAL
===================================================== */

function openNemoSettings() {

    settingsModal.classList.add("active");

    settingsModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

    /*
     * Always open on User Info
     */
    switchSettingsTab("user");
    

    /*
     * Generate a fresh Voxel avatar
     * every time User Info is opened.
     */
    loadRandomVoxelAvatar();
    loadNeemoUserInfo();
    loadNeemoDailyRequests();
}


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeNemoSettings() {

        settingsModal.classList.remove("active");

        settingsModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    /* =====================================================
       TAB SWITCHING
    ===================================================== */

    function switchSettingsTab(tabName) {

        settingsTabs.forEach(tab => {

            const isActive =
                tab.dataset.settingsTab === tabName;

            tab.classList.toggle(
                "active",
                isActive
            );

        });


        settingsPanels.forEach(panel => {

            const isActive =
                panel.dataset.settingsPanel === tabName;

            panel.classList.toggle(
                "active",
                isActive
            );

        });


        /*
         * Move sliding indicator
         */

       

    }


    /* =====================================================
       SETTINGS BUTTON
    ===================================================== */

    if (settingsBtn) {

        settingsBtn.addEventListener(
            "click",
            openNemoSettings
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeSettingsBtn) {

        closeSettingsBtn.addEventListener(
            "click",
            closeNemoSettings
        );

    }


    /* =====================================================
       BACKDROP CLICK
    ===================================================== */

    if (settingsBackdrop) {

        settingsBackdrop.addEventListener(
            "click",
            closeNemoSettings
        );

    }


    /* =====================================================
       TAB EVENTS
    ===================================================== */

    settingsTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const tabName =
                    tab.dataset.settingsTab;

                switchSettingsTab(tabName);

            }
        );

    });


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                settingsModal.classList.contains("active")
            ) {

                closeNemoSettings();

            }

        }
    );


  /* =====================================================
   BUG FORM
===================================================== */

if (bugForm) {

    bugForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const title =
                document.getElementById(
                    "nemoBugTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "nemoBugDescription"
                ).value.trim();


            const submitButton =
                bugForm.querySelector(
                    ".nemo-raise-bug-btn"
                );


            /* ---------------------------------------------
               VALIDATE INPUT
            --------------------------------------------- */

           if (!title || !description) {

    const titleField =
        document.getElementById(
            "nemoBugTitle"
        );

    const descriptionField =
        document.getElementById(
            "nemoBugDescription"
        );

    const originalTitlePlaceholder =
        titleField.placeholder;

    const originalDescriptionPlaceholder =
        descriptionField.placeholder;


    if (!title) {

        titleField.placeholder =
            "Please provide a title.";

        titleField.classList.add(
            "nemo-validation-error"
        );

    }


    if (!description) {

        descriptionField.placeholder =
            "Please provide a description.";

        descriptionField.classList.add(
            "nemo-validation-error"
        );

    }


    setTimeout(() => {

        if (!title) {

            titleField.placeholder =
                originalTitlePlaceholder;

            titleField.classList.remove(
                "nemo-validation-error"
            );

        }


        if (!description) {

            descriptionField.placeholder =
                originalDescriptionPlaceholder;

            descriptionField.classList.remove(
                "nemo-validation-error"
            );

        }

    }, 3000);


    return;

}


            /* ---------------------------------------------
               PREVENT DUPLICATE SUBMISSIONS
            --------------------------------------------- */

            if (submitButton.disabled) {
                return;
            }


            /* ---------------------------------------------
               SAVE ORIGINAL BUTTON CONTENT
            --------------------------------------------- */

            const originalButtonContent =
                submitButton.innerHTML;


            /* ---------------------------------------------
               SHOW SPINNER
            --------------------------------------------- */

            submitButton.disabled = true;

            submitButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Submitting
            `;


            try {

                /* -----------------------------------------
                   SEND TO LOCAL FLASK
                ----------------------------------------- */

                const response = await fetch(
                    "http://127.0.0.1:3001/raise-neemo-bug",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            title: title,
                            description: description
                        })
                    }
                );


                /* -----------------------------------------
                   CHECK HTTP RESPONSE
                ----------------------------------------- */

                if (!response.ok) {

                    throw new Error(
                        `Request failed with status ${response.status}`
                    );

                }


                const result =
                    await response.json();


                /* -----------------------------------------
                   CHECK API RESPONSE
                ----------------------------------------- */

                if (result.status !== "success") {

                    throw new Error(
                        result.message ||
                        "Failed to submit bug."
                    );

                }


                /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

                submitButton.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Success
                `;


                /*
                 * Clear the form after successful submission.
                 */

                bugForm.reset();


                /*
                 * Keep Success visible briefly,
                 * then restore the button.
                 */

                setTimeout(() => {

                    submitButton.innerHTML =
                        originalButtonContent;

                    submitButton.disabled = false;

                }, 1800);


            } catch (error) {

                console.error(
                    "Failed to submit Neemo bug:",
                    error
                );


                /* -----------------------------------------
                   ERROR
                ----------------------------------------- */

                submitButton.innerHTML = `
                    
                    Error!
                `;


                /*
                 * Restore button after showing Error.
                 */

                setTimeout(() => {

                    submitButton.innerHTML =
                        originalButtonContent;

                    submitButton.disabled = false;

                }, 1800);

            }

        }
    );

}


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    switchSettingsTab("user");
    loadNeemoVersion();
    loadNeemoVersion_footer();

});




