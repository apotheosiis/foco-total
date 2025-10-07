<?php
/**
 * Arquivo de Configuração do Banco de Dados
 * * Responsável por estabelecer a conexão com o banco de dados MySQL usando MySQLi.
 * As credenciais são definidas como constantes para fácil manutenção.
 */

// Evita que o script seja acessado diretamente.
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Acesso direto a este arquivo não é permitido.');
}

// --- CREDENCIAIS DO BANCO DE DADOS ---
// Altere estes valores de acordo com a configuração do seu ambiente local (XAMPP, WAMP, etc.)

/** @var string O servidor onde o banco de dados está rodando (geralmente 'localhost'). */
define('DB_HOST', 'localhost');

/** @var string O nome de usuário para acessar o banco de dados (padrão do XAMPP é 'root'). */
define('DB_USER', 'root');

/** @var string A senha para o usuário do banco de dados (padrão do XAMPP é em branco). */
define('DB_PASS', '');

/** @var string O nome do banco de dados que criamos com o script SQL. */
define('DB_NAME', 'foco_total_db');


// --- ESTABELECENDO A CONEXÃO ---

// Desativa a exibição de erros internos do MySQLi para podermos tratar os erros manualmente.
mysqli_report(MYSQLI_REPORT_OFF);

// Tenta criar uma nova instância da conexão MySQLi.
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verifica se ocorreu um erro na conexão.
if ($conn->connect_error) {
    // Em um ambiente de produção, o ideal seria registrar este erro em um arquivo de log
    // em vez de exibi-lo na tela, para não expor detalhes do servidor.
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500); // Erro Interno do Servidor
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Falha na conexão com o banco de dados. Verifique as credenciais no arquivo config/database.php.'
    ]);
    exit(); // Interrompe a execução de qualquer script que inclua este arquivo.
}

// Define o conjunto de caracteres da conexão para UTF-8, garantindo o suporte
// a acentos e caracteres especiais em todas as comunicações com o banco.
if (!$conn->set_charset("utf8mb4")) {
    // Trata o erro se não for possível definir o charset.
    // ... (tratamento de erro similar ao de cima) ...
}

// A variável $conn agora está disponível e pronta para ser usada
// em qualquer script PHP que inclua este arquivo.

?>