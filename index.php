<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foco Total - Produtividade Zen</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <link rel="stylesheet" href="css/style.css">
    <script src="js/main.js" defer></script>
</head>
<body>

    <header class="header">
        <nav class="nav-container">
            <a href="#" class="logo">Foco Total</a>
            <div class="header-icons">
                <a href="#" class="icon-btn" aria-label="Música"><i class="fas fa-music"></i></a>
                <button id="theme-switcher-btn" class="icon-btn" aria-label="Mudar tema">
                    <i class="fas fa-sun"></i>
                    <i class="fas fa-moon"></i>
                </button>
                <button class="icon-btn js-open-settings" aria-label="Configurações"><i class="fas fa-cog"></i></button>
                <a href="#" class="icon-btn" aria-label="Perfil do Usuário"><i class="fas fa-user-circle"></i></a>
            </div>
        </nav>
    </header>

    <main class="container">
        <section class="timer-card">
            <div class="mode-selector">
                <button class="mode-btn active" data-mode="work">Foco</button>
                <button class="mode-btn" data-mode="short-break">Pausa Curta</button>
                <button class="mode-btn" data-mode="long-break">Pausa Longa</button>
                <button class="icon-btn settings-icon-btn js-open-settings" aria-label="Configurações do Timer"><i class="fas fa-ellipsis-v"></i></button>
            </div>
            <h1 id="timer-display">25:00</h1>
            <div class="controls">
                <button id="start-btn" class="btn"><i class="fas fa-play"></i> Iniciar</button>
                <button id="pause-btn" class="btn btn-secondary"><i class="fas fa-pause"></i> Pausar</button>
                <button id="reset-btn" class="btn btn-secondary"><i class="fas fa-redo-alt"></i> Reiniciar</button>
            </div>
        </section>

        <section class="task-section">
            <h2>Minhas Tarefas</h2>
            <div class="task-input-group">
                <input type="text" id="new-task-input" placeholder="Adicionar nova tarefa...">
                <button id="add-task-btn" class="btn btn-add"><i class="fas fa-plus"></i> Adicionar</button>
            </div>
            <ul id="task-list"></ul>
            <button id="clear-completed-btn" class="btn btn-secondary clear-btn" style="display: none;">
                <i class="fas fa-trash-alt"></i> Limpar Concluídas
            </button>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-links">
            <a href="#">Home</a> <a href="#">Termos</a> <a href="#">Privacidade</a> <a href="#">Contato</a>
        </div>
        <div class="social-icons">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        </div>
        <p class="copyright">Made with ❤️ by Marllus Monteiro</p>
    </footer>

    <div id="settings-modal" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Configurações</h2>
                <button id="close-modal-btn" class="icon-btn close-btn" aria-label="Fechar"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <h4><i class="fas fa-clock"></i> Duração (minutos)</h4>
                <div class="settings-group">
                    <div class="input-field">
                        <label for="foco-duration">Foco</label>
                        <input type="number" id="foco-duration" min="1">
                    </div>
                    <div class="input-field">
                        <label for="short-break-duration">Pausa Curta</label>
                        <input type="number" id="short-break-duration" min="1">
                    </div>
                    <div class="input-field">
                        <label for="long-break-duration">Pausa Longa</label>
                        <input type="number" id="long-break-duration" min="1">
                    </div>
                </div>
                <h4><i class="fas fa-redo-alt"></i> Ciclos</h4>
                <div class="settings-group">
                    <div class="input-field">
                        <label for="long-break-interval">Pomodoros para Pausa Longa</label>
                        <input type="number" id="long-break-interval" min="1">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="save-settings-btn" class="btn">Salvar</button>
            </div>
        </div>
    </div>

</body>
</html>