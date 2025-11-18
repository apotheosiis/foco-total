<?php
session_start();
// Se o usuário já estiver logado, redireciona para a página principal
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("location: /foco-total/dashboard.php");
    exit;
}
if (isset($_SESSION['login_error'])) {
    $login_error = $_SESSION['login_error'];
    unset($_SESSION['login_error']); // Limpa o erro para não mostrar de novo
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login - Foco Total</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        /* CORREÇÃO: Adiciona o estilo para centralizar o conteúdo na tela */
        body.auth-body { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; }
    </style>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="auth-body">
    <div class="auth-logo">
        <a href="index.php">Foco Total</a>
    </div>
    <div class="auth-container">
        <h2>Bem-vindo de volta!</h2>
        <p class="auth-subtitle">Insira suas credenciais para acessar seu workspace.</p>
        
        <?php if (!empty($login_error)): ?>
            <div class="auth-error-message">
                <?php echo htmlspecialchars($login_error); ?>
            </div>
        <?php endif; ?>

        <form action="login_action.php" method="post">
            <div class="input-field">
                <i class="fas fa-envelope"></i>
                <input type="email" name="email" id="email" required>
                <label for="email">Seu email</label>
            </div>
            <div class="input-field">
                <i class="fas fa-lock"></i>
                <input type="password" name="senha" id="senha" required>
                <label for="senha">Sua senha</label>
            </div>
            <button type="submit" class="btn auth-btn">Entrar no Foco Total</button>
            <p class="auth-link">Não tem uma conta? <a href="register.php">Cadastre-se</a></p>
        </form>
    </div>
</body>
</html>