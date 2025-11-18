<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro - Foco Total</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        /* Adiciona o estilo para centralizar o conteúdo na tela */
        body.auth-body { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; }
    </style>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="auth-body">
    <div class="auth-logo">
        <a href="#">Foco Total</a>
    </div>
    <div class="auth-container">
        <h2>Crie sua conta</h2>
        <p class="auth-subtitle">Comece sua jornada de produtividade e foco.</p>
        <form action="register_action.php" method="post">
            <div class="input-field">
                <i class="fas fa-user"></i>
                <input type="text" name="nome" id="nome" required>
                <label for="nome">Seu nome</label>
            </div>
            <div class="input-field">
                <i class="fas fa-envelope"></i>
                <input type="email" name="email" id="email" required>
                <label for="email">Seu email</label>
            </div>
            <div class="input-field">
                <i class="fas fa-lock"></i>
                <input type="password" name="senha" id="senha" required minlength="6">
                <label for="senha">Crie uma senha</label>
            </div>
            <button type="submit" class="btn auth-btn">Criar conta</button>
            <p class="auth-link">Já tem uma conta? <a href="login.php">Faça login</a></p>
        </form>
    </div>
</body>
</html>