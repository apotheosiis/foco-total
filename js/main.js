document.addEventListener('DOMContentLoaded', () => {
    // ======================= CONFIGURAÇÃO DO GRID =======================
    const grid = GridStack.init({
        column: 12,
        minRow: 1,
        cellHeight: 100, // Cada 'h' equivale a 100px
        float: true,
        disableResize: true, // Blocos com tamanho fixo, apenas móveis
        margin: 15
    });

    // ======================= SELETORES GLOBAIS =======================
    const addWidgetBtn = document.getElementById('add-widget-btn');
    const widgetOptionsMenu = document.getElementById('widget-options');
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const globalSettingsOpeners = document.querySelectorAll('.js-open-settings');
    const focoDurationInput = document.getElementById('foco-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    
    // Armazena o estado/lógica de cada widget individualmente
    const widgetState = new Map();
    // Armazena as configurações globais do timer
    let settings = {};

    // ======================= LÓGICA GLOBAL (DO SEU CÓDIGO ORIGINAL) =======================
    
    // Lógica de Tema (do seu código)
    function applyTheme(theme) {
        const sunIcon = themeSwitcherBtn.querySelector('.fa-sun');
        const moonIcon = themeSwitcherBtn.querySelector('.fa-moon');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if(sunIcon) sunIcon.style.display = 'inline-block';
            if(moonIcon) moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-mode');
            if(sunIcon) sunIcon.style.display = 'none';
            if(moonIcon) moonIcon.style.display = 'inline-block';
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
    
    // Lógica do Modal de Configurações (do seu código)
    function openModal() { if (settingsModal) settingsModal.classList.add('visible'); }
    function closeModal() { if (settingsModal) settingsModal.classList.remove('visible'); }

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
    }

    function saveSettings() {
        settings.foco = parseInt(focoDurationInput.value, 10);
        settings.shortBreak = parseInt(shortBreakDurationInput.value, 10);
        settings.longBreak = parseInt(longBreakDurationInput.value, 10);
        settings.longBreakInterval = parseInt(longBreakIntervalInput.value, 10);
        localStorage.setItem('focoTotalSettings', JSON.stringify(settings));
        alert('Configurações salvas!');
        closeModal();
        // Dispara um evento para que todos os widgets de pomodoro se atualizem
        window.dispatchEvent(new CustomEvent('settingsUpdated'));
    }

    // ======================= "MOLDE" DO WIDGET POMODORO (SUA LÓGICA ORIGINAL) =======================
    function initPomodoroWidget(widgetEl) {
        // Seletores DENTRO do widget
        const timerDisplay = widgetEl.querySelector('.timer-display');
        const startBtn = widgetEl.querySelector('.start-btn');
        const pauseBtn = widgetEl.querySelector('.pause-btn');
        const resetBtn = widgetEl.querySelector('.reset-btn');
        const modeButtons = widgetEl.querySelectorAll('.mode-btn');
        const pomodoroSettingsBtn = widgetEl.querySelector('.js-open-settings-pomodoro');

        // Estado do timer (independente para cada widget)
        let pomodoroCount = 0;
        let currentMode = 'work';
        let timerInterval = null;
        let timeLeft = 0;
        
        // Funções do seu código antigo, agora operando DENTRO do widget
        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            document.title = `${timerDisplay.textContent} - ${currentMode === 'work' ? 'Foco' : 'Pausa'}`;
        }

        function pauseTimer() { 
            clearInterval(timerInterval); 
            timerInterval = null; 
        }

        function switchMode(newMode) {
            pauseTimer();
            currentMode = newMode;
            if (newMode === 'work') timeLeft = settings.foco * 60;
            if (newMode === 'short-break') timeLeft = settings.shortBreak * 60;
            if (newMode === 'long-break') timeLeft = settings.longBreak * 60;
            modeButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === newMode));
            updateDisplay();
        }
        
        function startTimer() {
            if (timerInterval) return;
            timerInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft < 0) {
                    pauseTimer();
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

        // Event Listeners DENTRO do widget
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', () => switchMode(currentMode));
        modeButtons.forEach(button => {
            button.addEventListener('click', () => switchMode(button.dataset.mode));
        });
        if(pomodoroSettingsBtn) pomodoroSettingsBtn.addEventListener('click', openModal);

        window.addEventListener('settingsUpdated', () => switchMode(currentMode));
        
        // FIX: Garante que o timer nunca comece com NaN, carregando o modo padrão
        switchMode('work');
    }

    // ======================= "MOLDE" DO WIDGET TASK LIST (SUA LÓGICA ORIGINAL) =======================
    function initTaskListWidget(widgetEl) {
        const newTaskInput = widgetEl.querySelector('.new-task-input');
        const addTaskBtn = widgetEl.querySelector('.add-task-btn');
        const taskList = widgetEl.querySelector('.task-list');
        const clearCompletedBtn = widgetEl.querySelector('.clear-completed-btn');

        let tasks = JSON.parse(localStorage.getItem('focoTotalTasks')) || [];
        let taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        
        function saveAndRender() {
            localStorage.setItem('focoTotalTasks', JSON.stringify(tasks));
            renderTasks();
        }

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
            saveAndRender();
        }

        function handleTaskClick(e) {
            const listItem = e.target.closest('.task-item');
            if (!listItem) return;
            const taskId = parseInt(listItem.dataset.id, 10);
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            if (e.target.closest('.delete-task-btn')) {
                tasks = tasks.filter(t => t.id !== taskId);
            } else {
                task.completed = !task.completed;
            }
            saveAndRender();
        }

        function clearCompletedTasks() {
            tasks = tasks.filter(t => !t.completed);
            saveAndRender();
        }

        function checkClearCompletedButtonVisibility() {
            const hasCompleted = tasks.some(task => task.completed);
            clearCompletedBtn.style.display = hasCompleted ? 'flex' : 'none';
        }

        addTaskBtn.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
        taskList.addEventListener('click', handleTaskClick);
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);

        renderTasks();
    }

    // ======================= LÓGICA DO DASHBOARD =======================
    
    function createWidgetElement(type, options = {}) {
        let contentHTML = '';
        const deleteBtnHTML = `<button class="widget-delete-btn"><i class="fas fa-times"></i></button>`;
        
        let gridOptions = {};
        if (type === 'pomodoro') {
            gridOptions = { w: 5, h: 5, ...options }; // Quadrado de ~500x500
            contentHTML = `
                <div class="timer-card">
                    ${deleteBtnHTML}
                    <div class="mode-selector">
                        <button class="mode-btn active" data-mode="work">Foco</button>
                        <button class="mode-btn" data-mode="short-break">Pausa Curta</button>
                        <button class="mode-btn" data-mode="long-break">Pausa Longa</button>
                        <button class="icon-btn settings-icon-btn js-open-settings-pomodoro" aria-label="Configurações do Timer"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                    <h1 class="timer-display"></h1>
                    <div class="controls">
                        <button class="start-btn btn"><i class="fas fa-play"></i> Iniciar</button>
                        <button class="pause-btn btn btn-secondary"><i class="fas fa-pause"></i> Pausar</button>
                        <button class="reset-btn btn btn-secondary"><i class="fas fa-redo-alt"></i> Reiniciar</button>
                    </div>
                </div>`;
        } else if (type === 'taskList') {
            gridOptions = { w: 5, h: 5, ...options }; // Um pouco mais largo
            contentHTML = `
                <div class="task-section">
                    ${deleteBtnHTML}
                    <h2>Minhas Tarefas</h2>
                    <div class="task-input-group">
                        <input type="text" class="new-task-input" placeholder="Adicionar nova tarefa...">
                        <button class="add-task-btn btn btn-add"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="task-list-container">
                        <ul class="task-list"></ul>
                    </div>
                    <button class="clear-completed-btn btn btn-secondary" style="display: none;">
                        <i class="fas fa-trash-alt"></i> Limpar Concluídas
                    </button>
                </div>`;
        } else if (type === 'photo') {
            gridOptions = { w: 4, h: 4, ...options };
            contentHTML = `
                ${deleteBtnHTML}
                <p style="padding: 20px; text-align: center;">Bloco de Imagem (a implementar)</p>`;
        }

        const el = document.createElement('div');
        el.innerHTML = contentHTML;
        
        const gridItem = grid.addWidget(el, gridOptions);
        
        if (type === 'pomodoro') {
            initPomodoroWidget(gridItem);
        } else if (type === 'taskList') {
            initTaskListWidget(gridItem);
        }

        const deleteBtn = gridItem.querySelector('.widget-delete-btn');
        if(deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                grid.removeWidget(gridItem);
            });
        }
    }
    
    // ======================= INICIALIZAÇÃO GERAL =======================
    function init() {
        loadTheme();
        loadSettings();

        // Listeners globais
        themeSwitcherBtn.addEventListener('click', toggleTheme);
        globalSettingsOpeners.forEach(btn => btn.addEventListener('click', openModal));
        closeModalBtn.addEventListener('click', closeModal);
        saveSettingsBtn.addEventListener('click', saveSettings);
        settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(); });

        // Listeners do menu de widgets
        addWidgetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = widgetOptionsMenu.style.display === 'none' || widgetOptionsMenu.style.display === '';
            widgetOptionsMenu.style.display = isHidden ? 'flex' : 'none';
        });

        document.querySelectorAll('.widget-option').forEach(button => {
            button.addEventListener('click', (event) => {
                createWidgetElement(event.currentTarget.dataset.widgetType);
                widgetOptionsMenu.style.display = 'none';
            });
        });
        
        document.addEventListener('click', () => {
             if(widgetOptionsMenu) widgetOptionsMenu.style.display = 'none';
        });
        if(widgetOptionsMenu) widgetOptionsMenu.addEventListener('click', (e) => e.stopPropagation());
        
        // Cria os blocos iniciais que você queria
        createWidgetElement('pomodoro', {x: 0, y: 0});
        createWidgetElement('taskList', {x: 5, y: 0});
    }

    init();
});