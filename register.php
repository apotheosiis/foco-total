<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro - Foco Total</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; }
        .auth-container { background: var(--background-color-light); padding: 40px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .auth-container h2 { text-align: center; margin-bottom: 20px; color: var(--text-color-primary); }
        .auth-container .input-field { margin-bottom: 15px; }
        .auth-container .input-field label { display: block; margin-bottom: 5px; }
        .auth-container .input-field input { width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; }
        .auth-container .btn { width: 100%; padding: 12px; }
        .auth-container .link { text-align: center; margin-top: 15px; }
        .auth-container .link a { color: var(--primary-color); text-decoration: none; }
    </style>
</head>
<body>
    <div class="auth-container">
        <h2>Criar Conta</h2>
        <p>Preencha o formulário para se cadastrar.</p>
        <form action="register_action.php" method="post">
            <div class="input-field">
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" required>
            </div>
            <div class="input-field">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" required>
            </div>
            <div class="input-field">
                <label for="senha">Senha</label>
                <input type="password" name="senha" id="senha" required minlength="6">
            </div>
            <button type="submit" class="btn">Cadastrar</button>
            <p class="link">Já tem uma conta? <a href="login.php">Faça login</a>.</p>
        </form>
    </div>
</body>
</html>