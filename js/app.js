document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const MINUTES_DISPLAY = document.getElementById('minutes');
    const SECONDS_DISPLAY = document.getElementById('seconds');
    const START_STOP_BUTTON = document.getElementById('start-stop');
    const RESET_BUTTON = document.getElementById('reset');
    const WORK_DURATION_INPUT = document.getElementById('work-duration');
    const BREAK_DURATION_INPUT = document.getElementById('break-duration');
    const WORK_MODE_BUTTON = document.getElementById('work-mode');
    const BREAK_MODE_BUTTON = document.getElementById('break-mode');
    const MODE_LABEL = document.querySelector('.mode-label');
    const TIMER_DISPLAY = document.querySelector('.timer-display');
    const CYCLE_COUNT_DISPLAY = document.getElementById('cycle-count');
    const CYCLE_TARGET_INPUT = document.getElementById('cycle-target');
    const CYCLE_TARGET_DISPLAY = document.getElementById('cycle-target-display');
    const THEME_SELECT = document.getElementById('theme-select');
    const MUSIC_SELECT = document.getElementById('music-select');
    const MUSIC_TOGGLE_BUTTON = document.getElementById('music-toggle'); // NEW
    const BG_MUSIC = document.getElementById('bg-music'); // NEW


    // --- Variables ---
    let timerInterval = null;
    let timeLeft;
    let totalSeconds;
    let isWorkMode = true;
    let circle;
    let animationPromise = null;
    let cycleCount = 0;
    let cycleTarget = 4;
    let lastResetDay = null;
    let isMusicPlaying = false; // NEW: Track music state

    // --- Progress Bar Initialization ---
    circle = new ProgressBar.Circle('#progress-bar-container', {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1000,
        color: '#4285F4',  // This color is overridden by the gradient
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
    const svg = circle.svg; // Get the SVG element created by progressbar.js

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Work Gradient (Blue to Orange)
    const workGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    workGradient.setAttribute('id', 'workGradient');
    workGradient.setAttribute('x1', '0%');
    workGradient.setAttribute('y1', '0%');
    workGradient.setAttribute('x2', '100%');
    workGradient.setAttribute('y2', '100%');

    const stop1_work = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1_work.setAttribute('offset', '0%');
    stop1_work.setAttribute('stop-color', '#4285F4'); // Start: Google Blue
    workGradient.appendChild(stop1_work);

    const stop2_work = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2_work.setAttribute('offset', '100%');
    stop2_work.setAttribute('stop-color', '#e67e22'); // End: Pomodoro Orange
    workGradient.appendChild(stop2_work);

    defs.appendChild(workGradient);

    // Break Gradient (Light Blue to Green)
    const breakGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    breakGradient.setAttribute('id', 'breakGradient');
    breakGradient.setAttribute('x1', '0%');
    breakGradient.setAttribute('y1', '0%');
    breakGradient.setAttribute('x2', '100%');
    breakGradient.setAttribute('y2', '100%');

    const stop1_break = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1_break.setAttribute('offset', '0%');
    stop1_break.setAttribute('stop-color', '#90caf9'); // Start: Light Blue
    breakGradient.appendChild(stop1_break);

    const stop2_break = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2_break.setAttribute('offset', '100%');
    stop2_break.setAttribute('stop-color', '#27ae60'); // End: Green
    breakGradient.appendChild(stop2_break);

    defs.appendChild(breakGradient);

    svg.prepend(defs); // Add the definitions to the SVG *before* the path

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

    // --- NEW: Theme and Music Functions ---

    function applyTheme(theme) {
        // Remove existing theme classes
        document.body.classList.remove('theme-nature', 'theme-space', 'theme-abstract');

        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }
    }

    function setMusic(track) {
      if(track === 'none'){
        BG_MUSIC.src = '';
      }
      else{
        BG_MUSIC.src = `music/${track}.mp3`; //  Path to music files
      }

        // Play/pause based on current state
        if (isMusicPlaying) {
            BG_MUSIC.play().catch(error => console.error("Music playback failed:", error));
        }
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            BG_MUSIC.pause();
            MUSIC_TOGGLE_BUTTON.innerHTML = '<i class="fas fa-music"></i>'; // Music icon
        } else {
            // Only play if a track is selected
            if(BG_MUSIC.src) {
              BG_MUSIC.play().catch(error => console.error("Music playback failed:", error));
               MUSIC_TOGGLE_BUTTON.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }

        }
        isMusicPlaying = !isMusicPlaying; // Toggle the state

    }


    // --- LocalStorage ---
    function saveSettings() {
        localStorage.setItem('workDuration', WORK_DURATION_INPUT.value);
        localStorage.setItem('breakDuration', BREAK_DURATION_INPUT.value);
        localStorage.setItem('isWorkMode', isWorkMode);
        localStorage.setItem('cycleCount', cycleCount);
        localStorage.setItem('cycleTarget', cycleTarget);
        localStorage.setItem('selectedTheme', THEME_SELECT.value);  // NEW
        localStorage.setItem('selectedMusic', MUSIC_SELECT.value); // NEW
        localStorage.setItem('lastResetDay', lastResetDay);
    }

     function loadSettings() {
        const savedWorkDuration = localStorage.getItem('workDuration');
        const savedBreakDuration = localStorage.getItem('breakDuration');
        const savedIsWorkMode = localStorage.getItem('isWorkMode');
        const savedCycleCount = localStorage.getItem('cycleCount');
        const savedCycleTarget = localStorage.getItem('cycleTarget');
        const savedTheme = localStorage.getItem('selectedTheme'); // NEW
        const savedMusic = localStorage.getItem('selectedMusic') || "ambient"; // NEW
        const savedLastResetDay = localStorage.getItem('lastResetDay');


        if (savedWorkDuration) WORK_DURATION_INPUT.value = savedWorkDuration;
        if (savedBreakDuration) BREAK_DURATION_INPUT.value = savedBreakDuration;
        if (savedIsWorkMode !== null) isWorkMode = savedIsWorkMode === 'true';

        if (savedCycleCount) cycleCount = parseInt(savedCycleCount, 10);
        if (savedCycleTarget) {
            cycleTarget = parseInt(savedCycleTarget, 10);
            CYCLE_TARGET_INPUT.value = cycleTarget;
        }
       if(savedLastResetDay) lastResetDay = parseInt(savedLastResetDay,10);

        if (savedTheme) {
            THEME_SELECT.value = savedTheme;
            applyTheme(savedTheme); // Apply the loaded theme
        }

        if (savedMusic && savedMusic !== 'none') {
            MUSIC_SELECT.value = savedMusic;
        } else {
            MUSIC_SELECT.value = "ambient"; // Set default here
        }
        setMusic(MUSIC_SELECT.value); // Set the music *after* setting the value



        updateCycleDisplay(); // NEW: Update the display on load
    }

     function updateCycleDisplay() {
        CYCLE_COUNT_DISPLAY.textContent = cycleCount;
        CYCLE_TARGET_DISPLAY.textContent = cycleTarget;
    }

    function incrementCycleCount() {
        cycleCount++;
        updateCycleDisplay();
        saveSettings();
        if (cycleCount >= cycleTarget) {
            //alert("Congratulations! You've reached your daily Pomodoro target!"); //optional
        }
    }
      function checkDailyReset() {
        const today = new Date().getDate();
        if (lastResetDay !== today) {
            cycleCount = 0;
            lastResetDay = today;
            saveSettings(); // Always save after reset
            updateCycleDisplay();
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
                if (isWorkMode) {
                    incrementCycleCount();
                }
                isWorkMode = !isWorkMode;
                setMode(isWorkMode ? 'work' : 'break');
                startTimer();
            }
        }, 1000);

        START_STOP_BUTTON.innerHTML = '<i class="fas fa-pause"></i>';
    }


    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        TIMER_DISPLAY.classList.remove('running');
        START_STOP_BUTTON.innerHTML = '<i class="fas fa-play"></i>';
    }

    function resetTimer() {
        stopTimer();
        setMode(isWorkMode ? 'work' : 'break');
    }

    // --- Event Listeners ---

    START_STOP_BUTTON.addEventListener('click', () => {
        if (timerInterval) {
            stopTimer();
        } else {
            startTimer();
        }
    });
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
    CYCLE_TARGET_INPUT.addEventListener('change', () => {
        cycleTarget = parseInt(CYCLE_TARGET_INPUT.value, 10) || 1;
        if(cycleTarget < 1) cycleTarget = 1;
        CYCLE_TARGET_INPUT.value = cycleTarget;
        updateCycleDisplay();
        saveSettings();
    });

    // NEW: Event Listeners for Theme and Music
    THEME_SELECT.addEventListener('change', () => {
        applyTheme(THEME_SELECT.value);
        saveSettings(); // Save the selected theme
    });

    MUSIC_SELECT.addEventListener('change', () => {
        setMusic(MUSIC_SELECT.value);
        saveSettings(); // Save the selected music
    });
    MUSIC_TOGGLE_BUTTON.addEventListener('click', toggleMusic);

    // --- Initialization ---
    checkDailyReset();
    loadSettings(); // Load settings (including theme and music)
    setMode(isWorkMode ? 'work' : 'break');
    updateCycleDisplay();

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js?v=10') // CACHE BUST!
                .then(registration => console.log('Service Worker registered! Scope is: ', registration.scope))
                .catch(err => console.log('Service Worker registration failed: ', err));
        });
    }
});