
// Format Time to MM:SS
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Reset Timer to 5 Minutes
const resetTimer = (setIsRunning, setTime, startTime) => {
    setIsRunning(false); // Pause the timer
    setTime(startTime); // Set to 5 minutes
};

// Start Timer
const startTimer = (setIsRunning) => {
    setIsRunning(true);
};

export {
    formatTime,
    resetTimer,
    startTimer
}