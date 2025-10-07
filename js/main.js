// js/main.js - Versão Final Corrigida e Funcional

document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos do DOM ---
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const settingsOpeners = document.querySelectorAll('.js-open-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const focoDurationInput = document.getElementById('foco-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    // --- Estado da Aplicação ---
    let settings = {};
    let pomodoroCount = 0;
    let currentMode = 'work';
    let timerInterval = null;
    let timeLeft = 0;
    let tasks = [];
    let taskIdCounter = 1;

    // ======================= LÓGICA DO TEMA =======================
    function applyTheme(theme) {
        const sunIcon = themeSwitcherBtn.querySelector('.fa-sun');
        const moonIcon = themeSwitcherBtn.querySelector('.fa-moon');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            sunIcon.style.display = 'inline-block'; // Sol aparece no modo escuro
            moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-mode');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block'; // Lua aparece no modo claro
        }
    }
    function toggleTheme() {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('focoTotalTheme', newTheme);
        applyTheme(newTheme);
    }
    function loadTheme() {
        const savedTheme = localStorage.getItem('focoTotalTheme') || 'light';
        applyTheme(savedTheme);
    }

    // ======================= LÓGICA DAS CONFIGURAÇÕES =======================
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('focoTotalSettings'));
        settings = {
            foco: savedSettings?.foco || 25,
            shortBreak: savedSettings?.shortBreak || 5,
            longBreak: savedSettings?.longBreak || 30,
            longBreakInterval: savedSettings?.longBreakInterval || 4,
        };
        focoDurationInput.value = settings.foco;
        shortBreakDurationInput.value = settings.shortBreak;
        longBreakDurationInput.value = settings.longBreak;
        longBreakIntervalInput.value = settings.longBreakInterval;
        timeLeft = settings.foco * 60;
    }
    function saveSettings() {
        settings.foco = parseInt(focoDurationInput.value, 10);
        settings.shortBreak = parseInt(shortBreakDurationInput.value, 10);
        settings.longBreak = parseInt(longBreakDurationInput.value, 10);
        settings.longBreakInterval = parseInt(longBreakIntervalInput.value, 10);
        localStorage.setItem('focoTotalSettings', JSON.stringify(settings));
        alert('Configurações salvas!');
        closeModal();
        switchMode('work', true);
    }
    function openModal() { settingsModal.classList.add('visible'); }
    function closeModal() { settingsModal.classList.remove('visible'); }

    // ======================= LÓGICA DO TIMER =======================
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = formattedTime;
        document.title = `${formattedTime} - ${currentMode === 'work' ? 'Foco' : 'Pausa'}`;
    }
    function switchMode(newMode, forceReset = false) {
        pauseTimer();
        currentMode = newMode;
        if (newMode === 'work') timeLeft = settings.foco * 60;
        if (newMode === 'short-break') timeLeft = settings.shortBreak * 60;
        if (newMode === 'long-break') timeLeft = settings.longBreak * 60;
        modeButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === newMode));
        updateDisplay();
        if (forceReset) { pomodoroCount = 0; }
    }
    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                if (currentMode === 'work') {
                    pomodoroCount++;
                    if (pomodoroCount > 0 && pomodoroCount % settings.longBreakInterval === 0) {
                        switchMode('long-break');
                    } else {
                        switchMode('short-break');
                    }
                } else {
                    switchMode('work');
                }
            }
        }, 1000);
    }
    function pauseTimer() { clearInterval(timerInterval); timerInterval = null; }
    function resetTimer() {
        pauseTimer();
        timeLeft = settings[currentMode] * 60;
        updateDisplay();
    }

    // ======================= LÓGICA DAS TAREFAS =======================
    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('focoTotalTasks')) || [];
        taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        renderTasks();
    }
    function saveTasks() { localStorage.setItem('focoTotalTasks', JSON.stringify(tasks)); renderTasks(); }
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.id = task.id;
            listItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            listItem.innerHTML = `<div class="task-content"><span class="task-checkbox"><i class="fas fa-check"></i></span><span class="task-text">${task.text}</span></div><button class="delete-task-btn"><i class="fas fa-times"></i></button>`;
            taskList.appendChild(listItem);
        });
        checkClearCompletedButtonVisibility();
    }
    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;
        tasks.push({ id: taskIdCounter++, text: taskText, completed: false });
        newTaskInput.value = '';
        saveTasks();
    }
    function handleTaskClick(e) {
        const listItem = e.target.closest('.task-item');
        if (!listItem) return;
        const taskId = parseInt(listItem.dataset.id, 10);
        const task = tasks.find(t => t.id === taskId);
        if (e.target.closest('.delete-task-btn')) { tasks = tasks.filter(t => t.id !== taskId); }
        else { task.completed = !task.completed; }
        saveTasks();
    }
    function clearCompletedTasks() { tasks = tasks.filter(task => !task.completed); saveTasks(); }
    function checkClearCompletedButtonVisibility() {
        const hasCompleted = tasks.some(task => task.completed);
        clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
    }

    // ======================= INICIALIZAÇÃO E EVENT LISTENERS =======================
    function init() {
        loadTheme();
        loadSettings();
        loadTasks();
        updateDisplay();

        themeSwitcherBtn.addEventListener('click', toggleTheme);
        settingsOpeners.forEach(btn => btn.addEventListener('click', openModal));
        closeModalBtn.addEventListener('click', closeModal);
        saveSettingsBtn.addEventListener('click', saveSettings);
        settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(); });
        
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        // CORREÇÃO CRÍTICA: O evento de clique nos botões de modo estava faltando
        modeButtons.forEach(button => {
            button.addEventListener('click', () => switchMode(button.dataset.mode));
        });

        addTaskBtn.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
        taskList.addEventListener('click', handleTaskClick);
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }

    init();
});