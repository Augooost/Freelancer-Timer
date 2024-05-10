let seconds = 0;
let interval = null;
let dailyLogs = JSON.parse(localStorage.getItem('dailyLogs')) || [];

function timer() {
    seconds++;
    updateDisplay(seconds, 'hours', 'minutes', 'seconds');
}

function pad(value) {
    return value < 10 ? '0' + value : value;
}

function updateDisplay(totalSeconds, hoursId, minutesId, secondsId) {
    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds - (hrs * 3600)) / 60);
    let secs = totalSeconds % 60;

    if (hoursId === 'total-time') {
        document.getElementById(hoursId).textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    } else {
        document.getElementById(hoursId).textContent = pad(hrs);
        document.getElementById(minutesId).textContent = pad(mins);
        document.getElementById(secondsId).textContent = pad(secs);
    }
}

function toggleTimer() {
    const button = document.getElementById('toggleButton');
    const icon = button.querySelector('.material-symbols-outlined');
    if (interval) {
        pauseTimer();
        icon.textContent = 'play_arrow';
    } else {
        startTimer();
        icon.textContent = 'pause';
    }
}

function startTimer() {
    if (interval) {
        return;
    }
    interval = setInterval(timer, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function stopTimer() {
    pauseTimer();
    recordDailyLog();
    seconds = 0;
    updateDisplay(seconds, 'hours', 'minutes', 'seconds');
    const button = document.getElementById('toggleButton');
    const icon = button.querySelector('.material-symbols-outlined');
    icon.textContent = 'play_arrow';
}

function resetAll() {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    dailyLogs = [];
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
    updateDisplay(seconds, 'hours', 'minutes', 'seconds');
    updateLog();
    updateTotalTime();
    const button = document.getElementById('toggleButton');
    const icon = button.querySelector('.material-symbols-outlined');
    icon.textContent = 'play_arrow';
}

function recordDailyLog() {
    const now = new Date();
    const today = getFormattedDate(now);
    const todayLog = dailyLogs.find(log => log.date === today);

    if (todayLog) {
        todayLog.seconds += seconds;
    } else {
        dailyLogs.push({ date: today, seconds: seconds });
    }

    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
    updateLog();
    updateTotalTime();
}

function updateLog() {
    const logElement = document.getElementById('log');
    logElement.innerHTML = '';
    dailyLogs.forEach(log => {
        const logItem = document.createElement('li');
        logItem.textContent = `${formatDate(log.date)} — ${formatTime(log.seconds)}`;
        logElement.appendChild(logItem);
    });
}

function updateTotalTime() {
    const totalSeconds = dailyLogs.reduce((total, log) => total + log.seconds, 0);
    updateDisplay(totalSeconds, 'total-time', 'total-time', 'total-time');
}

function formatTime(totalSeconds) {
    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds - (hrs * 3600)) / 60);
    return `${hrs}Hr ${mins}min`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const daySuffix = getDaySuffix(day);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return `${date.toLocaleDateString('en-US', options).replace(/\d+/, `${day}${daySuffix}`)}`;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-indexed
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
}

function updateCurrentDate() {
    const now = new Date();
    const formattedDate = formatDate(now);
    document.getElementById('currentDate').textContent = formattedDate;
}

// Initialize log, total time, and current date on page load
document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const today = getFormattedDate(now);
    const todayLog = dailyLogs.find(log => log.date === today);
    if (!todayLog) {
        dailyLogs.push({ date: today, seconds: 0 });
        localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
    }
    updateLog();
    updateTotalTime();
    updateCurrentDate();
});
