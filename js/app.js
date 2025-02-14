document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
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
    const CYCLE_COUNT_DISPLAY = document.getElementById('cycle-count'); // NEW
    const CYCLE_TARGET_INPUT = document.getElementById('cycle-target');   // NEW
    const CYCLE_TARGET_DISPLAY = document.getElementById('cycle-target-display'); //NEW

    // --- Variables ---
    let timerInterval = null;
    let timeLeft;
    let totalSeconds;
    let isWorkMode = true;
    let circle;
    let animationPromise = null;
    let cycleCount = 0; // NEW: Current cycle count
    let cycleTarget = 4; // NEW: Default target
    let lastResetDay = null; //NEW

    // --- Progress Bar Initialization ---
    circle = new ProgressBar.Circle('#progress-bar-container', {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1000,
        color: '#4285F4', //  This color is overridden by the gradient
        trailColor: '#ddd',
        trailWidth: 1,
        svgStyle: {
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        },
        text: {
            autoStyleContainer: false
        },
        step: (state, circle) => {
            circle.path.setAttribute('stroke', isWorkMode ? 'url(#workGradient)' : 'url(#breakGradient)');
        }
    });

    // --- Add SVG Gradients (DEFINITIONS) ---
    const svg = circle.svg;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const workGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    workGradient.setAttribute('id', 'workGradient');
    workGradient.setAttribute('x1', '0%');
    workGradient.setAttribute('y1', '0%');
    workGradient.setAttribute('x2', '100%');
    workGradient.setAttribute('y2', '100%');

    const stop1_work = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1_work.setAttribute('offset', '0%');
    stop1_work.setAttribute('stop-color', '#4285F4');
    workGradient.appendChild(stop1_work);

    const stop2_work = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2_work.setAttribute('offset', '100%');
    stop2_work.setAttribute('stop-color', '#e67e22');
    workGradient.appendChild(stop2_work);
    defs.appendChild(workGradient);

    const breakGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    breakGradient.setAttribute('id', 'breakGradient');
    breakGradient.setAttribute('x1', '0%');
    breakGradient.setAttribute('y1', '0%');
    breakGradient.setAttribute('x2', '100%');
    breakGradient.setAttribute('y2', '100%');


    const stop1_break = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1_break.setAttribute('offset', '0%');
    stop1_break.setAttribute('stop-color', '#90caf9');
    breakGradient.appendChild(stop1_break);

    const stop2_break = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2_break.setAttribute('offset', '100%');
    stop2_break.setAttribute('stop-color', '#27ae60');
    breakGradient.appendChild(stop2_break);
    defs.appendChild(breakGradient);


    svg.prepend(defs);


    // --- Helper Functions ---

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        MINUTES_DISPLAY.textContent = String(minutes).padStart(2, '0');
        SECONDS_DISPLAY.textContent = String(seconds).padStart(2, '0');
    }

    async function updateProgressBar() {
        const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 0;
        if (animationPromise) {
            await animationPromise.catch(() => { });
        }
        animationPromise = circle.animate(progress);
    }

    function setMode(mode) {
        isWorkMode = mode === 'work';
        const duration = isWorkMode ? parseInt(WORK_DURATION_INPUT.value) : parseInt(BREAK_DURATION_INPUT.value);

        totalSeconds = duration * 60;
        timeLeft = totalSeconds;

        updateModeLabel();
        updateDisplay();
        updateProgressBar();
        TIMER_DISPLAY.classList.remove('running');

        WORK_MODE_BUTTON.classList.toggle('active', isWorkMode);
        BREAK_MODE_BUTTON.classList.toggle('active', !isWorkMode);

        document.querySelector('meta[name="theme-color"]').setAttribute("content", isWorkMode ? "#4285F4" : "#90caf9");
    }

    function updateModeLabel() {
        MODE_LABEL.textContent = isWorkMode ? 'Work' : 'Break';
    }

    function playNotificationSound() {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(error => console.warn("Audio playback failed:", error));
    }
// --- save, load and update ---
  function saveSettings() {
        localStorage.setItem('workDuration', WORK_DURATION_INPUT.value);
        localStorage.setItem('breakDuration', BREAK_DURATION_INPUT.value);
        localStorage.setItem('isWorkMode', isWorkMode);
        localStorage.setItem('cycleCount', cycleCount); // NEW
        localStorage.setItem('cycleTarget', cycleTarget); // NEW
        localStorage.setItem('lastResetDay', lastResetDay);
    }

   function loadSettings() {
        const savedWorkDuration = localStorage.getItem('workDuration');
        const savedBreakDuration = localStorage.getItem('breakDuration');
        const savedIsWorkMode = localStorage.getItem('isWorkMode');
        const savedCycleCount = localStorage.getItem('cycleCount'); // NEW
        const savedCycleTarget = localStorage.getItem('cycleTarget'); // NEW
        const savedLastResetDay = localStorage.getItem('lastResetDay');


        if (savedWorkDuration) WORK_DURATION_INPUT.value = savedWorkDuration;
        if (savedBreakDuration) BREAK_DURATION_INPUT.value = savedBreakDuration;
        if (savedIsWorkMode !== null) isWorkMode = savedIsWorkMode === 'true';

        if(savedCycleCount) cycleCount = parseInt(savedCycleCount,10);
        if(savedCycleTarget) {
            cycleTarget = parseInt(savedCycleTarget, 10);
            CYCLE_TARGET_INPUT.value = cycleTarget;
        }
        if(savedLastResetDay) lastResetDay = parseInt(savedLastResetDay,10);

        updateCycleDisplay();
    }

     function updateCycleDisplay() {
        CYCLE_COUNT_DISPLAY.textContent = cycleCount;
        CYCLE_TARGET_DISPLAY.textContent = cycleTarget;
    }

    function incrementCycleCount() {
        cycleCount++;
        updateCycleDisplay();
        saveSettings(); // Save after incrementing
        if (cycleCount >= cycleTarget) {
          // alert("Congratulations! You've reached your daily Pomodoro target!"); // optional
        }
    }

    function checkDailyReset() {
        const today = new Date().getDate(); // Get just the day
        if (lastResetDay !== today) {
            cycleCount = 0; // Reset the count
            lastResetDay = today; // Update lastResetDay
             saveSettings();
            updateCycleDisplay(); // Update display after reset
        }
    }
    // --- Main Timer Logic ---
    function startTimer() {
        if (timerInterval) return;

        TIMER_DISPLAY.classList.add('running');
        updateProgressBar();

        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            updateProgressBar();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                playNotificationSound();
                if (isWorkMode) {  // Only increment if it's the *end* of a *work* cycle
                    incrementCycleCount();
                }
                isWorkMode = !isWorkMode;
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
        stopTimer();
        setMode(isWorkMode ? 'work' : 'break');
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
    CYCLE_TARGET_INPUT.addEventListener('change', () => { // NEW
        cycleTarget = parseInt(CYCLE_TARGET_INPUT.value, 10) || 1; // Ensure it's a number
        if (cycleTarget < 1) cycleTarget = 1; // Minimum value
         CYCLE_TARGET_INPUT.value = cycleTarget; //For max and min value.
        updateCycleDisplay();
        saveSettings();
    });


    // --- Initialization ---
    checkDailyReset(); // NEW: Check for reset *before* loading settings
    loadSettings();
    setMode(isWorkMode ? 'work' : 'break');
     updateCycleDisplay();

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js?v=9')
                .then(registration => console.log('Service Worker registered! Scope is: ', registration.scope))
                .catch(err => console.log('Service Worker registration failed: ', err));
        });
    }
});