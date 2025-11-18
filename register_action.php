<?php
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST["nome"]);
    $email = trim($_POST["email"]);
    $senha = trim($_POST["senha"]);

    // Validação simples
    if (empty($nome) || empty($email) || empty($senha)) {
        die("Por favor, preencha todos os campos.");
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
            header("location: login.php");
        } else {
            // Verifica se o erro é de email duplicado
            if ($conn->errno == 1062) {
                die("Erro: Este email já está cadastrado.");
            } else {
                die("Ops! Algo deu errado. Por favor, tente novamente mais tarde.");
            }
        }
        $stmt->close();
    }
    $conn->close();
}
?>