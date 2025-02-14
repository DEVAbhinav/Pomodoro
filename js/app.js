document.addEventListener('DOMContentLoaded', () => {
    // --- Constants (Good Practice: ALL_CAPS for constants) ---
    const MINUTES_DISPLAY = document.getElementById('minutes');
    const SECONDS_DISPLAY = document.getElementById('seconds');
    const START_BUTTON = document.getElementById('start');
    const STOP_BUTTON = document.getElementById('stop');
    const RESET_BUTTON = document.getElementById('reset');
    const WORK_DURATION_INPUT = document.getElementById('work-duration');
    const BREAK_DURATION_INPUT = document.getElementById('break-duration');
    const WORK_MODE_BUTTON = document.getElementById('work-mode');
    const BREAK_MODE_BUTTON = document.getElementById('break-mode');
    const MODE_LABEL = document.querySelector('.mode-label');
    const TIMER_DISPLAY = document.querySelector('.timer-display');

    // --- Variables ---
    let timerInterval = null; // Initialize to null
    let timeLeft;
    let totalSeconds;
    let isWorkMode = true;
    let circle; // Declare outside, initialize later
    let animationPromise = null; // Store the animation Promise


    // --- Progress Bar Initialization ---
    // Initialize *after* DOMContentLoaded (very important)
    circle = new ProgressBar.Circle('#progress-bar-container', {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1000, // Keep at 1000ms
        color: '#e67e22', // Initial color
        trailColor: '#ddd',
        trailWidth: 1,
        svgStyle: {
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        },
        text: {
            autoStyleContainer: false // Good practice
        },
    });


    // --- Helper Functions ---

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        MINUTES_DISPLAY.textContent = String(minutes).padStart(2, '0');
        SECONDS_DISPLAY.textContent = String(seconds).padStart(2, '0');
    }

   async function updateProgressBar() {
        const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0;

        // Await any previous animation before starting a new one
        if (animationPromise) {
            await animationPromise.catch(() => {}); // Ignore rejections, just wait
        }

        animationPromise = circle.animate(progress); // Store the new Promise

        // Optional:  You *could* add a .then() here if you needed to do
        // something *after* the animation completes, but it's not required
        // for the basic timer functionality.
        // animationPromise.then(() => { /* do something after animation */ });
    }

      function setMode(mode) {
        isWorkMode = mode === 'work';
        const duration = isWorkMode ? parseInt(WORK_DURATION_INPUT.value) : parseInt(BREAK_DURATION_INPUT.value);

        // *** KEY CHANGE: Use totalSeconds, not minutes * 60 ***
        totalSeconds = duration * 60;
        timeLeft = totalSeconds;

        // Update progress bar color IMMEDIATELY
        circle.path.setAttribute('stroke', isWorkMode ? '#e67e22' : '#27ae60');

        updateModeLabel();
        updateDisplay();
        updateProgressBar(); // Update *immediately*
        TIMER_DISPLAY.classList.remove('running');

        WORK_MODE_BUTTON.classList.toggle('active', isWorkMode);
        BREAK_MODE_BUTTON.classList.toggle('active', !isWorkMode);

        // Update theme-color
        document.querySelector('meta[name="theme-color"]').setAttribute("content", isWorkMode ? "#e67e22" : "#27ae60");
    }

      function updateModeLabel() {
        MODE_LABEL.textContent = isWorkMode ? 'Work' : 'Break';
      }


    function playNotificationSound() {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(error => console.warn("Audio playback failed:", error));
    }

    function saveSettings() {
        localStorage.setItem('workDuration', WORK_DURATION_INPUT.value);
        localStorage.setItem('breakDuration', BREAK_DURATION_INPUT.value);
        localStorage.setItem('isWorkMode', isWorkMode);
    }

    function loadSettings() {
        const savedWorkDuration = localStorage.getItem('workDuration');
        const savedBreakDuration = localStorage.getItem('breakDuration');
        const savedIsWorkMode = localStorage.getItem('isWorkMode');

        if (savedWorkDuration) WORK_DURATION_INPUT.value = savedWorkDuration;
        if (savedBreakDuration) BREAK_DURATION_INPUT.value = savedBreakDuration;
        if (savedIsWorkMode !== null) isWorkMode = savedIsWorkMode === 'true';
    }

    // --- Main Timer Logic ---
 function startTimer() {
    // Prevent multiple timers
    if (timerInterval) {
      return;
    }


    TIMER_DISPLAY.classList.add('running');

     // Initialize progress bar to current timeLeft
    updateProgressBar();

    timerInterval = setInterval(() => {
        timeLeft--;
         updateDisplay();
        updateProgressBar(); // Update progress *every* second

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            playNotificationSound();
            isWorkMode = !isWorkMode; // Toggle mode
            setMode(isWorkMode ? 'work' : 'break');
            startTimer();
        }
    }, 1000);

    START_BUTTON.innerHTML = '<i class="fas fa-pause"></i>';
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    TIMER_DISPLAY.classList.remove('running');
    START_BUTTON.innerHTML = '<i class="fas fa-play"></i>';
}

function resetTimer() {
    stopTimer(); // Stop any running timer
    setMode(isWorkMode ? 'work' : 'break'); // Reset to current mode
}

    // --- Event Listeners ---

    START_BUTTON.addEventListener('click', () => {
    if (timerInterval) {
      stopTimer();
    } else {
      startTimer();
    }
  });
    STOP_BUTTON.addEventListener('click', stopTimer);
    RESET_BUTTON.addEventListener('click', resetTimer);

    WORK_DURATION_INPUT.addEventListener('change', () => {
        saveSettings();
        resetTimer();
    });
    BREAK_DURATION_INPUT.addEventListener('change', () => {
        saveSettings();
        resetTimer();
    });

    WORK_MODE_BUTTON.addEventListener('click', () => setMode('work'));
    BREAK_MODE_BUTTON.addEventListener('click', () => setMode('break'));

    // --- Initialization ---

    loadSettings();
    setMode(isWorkMode ? 'work': 'break'); // Set initial mode and time


    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js?v=7')  // CACHE BUST!
                .then(registration => console.log('Service Worker registered! Scope is: ', registration.scope))
                .catch(err => console.log('Service Worker registration failed: ', err));
        });
    }
});