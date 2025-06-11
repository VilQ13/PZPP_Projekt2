const timer = new easytimer.Timer();
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const minutesSelect = document.getElementById('minutes');
const modeSelect = document.getElementById('mode');

let selectedMinutes = parseInt(minutesSelect.value);
let mode = modeSelect.value;

function resetTimer() {
    timer.stop();
    localStorage.removeItem('timerState');
    updateInitialDisplay();
}

function updateInitialDisplay() {
    if (mode === 'countdown') {
        timerDisplay.textContent = `${selectedMinutes}:00`;
    } else {
        timerDisplay.textContent = `00:00`;
    }
}

minutesSelect.addEventListener('change', () => {
    selectedMinutes = parseInt(minutesSelect.value);
    resetTimer();
});

modeSelect.addEventListener('change', () => {
    mode = modeSelect.value;
    resetTimer();
});

startBtn.addEventListener('click', () => {
    const startTime = Date.now();
    if (mode === 'countdown') {
        timer.start({ countdown: true, startValues: { minutes: selectedMinutes } });
    } else {
        timer.start({ startValues: { minutes: 0, seconds: 0 } });
    }

    saveState({ running: true, mode, selectedMinutes, startTime, paused: false });
});

pauseBtn.addEventListener('click', () => {
    timer.pause();
    saveState({ ...loadState(), paused: true });
});

resetBtn.addEventListener('click', () => {
    resetTimer();
});

timer.addEventListener('secondsUpdated', () => {
    const values = timer.getTimeValues();
    timerDisplay.textContent = values.toString(['minutes', 'seconds']);
});

timer.addEventListener('targetAchieved', () => {
    timerDisplay.textContent = "Koniec!";
    localStorage.removeItem('timerState');
});

// === LocalStorage Logic ===

function saveState(state) {
    const currentTime = timer.getTotalTimeValues().seconds;
    const saveData = {
        ...state,
        savedSeconds: currentTime,
        timestamp: Date.now()
    };
    localStorage.setItem('timerState', JSON.stringify(saveData));
}

function loadState() {
    const data = localStorage.getItem('timerState');
    return data ? JSON.parse(data) : null;
}

function restoreTimer() {
    const saved = loadState();
    if (!saved || !saved.running) {
        updateInitialDisplay();
        return;
    }

    
    modeSelect.value = saved.mode;
    minutesSelect.value = saved.selectedMinutes;

    mode = modeSelect.value;
    selectedMinutes = parseInt(minutesSelect.value);

    const now = Date.now();

    if (mode === 'countdown') {
        const endTime = saved.startTime + selectedMinutes * 60 * 1000;
        const remainingMs = endTime - now;
        const remainingSeconds = Math.floor(remainingMs / 1000);

        if (remainingSeconds <= 0) {
            timerDisplay.textContent = "Koniec!";
            localStorage.removeItem('timerState');
        } else {
            timer.start({ countdown: true, startValues: { seconds: remainingSeconds } });
        }

    } else {
        let resumeSeconds = saved.savedSeconds;
        if (!saved.paused) {
            const elapsedSeconds = Math.floor((now - saved.timestamp) / 1000);
            resumeSeconds += elapsedSeconds;
        }
        timer.start({ startValues: { seconds: resumeSeconds } });
    }
}


// === Init ===
const state = loadState();
if (state && state.running) {
    restoreTimer();
} else {
    updateInitialDisplay();
}
