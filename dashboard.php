<?php
// Inicializa a sessão
session_start();
 
// Verifica se o usuário está logado, se não, redireciona para a página de login
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}
?><!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foco Total - Produtividade Zen</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <link href="https://cdn.jsdelivr.net/npm/gridstack@10.1.2/dist/gridstack.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gridstack@10.1.2/dist/gridstack-all.js"></script>

    <!-- Quill.js - Editor de Texto -->
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>

    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <header class="header">
        <nav class="nav-container">
            <a href="#" class="logo">Foco Total</a>
            <div class="header-icons">
                <button id="theme-switcher-btn" class="icon-btn" aria-label="Mudar tema">
                    <i class="fas fa-moon"></i>
                    <i class="fas fa-sun"></i>
                </button>
                <div class="workspace-menu-container">
                    <button id="workspace-btn" class="icon-btn" aria-label="Workspaces"><i class="fas fa-layer-group"></i></button>
                    <div id="workspace-menu" class="workspace-menu">
                        <div class="workspace-list-header">Meus Workspaces</div>
                        <ul id="workspace-list"></ul>
                        <div class="workspace-actions">
                            <button id="create-new-workspace-btn" class="btn-subtle"><i class="fas fa-plus"></i> Criar Novo Workspace</button>
                        </div>
                    </div>
                </div>
                <div class="user-menu">
                    <span class="user-name"><?php echo htmlspecialchars($_SESSION["nome"]); ?></span>
                    <a href="logout.php" class="icon-btn" aria-label="Sair"><i class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        </nav>
    </header>

    <h1 id="current-workspace-title" class="main-title"></h1>

    <div class="add-widget-container">
        <button id="add-widget-btn" class="btn"><i class="fas fa-plus"></i> Adicionar Bloco</button>
        <div id="widget-options" class="widget-options-menu">
            <button class="widget-option" data-widget-type="pomodoro"><i class="fas fa-clock"></i> Pomodoro</button>
            <button class="widget-option" data-widget-type="taskList"><i class="fas fa-tasks"></i> Lista de Tarefas</button>
            <button class="widget-option" data-widget-type="photo"><i class="fas fa-image"></i> Imagem</button>
            <button class="widget-option" data-widget-type="music"><i class="fab fa-youtube"></i> Música</button>
            <button class="widget-option" data-widget-type="textBlock"><i class="fas fa-file-alt"></i> Bloco de Texto</button>
        </div>
    </div>

    <main class="grid-stack"></main>

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
                <h2>Configurações do Timer</h2>
                <button id="close-modal-btn" class="icon-btn close-btn" aria-label="Fechar"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <h4><i class="fas fa-clock"></i> Duração (minutos)</h4>
                <div class="settings-group">
                    <div class="input-field"><label for="foco-duration">Foco</label><input type="number" id="foco-duration" min="1"></div>
                    <div class="input-field"><label for="short-break-duration">Pausa Curta</label><input type="number" id="short-break-duration" min="1"></div>
                    <div class="input-field"><label for="long-break-duration">Pausa Longa</label><input type="number" id="long-break-duration" min="1"></div>
                </div>
                <h4><i class="fas fa-redo-alt"></i> Ciclos</h4>
                <div class="settings-group">
                    <div class="input-field"><label for="long-break-interval">Pomodoros para Pausa Longa</label><input type="number" id="long-break-interval" min="1"></div>
                </div>
                <h4><i class="fas fa-volume-up"></i> Som</h4>
                <div class="settings-group">
                    <div class="input-field volume-control">
                        <label for="volume-slider">Volume</label>
                        <input type="range" id="volume-slider" min="0" max="1" step="0.1">
                    </div>
                    <button id="test-volume-btn" class="btn btn-secondary">Testar</button>
                </div>
            </div>
            <div class="modal-footer"><button id="save-settings-btn" class="btn">Salvar</button></div>
        </div>
    </div>

    <!-- Movemos o script principal para o final para garantir que tudo esteja carregado -->
    <!-- CORREÇÃO: Carrega o script principal no final, com 'defer' para aguardar o DOM -->
    <script src="js/main.js" defer></script>
</body>
</html>