<?php
session_start(); // Inicia a sessão para podermos usar variáveis de sessão
require_once "../../src/config/database.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST["nome"]);
    $email = trim($_POST["email"]);
    $senha = trim($_POST["senha"]);
    
    // Validação simples
    if (empty($nome) || empty($email) || empty($senha)) {
        $_SESSION['register_error'] = "Por favor, preencha todos os campos.";
        header("location: register.php");
        exit;
    }

    // Criptografa a senha
    $senha_hashed = password_hash($senha, PASSWORD_DEFAULT);

    // Prepara a query para evitar SQL Injection
    $sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        // Vincula os parâmetros
        $stmt->bind_param("sss", $param_nome, $param_email, $param_senha);

        $param_nome = $nome;
        $param_email = $email;
        $param_senha = $senha_hashed;

        if ($stmt->execute()) {
            // Redireciona para a página de login após o sucesso
            header("location: ../login.php");
        } else {
            // Verifica se o erro é de email duplicado
            if ($conn->errno == 1062) {
                $_SESSION['register_error'] = "Erro: Este email já está cadastrado.";
            } else {
                $_SESSION['register_error'] = "Ops! Algo deu errado. Por favor, tente novamente mais tarde.";
            }
            header("location: ../register.php");
            exit;
        }
        $stmt->close();
    }
    $conn->close();
}
?>