document.addEventListener('DOMContentLoaded', function () {
    // --- INICIALIZAÇÃO DO GRIDSTACK ---
    const grid = GridStack.init({
        cellHeight: 70,
        margin: 10,
        float: true, // Permite que os widgets flutuem para cima
        alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    });

    // --- LÓGICA DO DARK MODE ---
    const themeSwitcher = document.getElementById('theme-switcher-btn');
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Futuramente, você pode salvar a preferência do usuário aqui (localStorage)
    });

    // --- LÓGICA DO MENU DE WORKSPACE ---
    const workspaceBtn = document.getElementById('workspace-menu-btn');
    const workspaceMenu = document.querySelector('.workspace-menu');
    workspaceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        workspaceMenu.style.display = workspaceMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
        if (!workspaceMenu.contains(e.target) && e.target !== workspaceBtn) {
            workspaceMenu.style.display = 'none';
        }
    });
});