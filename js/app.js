document.addEventListener('DOMContentLoaded', () => {
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
      const workModeButton = document.getElementById('work-mode');
      const breakModeButton = document.getElementById('break-mode');
  
  
    let timerInterval;
    let timeLeft;
    let isWorkMode = true; // Start in work mode
  
      function updateDisplay() {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          minutesDisplay.textContent = String(minutes).padStart(2, '0');
          secondsDisplay.textContent = String(seconds).padStart(2, '0');
      }
  
    function startTimer() {
      if (timerInterval) return; // Prevent multiple timers
  
      timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
  
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          playNotificationSound(); // Add a notification sound
          // Switch modes automatically
          isWorkMode = !isWorkMode;
          setMode(isWorkMode ? 'work' : 'break');
          startTimer(); // Start the next timer (break or work)
  
        }
      }, 1000);
    }
  
    function stopTimer() {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  
      function resetTimer() {
          stopTimer();
          setMode(isWorkMode ? 'work' : 'break'); //keep the current mode when resetting.
      }
  
      function setMode(mode) {
          isWorkMode = mode === 'work';
          const duration = isWorkMode ? parseInt(workDurationInput.value) : parseInt(breakDurationInput.value);
          timeLeft = duration * 60;
          updateDisplay();
  
          workModeButton.classList.toggle('active', isWorkMode);
          breakModeButton.classList.toggle('active', !isWorkMode);
  
          if(isWorkMode){
            document.querySelector('meta[name="theme-color"]').setAttribute("content", "#e67e22");
          } else {
            document.querySelector('meta[name="theme-color"]').setAttribute("content", "#27ae60");
          }
      }
  
      function playNotificationSound() {
        const audio = new Audio('/notification.mp3'); // Replace with your sound file
          audio.play().catch(error => {
              console.warn("Audio playback failed:", error); // Handle autoplay restrictions
          });
      }
  
  
      startButton.addEventListener('click', startTimer);
      stopButton.addEventListener('click', stopTimer);
      resetButton.addEventListener('click', resetTimer);
      workDurationInput.addEventListener('change', resetTimer);
      breakDurationInput.addEventListener('change', resetTimer);
      workModeButton.addEventListener('click', () => setMode('work'));
      breakModeButton.addEventListener('click', () => setMode('break'));
  
      // Initial setup
      setMode('work');
       // Service Worker Registration (moved here for better organization)
      if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                  .then(registration => {
                      console.log('Service Worker registered! Scope is: ', registration.scope);
                  })
                  .catch(err => {
                      console.log('Service Worker registration failed: ', err);
                  });
          });
      }
  });