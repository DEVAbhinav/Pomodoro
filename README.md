# Pomodoro Timer - A Free, Offline-Capable PWA for Focused Work

[![GitHub license](https://img.shields.io/github/license/YOUR_GITHUB_USERNAME/your-repository-name)](https://github.com/YOUR_GITHUB_USERNAME/your-repository-name/blob/main/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/YOUR_GITHUB_USERNAME/your-repository-name)](https://github.com/YOUR_GITHUB_USERNAME/your-repository-name/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_GITHUB_USERNAME/your-repository-name)](https://github.com/YOUR_GITHUB_USERNAME/your-repository-name/network)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdevabhinav.github.io%2Fpomodoro%2F)](https://devabhinav.github.io/pomodoro/) ## Overview

This project is a free, online, and offline-capable **Pomodoro Timer** built as a **Progressive Web App (PWA)**.  It helps you implement the **Pomodoro Technique**, a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This PWA is designed to be simple, elegant, and effective, allowing you to boost your **productivity** and **focus** without any distractions.  It's built with HTML, CSS (using Material Design Lite), and JavaScript (vanilla JS – no frameworks).

## Features

*   **Customizable Work and Break Intervals:** Set your preferred work and short break durations.
*   **Cycle Tracking:** Track the number of Pomodoro cycles you complete each day.
*   **Daily Cycle Target:** Set a daily goal for the number of Pomodoro cycles.
*   **Automatic Daily Reset:** The cycle counter automatically resets each day.
*   **Multiple Themes:** Choose from several visually appealing background themes (Space, Nature, Abstract, Default).
*   **Ambient Music:** Select from a range of ambient music tracks (Lofi, Ambient, Classical, or None) to help you focus.
*   **Volume Control:** Adjust the background music volume with a built-in slider.
*   **Notification Sound:**  A subtle notification sound alerts you when a work or break period ends.
*   **Offline Functionality:**  Thanks to the Service Worker, the app works perfectly even without an internet connection after the initial load.
*   **Installable (PWA):** Add the app to your home screen on iOS and Android for a native app-like experience.
*   **Responsive Design:**  Works seamlessly on desktops, tablets, and mobile phones.
*   **Open Source:** The code is available on GitHub, allowing for contributions and modifications.
*  **Dark Theme**

## Live Demo

Try the live demo here: [https://devabhinav.github.io/pomodoro/](https://devabhinav.github.io/pomodoro/)  (Replace with your *actual* deployed URL!)

## Screenshots

![Pomodoro Timer Screenshot](images/screenshot.png) ## How to Use

1.  **Set Your Durations:** Adjust the "Work" and "Break" durations using the input fields.
2.  **Set Your Target Cycles:** Adjust the "Target cycles".
3.  **Choose a Theme (Optional):** Select a background theme from the "Theme" dropdown.
4.  **Choose Music (Optional):** Select a background music track from the "Music" dropdown, or choose "None" for silence.  Use the music toggle button to play/pause and the slider to control the volume.
5.  **Start the Timer:** Click the "Play/Pause" button to begin your Pomodoro session.
6.  **Focus!**  Work diligently during the work interval.
7.  **Take a Break:** When the timer reaches zero, a notification sound will play, and the timer will automatically switch to the break interval.
8.  **Repeat:** Continue the cycle of work and break periods. The app automatically tracks your completed cycles.
9. **Add the Home Screen:** For easy access.

## Installation (PWA - Add to Home Screen)

This Pomodoro Timer is a Progressive Web App, meaning you can "install" it on your device for a native app-like experience (offline access, home screen icon, full-screen mode).

**iOS (Safari):**

1.  Open the PWA in Safari.
2.  Tap the Share button (square with an arrow pointing up).
3.  Tap "Add to Home Screen".
4.  Tap "Add".

**Android (Chrome):**

1.  Open the PWA in Chrome.
2.  Tap the three-dot menu (usually in the top-right corner).
3.  Tap "Add to Home screen" (or "Install app" - the wording may vary).
4.  Confirm the installation.

## Technologies Used

*   HTML5
*   CSS3 (with Material Design Lite for styling)
*   JavaScript (Vanilla JS - no frameworks)
*   Service Workers (for offline functionality)
*   Web App Manifest (for PWA installability)
*   progressbar.js (for the circular progress bar)
*   localStorage (for saving user settings)

## Local Development (for Developers)

If you want to run the project locally or contribute to its development:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_GITHUB_USERNAME/your-repository-name.git](https://www.google.com/search?q=https://github.com/YOUR_GITHUB_USERNAME/your-repository-name.git)
    cd your-repository-name
    ```
2.  **Install a Local Web Server:** You *must* use a local web server (Service Workers require it).  Here are a few options:
    *   **Python:**
        ```bash
        python3 -m http.server
        ```
    *   **Node.js (`http-server` - recommended):**
        ```bash
        npm install -g http-server
        http-server -c-1  # The -c-1 disables caching, which is important for development
        ```
    *  **Live Server VS Code Extension**
3.  **Open in Browser:**  Open `http://localhost:8000` (or the port specified by your server) in your browser.

## Contributing

Contributions are welcome!  If you find a bug, have a feature suggestion, or want to improve the code, please feel free to open an issue or submit a pull request on GitHub.

## License

This project is licensed under the [MIT License](LICENSE) - see the `LICENSE` file for details.  (You'll need to create a `LICENSE` file if you choose to use a license.)

## Author

Your Name (and your GitHub profile link, e.g., [https://github.com/yourusername](https://github.com/yourusername))

---