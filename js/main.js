document.addEventListener('DOMContentLoaded', function () {
    // ======================= INICIALIZAÇÃO GLOBAL =======================
    const grid = GridStack.init({
        column: 12,
        minRow: 1,
        cellHeight: 100,
        float: true,
        disableResize: false, // Permitindo controle individual por widget
        margin: 15
    });

    const widgetState = new Map();
    let globalSettings = {};

    // ======================= SELETORES GLOBAIS =======================
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const generalSettingsBtn = document.getElementById('general-settings-btn');
    const addWidgetBtn = document.getElementById('add-widget-btn');
    const widgetOptionsMenu = document.getElementById('widget-options');
    const focoDurationInput = document.getElementById('foco-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    
    // ======================= LÓGICA DE TEMA E MODAL (ESTÁVEL) =======================
    function applyTheme(theme) {
        const sunIcon = themeSwitcherBtn.querySelector('.fa-sun');
        const moonIcon = themeSwitcherBtn.querySelector('.fa-moon');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (sunIcon) sunIcon.style.display = 'inline-block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-mode');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'inline-block';
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
    function openModal() { if (settingsModal) settingsModal.classList.add('visible'); }
    function closeModal() { if (settingsModal) settingsModal.classList.remove('visible'); }
    function saveGlobalSettings() {
        globalSettings.foco = parseInt(focoDurationInput.value, 10) || 25;
        globalSettings.shortBreak = parseInt(shortBreakDurationInput.value, 10) || 5;
        globalSettings.longBreak = parseInt(longBreakDurationInput.value, 10) || 30;
        globalSettings.longBreakInterval = parseInt(longBreakIntervalInput.value, 10) || 4;
        localStorage.setItem('focoTotalSettings', JSON.stringify(globalSettings));
        alert('Configurações salvas!');
        closeModal();
        window.dispatchEvent(new CustomEvent('settingsUpdated'));
    }
    function loadGlobalSettings() {
        let savedSettings = {};
        try { savedSettings = JSON.parse(localStorage.getItem('focoTotalSettings')) || {}; } 
        catch (e) { console.error("Erro ao carregar configurações."); }
        globalSettings = {
            foco: savedSettings.foco || 25,
            shortBreak: savedSettings.shortBreak || 5,
            longBreak: savedSettings.longBreak || 30,
            longBreakInterval: savedSettings.longBreakInterval || 4,
        };
        focoDurationInput.value = globalSettings.foco;
        shortBreakDurationInput.value = globalSettings.shortBreak;
        longBreakDurationInput.value = globalSettings.longBreak;
        longBreakIntervalInput.value = globalSettings.longBreakInterval;
    }

    // ======================= LÓGICA DO DASHBOARD =======================
    function createWidgetElement(type, widgetData = {}) {
        const deleteBtnHTML = `<button class="widget-delete-btn"><i class="fas fa-times"></i></button>`;
        let gridOptions = {};

        // MUDANÇA CRÍTICA: O HTML agora é gerado e passado para a opção 'content' do GridStack
        switch (type) {
            case 'pomodoro':
                gridOptions = { w: 4, h: 4, noResize: true, ...widgetData }; 
                gridOptions.content = `<div class="timer-card">${deleteBtnHTML}<div class="mode-selector"><button class="mode-btn active" data-mode="work">Foco</button><button class="mode-btn" data-mode="short-break">Pausa Curta</button><button class="mode-btn" data-mode="long-break">Pausa Longa</button><button class="icon-btn settings-icon-btn js-open-pomodoro-settings" aria-label="Configurações do Timer"><i class="fas fa-ellipsis-v"></i></button></div><h1 class="timer-display">--:--</h1><div class="controls"><button class="start-btn btn"><i class="fas fa-play"></i> Iniciar</button><button class="pause-btn btn btn-secondary"><i class="fas fa-pause"></i> Pausar</button><button class="reset-btn btn btn-secondary"><i class="fas fa-redo-alt"></i> Reiniciar</button></div></div>`;
                break;
            case 'taskList':
                gridOptions = { w: 5, h: 4, minH: 4, auto: true, ...widgetData };
                gridOptions.content = `<div class="task-section">${deleteBtnHTML}<h2>Minhas Tarefas</h2><div class="task-input-group"><input type="text" class="new-task-input" placeholder="Adicionar nova tarefa..."><button class="add-task-btn btn btn-add"><i class="fas fa-plus"></i></button></div><div class="task-list-container"><ul class="task-list"></ul></div><button class="clear-btn btn btn-secondary" style="display: none;"><i class="fas fa-trash-alt"></i> Limpar Concluídas</button></div>`;
                break;
            case 'music':
                gridOptions = { w: 6, h: 4, minH: 4, ...widgetData };
                const videoId = widgetData.content;
                if (videoId) {
                    gridOptions.content = `<div class="music-section">${deleteBtnHTML}<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                } else {
                    gridOptions.content = `<div class="music-section">${deleteBtnHTML}<div class="music-input-container"><h3>Player de Música</h3><input type="text" class="music-url-input" placeholder="Cole a URL do YouTube aqui..."><button class="music-save-btn btn">Carregar</button></div></div>`;
                }
                break;
            case 'photo':
                gridOptions = { w: 4, h: 4, minH: 3, ...widgetData };
                const bgImage = widgetData.content ? `style="background-image: url(${widgetData.content})"` : '';
                gridOptions.content = `<div class="photo-section" ${bgImage}>${deleteBtnHTML}<input type="file" class="photo-input" accept="image/*" />${!widgetData.content ? '<div class="photo-placeholder"><i class="fas fa-plus"></i><span>Adicionar Imagem</span></div>' : ''}</div>`;
                break;
        }

        // MUDANÇA CRÍTICA: O widget é criado com seu conteúdo de uma só vez.
        const newWidgetEl = grid.addWidget(gridOptions);
        newWidgetEl.dataset.widgetType = type;
        
        initializeWidget(newWidgetEl, type, widgetData);
    }
    
    function initializeWidget(widgetEl, type, widgetData) {
        const id = widgetEl.getAttribute('gs-id');
        const deleteBtn = widgetEl.querySelector('.widget-delete-btn');
        if (deleteBtn) deleteBtn.addEventListener('click', () => { 
            widgetState.delete(id); 
            grid.removeWidget(widgetEl); 
        });

        if (type === 'pomodoro') { initPomodoroWidget(widgetEl); } 
        else if (type === 'taskList') { initTaskListWidget(widgetEl, widgetData); }
        else if (type === 'music') { initMusicWidget(widgetEl, widgetData); }
        else if (type === 'photo') { initPhotoWidget(widgetEl); }
    }
    
    function initPomodoroWidget(widgetEl) {
        const timerDisplay = widgetEl.querySelector('.timer-display');
        const startBtn = widgetEl.querySelector('.start-btn');
        const pauseBtn = widgetEl.querySelector('.pause-btn');
        const resetBtn = widgetEl.querySelector('.reset-btn');
        const modeButtons = widgetEl.querySelectorAll('.mode-btn');
        const pomodoroSettingsBtn = widgetEl.querySelector('.js-open-pomodoro-settings');
        let pomodoroCount = 0, currentMode = 'work', timerInterval = null, timeLeft = 0;
        
        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        function pauseTimer() { clearInterval(timerInterval); timerInterval = null; }
        function switchMode(newMode) {
            pauseTimer(); currentMode = newMode;
            if (newMode === 'work') timeLeft = globalSettings.foco * 60;
            if (newMode === 'short-break') timeLeft = globalSettings.shortBreak * 60;
            if (newMode === 'long-break') timeLeft = globalSettings.longBreak * 60;
            modeButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === newMode));
            updateDisplay();
        }
        function startTimer() {
            if (timerInterval) return;
            timerInterval = setInterval(() => {
                timeLeft--; updateDisplay();
                if (timeLeft < 0) {
                    pauseTimer();
                    if (currentMode === 'work') {
                        pomodoroCount++;
                        if (pomodoroCount > 0 && pomodoroCount % globalSettings.longBreakInterval === 0) { switchMode('long-break'); } 
                        else { switchMode('short-break'); }
                    } else { switchMode('work'); }
                }
            }, 1000);
        }
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', () => switchMode(currentMode));
        modeButtons.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));
        if(pomodoroSettingsBtn) pomodoroSettingsBtn.addEventListener('click', openModal);
        window.addEventListener('settingsUpdated', () => switchMode(currentMode));
        switchMode('work');
    }

    function initTaskListWidget(widgetEl, widgetData) {
        const state = { tasks: widgetData.content || [] };
        widgetState.set(widgetEl.getAttribute('gs-id'), state);
        
        const newTaskInput = widgetEl.querySelector('.new-task-input');
        const addTaskBtn = widgetEl.querySelector('.add-task-btn');
        const taskList = widgetEl.querySelector('.task-list');
        const clearCompletedBtn = widgetEl.querySelector('.clear-completed-btn');
        let taskIdCounter = state.tasks.length > 0 ? (Math.max(...state.tasks.map(t => t.id)) + 1) : 1;
        
        function saveAndRender() { saveDashboard(); renderTasks(); }
        function renderTasks() {
            taskList.innerHTML = '';
            state.tasks.forEach(task => {
                const li = document.createElement('li');
                li.dataset.id = task.id; li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `<div class="task-content"><span class="task-checkbox"><i class="fas fa-check"></i></span><span class="task-text">${task.text}</span></div><button class="delete-task-btn"><i class="fas fa-times"></i></button>`;
                taskList.appendChild(li);
            });
            checkClearCompletedButtonVisibility();
        }
        function addTask() {
            const taskText = newTaskInput.value.trim();
            if (taskText === '') return;
            state.tasks.push({ id: taskIdCounter++, text: taskText, completed: false });
            newTaskInput.value = ''; saveAndRender();
        }
        function handleTaskClick(e) {
            const listItem = e.target.closest('.task-item'); if (!listItem) return;
            const taskId = parseInt(listItem.dataset.id, 10);
            if (e.target.closest('.delete-task-btn')) { state.tasks = state.tasks.filter(t => t.id !== taskId); } 
            else { const task = state.tasks.find(t => t.id === taskId); if (task) task.completed = !task.completed; }
            saveAndRender();
        }
        function clearCompletedTasks() { state.tasks = state.tasks.filter(t => !t.completed); saveAndRender(); }
        function checkClearCompletedButtonVisibility() {
            const hasCompleted = state.tasks.some(task => task.completed);
            clearCompletedBtn.style.display = hasCompleted ? 'flex' : 'none';
        }
        addTaskBtn.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
        taskList.addEventListener('click', handleTaskClick);
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        renderTasks();
    }
    
    function initPhotoWidget(widgetEl) {
        const photoSection = widgetEl.querySelector('.photo-section');
        const photoInput = widgetEl.querySelector('.photo-input');
        const placeholder = widgetEl.querySelector('.photo-placeholder');

        photoSection.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', (event) => {
            const file = event.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                photoSection.style.backgroundImage = `url(${e.target.result})`;
                if (placeholder) placeholder.style.display = 'none';
                saveDashboard();
            };
            reader.readAsDataURL(file);
        });
    }

    function initMusicWidget(widgetEl, widgetData) {
        const state = { videoId: widgetData.content || null };
        widgetState.set(widgetEl.getAttribute('gs-id'), state);
        const musicSection = widgetEl.querySelector('.music-section');
        const saveBtn = widgetEl.querySelector('.music-save-btn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const urlInput = widgetEl.querySelector('.music-url-input');
                const url = urlInput.value;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (videoId) {
                    state.videoId = videoId;
                    const iframeHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    musicSection.innerHTML = `<button class="widget-delete-btn"><i class="fas fa-times"></i></button>` + iframeHTML;
                    musicSection.querySelector('.widget-delete-btn').addEventListener('click', () => { widgetState.delete(widgetEl.getAttribute('gs-id')); grid.removeWidget(widgetEl); });
                    saveDashboard();
                } else { alert("URL do YouTube inválida!"); }
            });
        }
    }
    
    function saveDashboard() {
        const widgetsData = grid.save(false);
        widgetsData.forEach(node => {
            const el = document.getElementById(node.id);
            if (!el) return;
            node.type = el.dataset.widgetType;
            const state = widgetState.get(node.id);

            if (state) {
                if (node.type === 'taskList') node.content = state.tasks;
                if (node.type === 'music') node.content = state.videoId;
                if (node.type === 'photo') {
                    const bgImage = el.querySelector('.photo-section').style.backgroundImage;
                    node.content = bgImage ? bgImage.slice(5, -2) : '';
                }
            }
        });
        localStorage.setItem('focoTotalDashboard', JSON.stringify(widgetsData));
    }
    function loadDashboard() {
        let savedData = [];
        try { savedData = JSON.parse(localStorage.getItem('focoTotalDashboard')) || []; } 
        catch (e) { localStorage.removeItem('focoTotalDashboard'); }

        if (savedData && savedData.length > 0) {
            grid.removeAll(false);
            savedData.forEach(widgetData => createWidgetElement(widgetData.type, widgetData));
        } else {
            createWidgetElement('pomodoro', { x: 0, y: 0 });
            createWidgetElement('taskList', { x: 4, y: 0 });
        }
    }

    // ======================= INICIALIZAÇÃO GERAL E EVENTOS =======================
    function init() {
        loadTheme();
        loadGlobalSettings();
        
        if (themeSwitcherBtn) themeSwitcherBtn.addEventListener('click', toggleTheme);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveGlobalSettings);
        if (settingsModal) settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(); });
        
        if (addWidgetBtn) {
            addWidgetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                widgetOptionsMenu.style.display = widgetOptionsMenu.style.display === 'none' ? 'flex' : 'none';
            });
        }
        document.addEventListener('click', () => { if(widgetOptionsMenu) widgetOptionsMenu.style.display = 'none'; });
        if(widgetOptionsMenu) widgetOptionsMenu.addEventListener('click', (e) => e.stopPropagation());

        document.querySelectorAll('.widget-option').forEach(button => {
            button.addEventListener('click', (event) => {
                createWidgetElement(event.currentTarget.dataset.widgetType);
                if (widgetOptionsMenu) widgetOptionsMenu.style.display = 'none';
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                const selectedWidget = document.querySelector('.grid-stack-item-selected');
                if (selectedWidget) {
                    event.preventDefault();
                    const id = selectedWidget.getAttribute('gs-id');
                    widgetState.delete(id);
                    grid.removeWidget(selectedWidget);
                }
            }
        });
        
        loadDashboard();
        grid.on('change removed', saveDashboard);
    }
    init();
});