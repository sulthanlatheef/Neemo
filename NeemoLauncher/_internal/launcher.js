(() => {
    const services = ["docker", "controller", "web"];

    const statusText = document.getElementById("statusText");
    const stateText = document.getElementById("stateText");
    const statusDot = document.getElementById("statusDot");
    const progressFill = document.getElementById("progressFill");
    const closeButton = document.getElementById("closeButton");
    const errorOverlay = document.getElementById("errorOverlay");
    const errorMessage = document.getElementById("errorMessage");
    const errorCloseButton = document.getElementById("errorCloseButton");
    const heroImage = document.getElementById("heroImage");
    const heroFallback = document.getElementById("heroFallback");

    const serviceLabels = {
        waiting: "WAITING",
        working: "CHECKING",
        success: "STARTED",
        error: "FAILED",
    };

    function escapeStateClass(element) {
        element.classList.remove("waiting", "working", "success", "error");
    }

    function renderWaitingIcon(target) {
        target.innerHTML = '<span class="waiting-ring"></span>';
    }

    function renderWorkingIcon(target) {
        target.innerHTML = '<span class="spinner"></span>';
    }

    function renderSuccessIcon(target) {
        target.innerHTML = `
            <span class="success-circle">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.8 12.5L10.2 15.8L17.5 8.8"></path>
                </svg>
            </span>
        `;
    }

    function renderErrorIcon(target) {
        target.innerHTML = `
            <span class="error-circle">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 8L16 16"></path>
                    <path d="M16 8L8 16"></path>
                </svg>
            </span>
        `;
    }

    function setService(service, state) {
        const card = document.getElementById(`service-${service}`);
        const icon = card?.querySelector(".service-icon");
        const badge = card?.querySelector(`[data-badge="${service}"]`);

        if (!card || !icon || !badge) {
            return;
        }

        card.classList.remove("waiting", "working", "success", "error");
        badge.classList.remove("waiting", "working", "success", "error");

        const safeState = ["waiting", "working", "success", "error"].includes(state)
            ? state
            : "waiting";

        card.classList.add(safeState);
        badge.classList.add(safeState);
        badge.textContent = serviceLabels[safeState];

        switch (safeState) {
            case "working":
                renderWorkingIcon(icon);
                break;

            case "success":
                renderSuccessIcon(icon);
                break;

            case "error":
                renderErrorIcon(icon);
                break;

            default:
                renderWaitingIcon(icon);
                break;
        }
    }

    function setStatus(text, state = "working") {
        statusText.textContent = text;

        const safeState = ["working", "success", "error"].includes(state)
            ? state
            : "working";

        stateText.classList.remove("success", "error");
        statusDot.classList.remove("working", "success", "error");

        if (safeState === "success") {
            stateText.textContent = "READY";
            stateText.classList.add("success");
            statusDot.classList.add("success");
        } else if (safeState === "error") {
            stateText.textContent = "ERROR";
            stateText.classList.add("error");
            statusDot.classList.add("error");
        } else {
            stateText.textContent = "INITIALIZING";
            statusDot.classList.add("working");
        }
    }

    function setProgress(value) {
        const numericValue = Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );

        progressFill.style.width = `${numericValue}%`;
    }

    function showError(message) {
        errorMessage.textContent =
            message || "Unable to start Neemo.";

        errorOverlay.classList.add("visible");

        errorOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    function closeLauncher() {
        if (window.pywebview && window.pywebview.api) {
            window.pywebview.api.close();
        }
    }

    function initialiseUi() {
        services.forEach((service) => {
            setService(service, "waiting");
        });

        setProgress(0);

        setStatus(
            "Starting Neemo...",
            "working"
        );
    }

    closeButton.addEventListener(
        "click",
        closeLauncher
    );

    errorCloseButton.addEventListener(
        "click",
        closeLauncher
    );

    heroImage.addEventListener(
        "error",
        () => {
            heroImage.style.display = "none";
            heroFallback.style.display = "flex";
        }
    );

    initialiseUi();

    window.addEventListener(
        "pywebviewready",
        () => {
            if (
                window.pywebview &&
                window.pywebview.api
            ) {
                window.pywebview.api.ready();
            }
        }
    );

    // Helpful during direct browser testing
    // where pywebview is not present.
    if (!window.pywebview) {
        setStatus(
            "Waiting for launcher runtime...",
            "working"
        );
    }

    // Expose Python-driven UI functions.
    window.setService = setService;
    window.setStatus = setStatus;
    window.setProgress = setProgress;
    window.showError = showError;

})();