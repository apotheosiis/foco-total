<?php
// config/database.php - Conexão Segura com o Banco de Dados

// Constantes para as credenciais do banco de dados
// Usar constantes torna o código mais legível e seguro.
define('DB_HOST', 'localhost'); // Geralmente 'localhost'
define('DB_USER', 'root');      // Seu usuário do MySQL (padrão 'root')
define('DB_PASS', '');          // Sua senha do MySQL (padrão em branco no XAMPP)
define('DB_NAME', 'foco_total_db'); // O nome do banco que você criou

// Criar a conexão usando o driver MySQLi
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar a conexão
// É uma boa prática sempre verificar se a conexão foi bem-sucedida.
if ($conn->connect_error) {
    // Em produção, seria melhor registrar o erro em um log em vez de exibi-lo.
    die("Falha na Conexão: " . $conn->connect_error);
}

// Definir o charset para UTF-8 para suportar acentos e caracteres especiais
$conn->set_charset("utf8mb4");

// A variável $conn estará disponível para qualquer arquivo que inclua este script.