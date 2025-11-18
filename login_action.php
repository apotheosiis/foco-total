<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $senha = trim($_POST["senha"]);

    if (empty($email) || empty($senha)) {
        die("Por favor, preencha email e senha.");
    }

    $sql = "SELECT id, nome, email, senha FROM usuarios WHERE email = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $param_email);
        $param_email = $email;

        if ($stmt->execute()) {
            $stmt->store_result();

            if ($stmt->num_rows == 1) {
                $stmt->bind_result($id, $nome, $email, $hashed_senha);
                if ($stmt->fetch()) {
                    if (password_verify($senha, $hashed_senha)) {
                        // Senha correta, inicia a sessão
                        // session_start() já foi chamado no topo

                        $_SESSION["loggedin"] = true;
                        $_SESSION["id"] = $id;
                        $_SESSION["nome"] = $nome;

                        // Redireciona para a página principal
                        header("location: /foco-total/dashboard.php");
                        exit; // É importante adicionar exit após o redirecionamento
                    } else {
                        // Senha incorreta. Define a mensagem de erro e redireciona de volta.
                        $_SESSION['login_error'] = "Email ou senha inválidos.";
                        header("location: login.php");
                        exit;
                    }
                }
            } else {
                // Usuário não encontrado. Define a mensagem de erro e redireciona.
                $_SESSION['login_error'] = "Email ou senha inválidos.";
                header("location: login.php");
                exit;
            }
        } else {
            $_SESSION['login_error'] = "Ops! Algo deu errado. Tente novamente.";
            header("location: login.php");
            exit;
        }
        $stmt->close();
    }
    $conn->close();
}
?>