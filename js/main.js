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
    let isAudioPrimed = false; // Flag para controlar o desbloqueio do áudio
    let globalSettings = {};

    // ======================= SELETORES GLOBAIS =======================
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const addWidgetBtn = document.getElementById('add-widget-btn');
    const widgetOptionsMenu = document.getElementById('widget-options');
    const focoDurationInput = document.getElementById('foco-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    const workspaceBtn = document.getElementById('workspace-btn');
    const workspaceMenu = document.getElementById('workspace-menu');
    const workspaceList = document.getElementById('workspace-list');
    const createNewWorkspaceBtn = document.getElementById('create-new-workspace-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const testVolumeBtn = document.getElementById('test-volume-btn');
    
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
        globalSettings.volume = parseFloat(volumeSlider.value) || 0.5;
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
            volume: savedSettings.volume !== undefined ? savedSettings.volume : 0.5,
        };
        focoDurationInput.value = globalSettings.foco;
        shortBreakDurationInput.value = globalSettings.shortBreak;
        longBreakDurationInput.value = globalSettings.longBreak;
        longBreakIntervalInput.value = globalSettings.longBreakInterval;
        volumeSlider.value = globalSettings.volume;
    }

    // ======================= LÓGICA DE ÁUDIO =======================
    const sounds = {
        focoEnd: new Audio('audio/foco_end.mp3'),
        breakEnd: new Audio('audio/break_end.mp3'),
        longBreakEnd: new Audio('audio/long_break_end.mp3')
    };
    function playSound(soundName) {
        const sound = sounds[soundName];
        if (sound) { 
            sound.volume = globalSettings.volume; 
            sound.currentTime = 0; // Rebobina o som para o início
            sound.play(); 
        }
    }

    /**
     * Desbloqueia a permissão de áudio do navegador.
     * Os navegadores modernos exigem uma interação do usuário para tocar som.
     * Esta função é chamada na primeira vez que o usuário clica em "Iniciar".
     */
    function primeAudio() {
        if (isAudioPrimed) return;

        // Tenta tocar cada som com volume 0 para "desbloquear"
        Object.values(sounds).forEach(sound => {
            sound.volume = 0;
            sound.play().catch(e => console.error("Audio priming failed", e)); // O catch evita erros no console se falhar
            sound.pause();
            sound.currentTime = 0;
        });
        isAudioPrimed = true;
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
        let gridOptions = { ...widgetData, id: widgetData.id || `${parsedType}-${Date.now()}` };

        switch (parsedType) {
            case 'pomodoro':
                Object.assign(gridOptions, { w: 4, h: 4, noResize: true, ...widgetData });
                contentSelector = '.timer-card';
                contentHTML = `<div class="timer-card">${deleteBtnHTML}<div class="mode-selector"><button class="mode-btn active" data-mode="work">Foco</button><button class="mode-btn" data-mode="short-break">Pausa Curta</button><button class="mode-btn" data-mode="long-break">Pausa Longa</button><button class="icon-btn settings-icon-btn js-open-pomodoro-settings" aria-label="Configurações do Timer"><i class="fas fa-ellipsis-v"></i></button></div><h1 class="timer-display">--:--</h1><div class="pomodoro-task-focus">Nenhuma tarefa em foco</div><div class="controls"><button class="start-btn btn"><i class="fas fa-play"></i> Iniciar</button><button class="pause-btn btn btn-secondary"><i class="fas fa-pause"></i> Pausar</button><button class="reset-btn btn btn-secondary"><i class="fas fa-redo-alt"></i> Reiniciar</button></div></div>`;
                break;
            case 'taskList':
                Object.assign(gridOptions, { w: 5, h: 4, minH: 4, auto: true, ...widgetData });
                contentSelector = '.task-section';
                const title = widgetData.title || 'Minhas Tarefas'; // Usa o título salvo ou um padrão
                contentHTML = `<div class="task-section">${deleteBtnHTML}<h2 class="widget-title" title="Clique para editar">${title}</h2><div class="task-input-group"><input type="text" class="new-task-input" placeholder="Adicionar nova tarefa..."><button class="add-task-btn btn btn-add"><i class="fas fa-plus"></i></button></div><div class="task-list-container"><ul class="task-list"></ul></div><button class="clear-btn btn btn-secondary" style="display: none;"><i class="fas fa-trash-alt"></i> Limpar Concluídas</button></div>`;
                break;
            case 'music':
                Object.assign(gridOptions, { w: 6, h: 4, minH: 4, ...widgetData });
                contentSelector = '.music-section';
                const videoId = widgetData.content;
                let musicBody;
                if (videoId) {
                    musicBody = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else {
                    musicBody = `
                        <div class="music-input-container">
                            <h3>Player de Música</h3>
                            <div class="music-suggestions">
                                <button class="suggestion-btn btn btn-secondary" data-videoid="jfKfPfyJRdk">🎧 Lofi Girl Radio</button>
                                <button class="suggestion-btn btn btn-secondary" data-videoid="4xDzrJKXOOY">🚀 Synthwave Mix</button>
                            </div>
                            <div class="or-divider"><span>ou</span></div>
                            <input type="text" class="music-url-input" placeholder="Cole a URL do YouTube aqui..."><button class="music-save-btn btn">Carregar</button>
                        </div>`;
                }
                contentHTML = `<div class="music-section">${deleteBtnHTML}${musicBody}</div>`;
                break;
            case 'photo':
                Object.assign(gridOptions, { w: 4, h: 4, minH: 3, ...widgetData });
                contentSelector = '.photo-section';
                const bgImage = widgetData.content ? `style="background-image: url(${widgetData.content})"` : '';
                contentHTML = `<div class="photo-section" ${bgImage}>${deleteBtnHTML}<input type="file" class="photo-input" accept="image/*" />${!widgetData.content ? '<div class="photo-placeholder"><i class="fas fa-plus"></i><span>Adicionar Imagem</span></div>' : ''}</div>`;
                break;
            case 'textBlock':
                Object.assign(gridOptions, { w: 4, h: 4, minH: 3, ...widgetData });
                contentSelector = '.text-block-section';
                contentHTML = `<div class="text-block-section">${deleteBtnHTML}<div class="quill-editor"></div></div>`;
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
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                // LÓGICA ESPECIAL PARA WIDGET DE FOTO
                if (type === 'photo') {
                    const photoSection = wrapperEl.querySelector('.photo-section');
                    const bgImage = photoSection ? photoSection.style.backgroundImage : '';
                    if (bgImage && bgImage.startsWith('url("')) {
                        const imageUrl = bgImage.slice(5, -2); // Extrai a URL
                        try {
                            await fetch('api_upload_image.php', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ url: imageUrl })
                            });
                        } catch (error) {
                            console.error('Falha ao tentar deletar a imagem no servidor:', error);
                        }
                    }
                }
                widgetState.delete(id);
                grid.removeWidget(wrapperEl);
            });
        }

        if (type === 'pomodoro') { initPomodoroWidget(contentEl); } 
        else if (type === 'taskList') { initTaskListWidget(contentEl, widgetData); }
        else if (type === 'music') { initMusicWidget(contentEl, widgetData, wrapperEl); }
        else if (type === 'photo') { initPhotoWidget(contentEl); }
        else if (type === 'textBlock') { initTextBlockWidget(contentEl, widgetData, wrapperEl); }
    }
    
    function initPomodoroWidget(widgetEl) {
        const timerDisplay = widgetEl.querySelector('.timer-display');
        const startBtn = widgetEl.querySelector('.start-btn');
        const pauseBtn = widgetEl.querySelector('.pause-btn');
        const resetBtn = widgetEl.querySelector('.reset-btn');
        const modeButtons = widgetEl.querySelectorAll('.mode-btn');
        const pomodoroSettingsBtn = widgetEl.querySelector('.js-open-pomodoro-settings');
        const taskFocusDisplay = widgetEl.querySelector('.pomodoro-task-focus');
        let pomodoroCount = 0, currentMode = 'work', timerInterval = null, timeLeft = 0, linkedTaskId = null;
        
        // CORREÇÃO: Registrar um estado inicial para o widget Pomodoro.
        const state = { mode: currentMode, count: pomodoroCount };
        widgetState.set(widgetEl.closest('.grid-stack-item').getAttribute('gs-id'), state); // O estado aqui é simples, não precisa salvar a tarefa

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
            if (newMode !== 'work') {
                linkedTaskId = null;
                taskFocusDisplay.textContent = 'Nenhuma tarefa em foco';
                taskFocusDisplay.style.display = 'none';
            } else { taskFocusDisplay.style.display = 'block'; }

            if (newMode === 'work') timeLeft = globalSettings.foco * 60;
            if (newMode === 'short-break') timeLeft = globalSettings.shortBreak * 60;
            if (newMode === 'long-break') timeLeft = globalSettings.longBreak * 60;
            modeButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === newMode));
            updateDisplay();
        }
        function startTimer() {
            if (timerInterval) return;
            primeAudio(); // Desbloqueia o áudio no primeiro clique em "Iniciar"
            if (timeLeft <= 0) switchMode(currentMode); // Garante que o tempo seja resetado se estiver em 0
            timerInterval = setInterval(() => {
                timeLeft--; updateDisplay();
                if (timeLeft < 0) {
                    pauseTimer();
                    if (currentMode === 'work') {
                        // Se uma tarefa estava vinculada, notifica a conclusão
                        if (linkedTaskId) {
                            window.dispatchEvent(new CustomEvent('pomodoroCompletedForTask', { detail: { taskId: linkedTaskId } }));
                            linkedTaskId = null; // Desvincula a tarefa
                            taskFocusDisplay.textContent = 'Nenhuma tarefa em foco';
                        }
                        state.count++; // Atualiza o estado
                        pomodoroCount++;
                        if (pomodoroCount > 0 && pomodoroCount % globalSettings.longBreakInterval === 0) {
                            playSound('longBreakEnd');
                            switchMode('long-break'); 
                        } else { 
                            playSound('focoEnd');
                            switchMode('short-break'); 
                        }
                    } else { playSound('breakEnd'); switchMode('work'); } // Volta ao trabalho após uma pausa
                }
            }, 1000);
        }
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', () => switchMode(currentMode));
        modeButtons.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));
        if(pomodoroSettingsBtn) pomodoroSettingsBtn.addEventListener('click', openModal);
        window.addEventListener('settingsUpdated', () => switchMode(currentMode));

        // Ouve o evento para iniciar o foco em uma tarefa
        window.addEventListener('startPomodoroForTask', (e) => {
            const { taskId, taskText } = e.detail;
            linkedTaskId = taskId;
            taskFocusDisplay.textContent = `Foco: ${taskText}`;
            switchMode('work');
            startTimer();
        });

        switchMode('work');
    }

    function initTaskListWidget(widgetEl, widgetData) {
        // CORREÇÃO: Garantir que as tarefas sejam carregadas a partir de widgetData.content,
        // que é onde os dados do layout são armazenados.
        const state = { 
            tasks: ((widgetData && widgetData.content) || []).map(t => ({ ...t, pomodoros: t.pomodoros || 0 })),
            title: widgetData.title || 'Minhas Tarefas'
        };        widgetState.set(widgetEl.closest('.grid-stack-item').getAttribute('gs-id'), state);
        
        const newTaskInput = widgetEl.querySelector('.new-task-input');
        const addTaskBtn = widgetEl.querySelector('.add-task-btn');
        const taskList = widgetEl.querySelector('.task-list');
        const clearCompletedBtn = widgetEl.querySelector('.clear-btn'); // CORREÇÃO: O seletor estava errado.
        let taskIdCounter = state.tasks.length > 0 ? (Math.max(0, ...state.tasks.map(t => t.id)) + 1) : 1;
        
        // --- NOVA LÓGICA DE EDIÇÃO DE TÍTULO ---
        const titleElement = widgetEl.querySelector('.widget-title');

        function saveAndRender() { saveDashboard(); renderTasks(); }
        function renderTasks() {
            taskList.innerHTML = '';
            state.tasks.forEach(task => {
                const li = document.createElement('li');
                li.dataset.id = task.id; li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="task-content">
                        <span class="task-checkbox"><i class="fas fa-check"></i></span>
                        <span class="task-text">${task.text}</span>
                    </div>
                    <div class="task-actions">
                        <span class="task-pomodoro-count" title="${task.pomodoros} pomodoros concluídos">
                            <i class="fas fa-clock"></i> ${task.pomodoros}
                        </span>
                        <button class="focus-task-btn" title="Focar nesta tarefa"><i class="fas fa-crosshairs"></i></button>
                        <button class="delete-task-btn" title="Excluir tarefa"><i class="fas fa-times"></i></button>
                    </div>`;
                taskList.appendChild(li);
            });
            checkClearCompletedButtonVisibility();
        }
        function addTask() {
            const taskText = newTaskInput.value.trim();
            if (taskText === '') return;
            state.tasks.push({ id: taskIdCounter++, text: taskText, completed: false, pomodoros: 0 });
            newTaskInput.value = ''; saveAndRender();
        }
        function handleTaskClick(e) {
            const listItem = e.target.closest('.task-item'); if (!listItem) return;
            const taskId = parseInt(listItem.dataset.id, 10);
            if (e.target.closest('.focus-task-btn')) {
                const task = state.tasks.find(t => t.id === taskId);
                if (task) {
                    window.dispatchEvent(new CustomEvent('startPomodoroForTask', { detail: { taskId: task.id, taskText: task.text } }));
                }
            }
            else if (e.target.closest('.delete-task-btn')) { state.tasks = state.tasks.filter(t => t.id !== taskId); } 
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
        // CORREÇÃO: Adicionar verificação para garantir que o botão existe antes de adicionar o evento.
        if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', clearCompletedTasks);

        // Ouve o evento de conclusão de um pomodoro
        window.addEventListener('pomodoroCompletedForTask', (e) => {
            const { taskId } = e.detail;
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                task.pomodoros++;
                saveAndRender();
            }
        });

        renderTasks();

        // --- EVENTOS PARA EDIÇÃO DE TÍTULO ---
        if (titleElement) {
            titleElement.addEventListener('click', () => {
                const currentTitle = titleElement.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentTitle;
                input.className = 'widget-title-input';

                titleElement.replaceWith(input);
                input.focus();
                input.select();

                const saveTitle = () => {
                    const newTitle = input.value.trim();
                    const finalTitle = newTitle === '' ? 'Minhas Tarefas' : newTitle;

                    // Atualiza o estado do widget
                    state.title = finalTitle;
                    saveDashboard(); // Salva a alteração

                    // Cria o novo h2 e o substitui de volta
                    const newTitleElement = document.createElement('h2');
                    newTitleElement.className = 'widget-title';
                    newTitleElement.title = 'Clique para editar';
                    newTitleElement.textContent = finalTitle;
                    
                    input.replaceWith(newTitleElement);
                    // Reanexa o evento de clique ao novo elemento
                    newTitleElement.addEventListener('click', titleElement.click);
                };

                input.addEventListener('blur', saveTitle);
                input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
            });
        }
    }
    
    function initPhotoWidget(widgetEl) {
        // CORREÇÃO: O widgetEl já é a photo-section.
        const photoSection = widgetEl;
        const photoInput = widgetEl.querySelector('.photo-input');
        const placeholder = widgetEl.querySelector('.photo-placeholder');

        photoSection.addEventListener('click', (e) => { 
            // Não abre o seletor de arquivo se o botão de deletar for clicado
            if (e.target.closest('.widget-delete-btn')) return;
            photoInput.click(); 
        });

        photoInput.addEventListener('change', async (event) => {
            const file = event.target.files[0]; if (!file) return;

            // Cria um objeto FormData para enviar o arquivo
            const formData = new FormData();
            formData.append('photo', file);

            try {
                // Mostra um feedback de carregamento (opcional, mas bom para UX)
                if (placeholder) placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Enviando...</span>';

                const response = await fetch('api_upload_image.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Erro desconhecido no servidor.');
                }

                photoSection.style.backgroundImage = `url(${result.url})`;
                if (placeholder) placeholder.style.display = 'none';
                saveDashboard();
            } catch (error) {
                alert(`Erro ao enviar imagem: ${error.message}`);
                // Restaura o placeholder original em caso de erro
                if (placeholder) placeholder.innerHTML = '<i class="fas fa-plus"></i><span>Adicionar Imagem</span>';
            }
        });
    }

    function initMusicWidget(contentEl, widgetData, wrapperEl) {
        const state = { videoId: widgetData.content || null };
        widgetState.set(wrapperEl.getAttribute('gs-id'), state);
        const musicSection = contentEl;
        const saveBtn = contentEl.querySelector('.music-save-btn');
        const suggestionBtns = contentEl.querySelectorAll('.suggestion-btn');
        
        function loadVideoFromUrl() {
            const urlInput = contentEl.querySelector('.music-url-input');
                const url = urlInput.value;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = url.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (videoId) {
                    state.videoId = videoId;
                    renderPlayer(videoId);
                } else { alert("URL do YouTube inválida!"); }
        }

        function renderPlayer(videoId) {
            const iframeHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            musicSection.innerHTML = `<button class="widget-delete-btn"><i class="fas fa-times"></i></button>${iframeHTML}`;
            musicSection.querySelector('.widget-delete-btn').addEventListener('click', () => { widgetState.delete(wrapperEl.getAttribute('gs-id')); grid.removeWidget(wrapperEl); });
            saveDashboard();
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', loadVideoFromUrl);
        }

        if (suggestionBtns) {
            suggestionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    state.videoId = btn.dataset.videoid;
                    renderPlayer(state.videoId);
                });
            });
        }
    }
    
    function initTextBlockWidget(contentEl, widgetData, wrapperEl) {
        const editorContainer = contentEl.querySelector('.quill-editor');
        const state = { htmlContent: widgetData.content || '' };
        widgetState.set(wrapperEl.getAttribute('gs-id'), state);

        // Opções da barra de ferramentas do Quill
        const toolbarOptions = [
            ['bold', 'underline'],                         // Botões de negrito e sublinhado
            [{ 'size': ['small', false, 'large', 'huge'] }], // Dropdown de tamanho da fonte (false = normal)
            [{ 'color': [] }],                             // Dropdown de cores
            ['clean']              // Botão para remover formatação
        ];

        const quill = new Quill(editorContainer, {
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: 'Comece a digitar suas anotações aqui...',
            theme: 'snow'
        });

        // Carrega o conteúdo salvo no editor
        if (state.htmlContent) {
            quill.root.innerHTML = state.htmlContent;
        }

        // Salva o conteúdo sempre que o texto mudar
        quill.on('text-change', () => {
            // Usamos .ql-editor para pegar apenas o conteúdo, sem a barra de ferramentas
            state.htmlContent = contentEl.querySelector('.ql-editor').innerHTML;
            // Não chamamos saveDashboard() aqui para não sobrecarregar o servidor.
            // O salvamento já acontece no evento 'change' do GridStack.
        });
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
                if (type === 'taskList') {
                    data.content = state.tasks;
                    data.title = state.title; // Salva o título
                }
                if (type === 'music') data.content = state.videoId;
                if (type === 'textBlock') data.content = state.htmlContent;
            }
            // CORREÇÃO: A lógica da imagem deve ficar fora do 'if (state !== undefined)',
            // pois ela lê os dados diretamente do DOM, não do 'widgetState'.
            if (type === 'photo') {
                const photoSection = node.el.querySelector('.photo-section');
                const bgImage = photoSection ? photoSection.style.backgroundImage : '';
                // Agora salvamos a URL completa, que está entre url("...")
                if (bgImage && bgImage.startsWith('url("')) {
                    data.content = bgImage.slice(5, -2);
                }
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
            li.innerHTML = `
                <span class="ws-name">${ws.nome}</span>
                <div class="ws-actions">
                    <button class="ws-action-btn rename-ws-btn" aria-label="Renomear"><i class="fas fa-pencil-alt"></i></button>
                    <button class="ws-action-btn delete-ws-btn" aria-label="Excluir"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            li.dataset.id = ws.id;

            const nameSpan = li.querySelector('.ws-name');

            // CORREÇÃO: Restaurar a lógica que exibe o título do workspace ativo
            if (ws.id == activeWorkspaceId) {
                nameSpan.style.fontWeight = 'bold';
                const currentWorkspaceTitle = document.getElementById('current-workspace-title');
                if(currentWorkspaceTitle) currentWorkspaceTitle.textContent = ws.nome;
            }

            nameSpan.addEventListener('click', () => loadWorkspace(ws.id));

            // Lógica para Renomear
            li.querySelector('.rename-ws-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const currentName = nameSpan.textContent.trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'ws-name-input';
                input.value = currentName;

                // Substitui o span pelo input
                nameSpan.replaceWith(input);
                input.focus();
                input.select();

                const saveName = async () => {
                    const newName = input.value.trim();
                    let finalName = currentName; // Nome para reverter em caso de falha

                    if (newName && newName !== currentName) {
                        try {
                            const response = await fetch('api_workspace.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'rename', id: ws.id, nome: newName }),
                            });
                            if (response.ok) {
                                finalName = newName; // Sucesso, usa o novo nome
                            } else { throw new Error('Falha ao renomear.'); }
                        } catch (err) {
                            console.error(err);
                        }
                    }

                    // Cria um novo span e o substitui de volta
                    const newNameSpan = document.createElement('span');
                    newNameSpan.className = 'ws-name';
                    newNameSpan.textContent = finalName;
                    if (ws.id == activeWorkspaceId) newNameSpan.style.fontWeight = 'bold';
                    newNameSpan.addEventListener('click', () => loadWorkspace(ws.id));
                    input.replaceWith(newNameSpan);
                };

                input.addEventListener('blur', saveName);
                input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') input.blur(); });
            });

            // Lógica para Excluir
            li.querySelector('.delete-ws-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza que deseja excluir o workspace "${ws.nome}"? Esta ação não pode ser desfeita.`)) {
                    try {
                        const response = await fetch('api_workspace.php', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: ws.id })
                        });
                        if (response.ok) {
                            li.remove();
                            // Se o workspace ativo for excluído, recarrega a página para carregar o próximo mais recente.
                            if (ws.id == activeWorkspaceId) window.location.reload();
                        } else { throw new Error('Falha ao excluir.'); }
                    } catch (err) { console.error(err); alert('Não foi possível excluir o workspace.'); }
                }
            });

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
        if (testVolumeBtn) testVolumeBtn.addEventListener('click', () => { globalSettings.volume = volumeSlider.value; playSound('focoEnd'); });
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
            workspaceMenu.style.display = workspaceMenu.style.display === 'block' ? 'none' : 'block';
            if (workspaceMenu.style.display === 'block') populateWorkspaceMenu();
        });

        document.addEventListener('click', (e) => {
            if (!workspaceMenu.contains(e.target)) workspaceMenu.style.display = 'none';
        });

        createNewWorkspaceBtn.addEventListener('click', async () => {
            const name = prompt("Digite o nome para o novo workspace:", "Novo Workspace");
            if (!name || name.trim() === '') return;

            const response = await fetch('api_workspace.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: name.trim(),
                    layout_data: '[]' // Cria um workspace vazio
                })
            });

            if (response.ok) {
                // Recarrega a página para que o novo workspace seja ativado
                window.location.reload();
            } else { alert('Não foi possível criar o workspace.'); }
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