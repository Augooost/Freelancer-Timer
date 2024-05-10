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
    if (interval) {
        pauseTimer();
        button.textContent = '▶';
    } else {
        startTimer();
        button.textContent = '⏸';
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
    document.getElementById('toggleButton').textContent = '▶';
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
    document.getElementById('toggleButton').textContent = '▶';
}

function recordDailyLog() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
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

function formatDate(isoDate) {
    const date = new Date(isoDate);
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

// Initialize log and total time on page load
document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const todayLog = dailyLogs.find(log => log.date === today);
    if (!todayLog) {
        dailyLogs.push({ date: today, seconds: 0 });
        localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
    }
    updateLog();
    updateTotalTime();
});
