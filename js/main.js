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
    let activeWorkspaceId = null;
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
    const workspaceBtn = document.getElementById('workspace-btn');
    const workspaceMenu = document.getElementById('workspace-menu');
    const workspaceList = document.getElementById('workspace-list');
    const newWorkspaceNameInput = document.getElementById('new-workspace-name');
    const saveNewWorkspaceBtn = document.getElementById('save-new-workspace-btn');
    
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
        // SOLUÇÃO DEFINITIVA: Geramos o HTML como string e deixamos o Gridstack criar o elemento.
        // Depois, encontramos o conteúdo dentro do widget criado para inicializá-lo.
        const deleteBtnHTML = `<button class="widget-delete-btn"><i class="fas fa-times"></i></button>`;
        let contentHTML = '';
        let contentSelector = '';
        
        // CORREÇÃO DEFINITIVA: O 'type' vem do 'id' do widget.
        const parsedType = widgetData.id ? widgetData.id.split('-')[0] : type;
        let gridOptions = { ...widgetData, id: widgetData.id || `${type}-${Date.now()}` };

        switch (parsedType) {
            case 'pomodoro':
                Object.assign(gridOptions, { w: 4, h: 4, noResize: true });
                contentSelector = '.timer-card';
                contentHTML = `<div class="timer-card">${deleteBtnHTML}<div class="mode-selector"><button class="mode-btn active" data-mode="work">Foco</button><button class="mode-btn" data-mode="short-break">Pausa Curta</button><button class="mode-btn" data-mode="long-break">Pausa Longa</button><button class="icon-btn settings-icon-btn js-open-pomodoro-settings" aria-label="Configurações do Timer"><i class="fas fa-ellipsis-v"></i></button></div><h1 class="timer-display">--:--</h1><div class="controls"><button class="start-btn btn"><i class="fas fa-play"></i> Iniciar</button><button class="pause-btn btn btn-secondary"><i class="fas fa-pause"></i> Pausar</button><button class="reset-btn btn btn-secondary"><i class="fas fa-redo-alt"></i> Reiniciar</button></div></div>`;
                break;
            case 'taskList':
                Object.assign(gridOptions, { w: 5, h: 4, minH: 4, auto: true });
                contentSelector = '.task-section';
                contentHTML = `<div class="task-section">${deleteBtnHTML}<h2>Minhas Tarefas</h2><div class="task-input-group"><input type="text" class="new-task-input" placeholder="Adicionar nova tarefa..."><button class="add-task-btn btn btn-add"><i class="fas fa-plus"></i></button></div><div class="task-list-container"><ul class="task-list"></ul></div><button class="clear-btn btn btn-secondary" style="display: none;"><i class="fas fa-trash-alt"></i> Limpar Concluídas</button></div>`;
                break;
            case 'music':
                Object.assign(gridOptions, { w: 6, h: 4, minH: 4 }); // minW?
                contentSelector = '.music-section';
                const videoId = widgetData.content;
                const musicBody = videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : `<div class="music-input-container"><h3>Player de Música</h3><input type="text" class="music-url-input" placeholder="Cole a URL do YouTube aqui..."><button class="music-save-btn btn">Carregar</button></div>`;
                contentHTML = `<div class="music-section">${deleteBtnHTML}${musicBody}</div>`;
                break;
            case 'photo':
                Object.assign(gridOptions, { w: 4, h: 4, minH: 3 });
                contentSelector = '.photo-section';
                const bgImage = widgetData.content ? `style="background-image: url(${widgetData.content})"` : '';
                contentHTML = `<div class="photo-section" ${bgImage}>${deleteBtnHTML}<input type="file" class="photo-input" accept="image/*" />${!widgetData.content ? '<div class="photo-placeholder"><i class="fas fa-plus"></i><span>Adicionar Imagem</span></div>' : ''}</div>`;
                break;
        }

        gridOptions.content = contentHTML;
        const widgetEl = grid.addWidget(gridOptions);
        widgetEl.dataset.widgetType = parsedType;

        // Encontra o elemento de conteúdo recém-adicionado DENTRO do widget
        const contentEl = widgetEl.querySelector(contentSelector);
        if (contentEl) {
            initializeWidget(contentEl, parsedType, widgetData, widgetEl);
        }
    }
    
    function initializeWidget(contentEl, type, widgetData, wrapperEl) {
        const id = wrapperEl.getAttribute('gs-id');
        const deleteBtn = contentEl.querySelector('.widget-delete-btn'); // este é o wrapper do grid-stack-item-content
        if (deleteBtn) deleteBtn.addEventListener('click', () => { 
            widgetState.delete(id); 
            grid.removeWidget(wrapperEl); 
        });

        if (type === 'pomodoro') { initPomodoroWidget(contentEl); } 
        else if (type === 'taskList') { initTaskListWidget(contentEl, widgetData); }
        else if (type === 'music') { initMusicWidget(contentEl, widgetData, wrapperEl); }
        else if (type === 'photo') { initPhotoWidget(contentEl); }
    }
    
    function initPomodoroWidget(widgetEl) {
        const timerDisplay = widgetEl.querySelector('.timer-display');
        const startBtn = widgetEl.querySelector('.start-btn');
        const pauseBtn = widgetEl.querySelector('.pause-btn');
        const resetBtn = widgetEl.querySelector('.reset-btn');
        const modeButtons = widgetEl.querySelectorAll('.mode-btn');
        const pomodoroSettingsBtn = widgetEl.querySelector('.js-open-pomodoro-settings');
        let pomodoroCount = 0, currentMode = 'work', timerInterval = null, timeLeft = 0;
        
        // CORREÇÃO: Registrar um estado inicial para o widget Pomodoro.
        const state = { mode: currentMode, count: pomodoroCount };
        widgetState.set(widgetEl.closest('.grid-stack-item').getAttribute('gs-id'), state);

        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        function pauseTimer() { clearInterval(timerInterval); timerInterval = null; }
        function switchMode(newMode) {
            pauseTimer(); 
            currentMode = newMode;
            state.mode = newMode; // Atualiza o estado

            if (newMode === 'work') timeLeft = globalSettings.foco * 60;
            if (newMode === 'short-break') timeLeft = globalSettings.shortBreak * 60;
            if (newMode === 'long-break') timeLeft = globalSettings.longBreak * 60;
            modeButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === newMode));
            updateDisplay();
        }
        function startTimer() {
            if (timerInterval) return;
            if (timeLeft <= 0) switchMode(currentMode); // Garante que o tempo seja resetado se estiver em 0
            timerInterval = setInterval(() => {
                timeLeft--; updateDisplay();
                if (timeLeft < 0) {
                    pauseTimer();
                    if (currentMode === 'work') {
                        state.count++; // Atualiza o estado
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
        // CORREÇÃO: Garantir que as tarefas sejam carregadas a partir de widgetData.content,
        // que é onde os dados do layout são armazenados.
        const state = { tasks: (widgetData && widgetData.content) ? widgetData.content : [] };
        widgetState.set(widgetEl.closest('.grid-stack-item').getAttribute('gs-id'), state);
        
        const newTaskInput = widgetEl.querySelector('.new-task-input');
        const addTaskBtn = widgetEl.querySelector('.add-task-btn');
        const taskList = widgetEl.querySelector('.task-list');
        const clearCompletedBtn = widgetEl.querySelector('.clear-btn'); // CORREÇÃO: O seletor estava errado.
        let taskIdCounter = state.tasks.length > 0 ? (Math.max(0, ...state.tasks.map(t => t.id)) + 1) : 1;
        
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
        // CORREÇÃO: O widgetEl já é a photo-section.
        const photoSection = widgetEl;
        const photoInput = widgetEl.querySelector('.photo-input');
        const placeholder = widgetEl.querySelector('.photo-placeholder');

        photoSection.addEventListener('click', (e) => { if (e.target !== photoInput) photoInput.click(); });
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

    function initMusicWidget(contentEl, widgetData, wrapperEl) {
        const state = { videoId: widgetData.content || null };
        widgetState.set(wrapperEl.getAttribute('gs-id'), state);
        const musicSection = contentEl;
        const saveBtn = contentEl.querySelector('.music-save-btn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const urlInput = contentEl.querySelector('.music-url-input');
                const url = urlInput.value;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (videoId) {
                    state.videoId = videoId;
                    const iframeHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    musicSection.innerHTML = `<button class="widget-delete-btn"><i class="fas fa-times"></i></button>${iframeHTML}`;
                    musicSection.querySelector('.widget-delete-btn').addEventListener('click', () => { widgetState.delete(wrapperEl.getAttribute('gs-id')); grid.removeWidget(wrapperEl); });
                    saveDashboard();
                } else { alert("URL do YouTube inválida!"); }
            });
        }
    }
    
    /**
     * Coleta os dados completos do dashboard, combinando a estrutura do grid com o conteúdo dos widgets.
     * @returns {Array} Um array de objetos representando todos os widgets e seus dados.
     */
    function getDashboardData() {
        // SOLUÇÃO DEFINITIVA: Ignorar grid.save() e construir os dados manualmente.
        // Isso garante que o 'id' e o 'content' sejam sempre salvos.
        const widgetsData = [];
        grid.engine.nodes.forEach(node => {
            const data = {
                x: node.x,
                y: node.y,
                w: node.w,
                h: node.h,
                id: node.id
            };

            const type = node.id.split('-')[0];
            const state = widgetState.get(node.id);

            if (state !== undefined) {
                if (type === 'taskList') data.content = state.tasks;
                if (type === 'music') data.content = state.videoId;
            }
            // CORREÇÃO: A lógica da imagem deve ficar fora do 'if (state !== undefined)',
            // pois ela lê os dados diretamente do DOM, não do 'widgetState'.
            if (type === 'photo') {
                const photoSection = node.el.querySelector('.photo-section');
                const bgImage = photoSection ? photoSection.style.backgroundImage : '';
                if (bgImage) data.content = bgImage.slice(5, -2);
            }

            widgetsData.push(data);
        });
        return widgetsData;
    }

    async function saveDashboard() {
        // Agora, esta função apenas pega os dados e os envia para a API (autosave).
        const widgetsData = getDashboardData();
        
        // NOVO: Salva no banco de dados se houver um workspace ativo
        if (activeWorkspaceId) {
            try {
                await fetch('api_workspace.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: activeWorkspaceId, layout_data: JSON.stringify(widgetsData) })
                });
            } catch (error) {
                console.error('Erro ao salvar workspace:', error);
            }
        }
    }

    async function loadDashboard() {
        try {
            const response = await fetch('api_workspace.php');
            if (!response.ok) throw new Error('Não foi possível buscar workspaces.');
            const workspaces = await response.json();

            if (workspaces.length > 0) {
                // Carrega o workspace mais recente
                // CORREÇÃO: Passa 'true' para indicar que é o carregamento inicial da página.
                await loadWorkspace(workspaces[0].id, true); 
            } else {
                // Se não houver nenhum, cria um "Workspace Padrão" e recarrega a página.
                // Isso simplifica o fluxo e evita erros de estado.
                try {
                    const newWorkspaceResponse = await fetch('api_workspace.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            nome: 'Workspace Padrão', 
                            layout_data: JSON.stringify([
                                { "x": 0, "y": 0, "w": 4, "h": 4, "id": `pomodoro-${Date.now()}` },
                                { "x": 4, "y": 0, "w": 5, "h": 4, "id": `taskList-${Date.now() + 1}` }
                            ])
                        })
                    });
                    if (newWorkspaceResponse.ok) {
                        window.location.reload();
                    }
                } catch (e) {
                    console.error("Não foi possível criar o workspace padrão.", e);
                    alert("Erro crítico ao configurar sua conta. Por favor, tente recarregar.");
                }
            }
            populateWorkspaceMenu(); // Atualiza o menu
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            alert("Houve um erro ao carregar seus dados. Tente recarregar a página.");
        }
    }

    function loadLayout(workspaceId, layoutData) {
        activeWorkspaceId = workspaceId;
        // CORREÇÃO DEFINITIVA: O layoutData que vem do servidor já é uma string JSON.
        // Precisamos fazer o parse dela para obter o array de widgets.
        // Se layoutData for nulo ou indefinido, usamos um array vazio como padrão.
        const layout = layoutData ? JSON.parse(layoutData) : [];
        
        grid.removeAll(false);
        if (Array.isArray(layout) && layout.length > 0) {
            layout.forEach(widgetData => createWidgetElement(widgetData.type, widgetData));
        }
    }

    async function loadWorkspace(workspaceId, isInitialLoad = false) {
        try {
            // Se não for o carregamento inicial da página, primeiro dizemos ao servidor qual workspace ativar.
            if (!isInitialLoad) {
                await fetch('api_workspace.php', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: workspaceId })
                });
                // E então, simplesmente recarregamos a página.
                window.location.reload();
                return; // Impede a execução do resto da função.
            }

            // Este código só roda no carregamento inicial da página.
            // Precisamos buscar o layout do workspace específico.
            const response = await fetch('api_workspace.php?id=' + workspaceId);
            if (!response.ok) {
                throw new Error('Não foi possível carregar os dados do workspace.');
            }
            
            // Não precisamos mais do sistema de depuração complexo.
            // response.json() já lida com erros de JSON inválido.
            const workspaceData = await response.json(); 
            
            if (workspaceData && workspaceData.layout_data) {
                loadLayout(workspaceId, workspaceData.layout_data);
            } else {
                // Se não encontrar dados de layout (workspace novo ou vazio), carrega um layout vazio.
                loadLayout(workspaceId, '[]');
            }
        } catch (error) {
            console.error("Erro em loadWorkspace:", error);
            alert("Houve um erro ao tentar carregar o workspace.");
        }
    }

    async function populateWorkspaceMenu() {
        const response = await fetch('api_workspace.php');
        const workspaces = await response.json();
        workspaceList.innerHTML = '';
        workspaces.forEach(ws => {
            const li = document.createElement('li');
            li.textContent = ws.nome;
            li.dataset.id = ws.id;
            if (ws.id == activeWorkspaceId) li.style.fontWeight = 'bold'; // Usar '==' para comparar string com número se necessário
            li.addEventListener('click', () => loadWorkspace(ws.id));
            workspaceList.appendChild(li);
        });
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

        // Lógica do Menu de Workspace
        workspaceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = workspaceMenu.style.display === 'block';
            workspaceMenu.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) populateWorkspaceMenu();
        });
        document.addEventListener('click', (e) => {
            if (!workspaceMenu.contains(e.target)) workspaceMenu.style.display = 'none';
        });
        saveNewWorkspaceBtn.addEventListener('click', async () => {
            const name = newWorkspaceNameInput.value.trim();
            if (!name) return alert('Por favor, dê um nome ao workspace.');

            // CORREÇÃO: Adicionado bloco try...catch para capturar e exibir erros.
            try {
                const layoutData = JSON.stringify(getDashboardData());

                const response = await fetch('api_workspace.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: name, layout_data: layoutData })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Erro do servidor: ${response.statusText}`);
                }

                const newWorkspace = await response.json();
                // CORREÇÃO: Após criar, simplesmente recarrega a página para ativá-lo.
                window.location.reload();
            } catch (error) {
                console.error("Falha ao salvar novo workspace:", error);
                alert(`Não foi possível salvar o workspace: ${error.message}`);
            }
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