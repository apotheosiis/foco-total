<?php
session_start();
require_once "db_connect.php";

// Garante que o usuário está logado
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true || !isset($_SESSION["id"])) {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "Acesso não autorizado."]);
    exit;
}

$id_usuario = $_SESSION["id"];
$method = $_SERVER["REQUEST_METHOD"];

header('Content-Type: application/json');

try {
    // VERIFICAÇÃO DE SANIDADE: Checa se a tabela workstations existe
    $checkTable = $conn->query("SHOW TABLES LIKE 'workstations'");
    if ($checkTable->num_rows == 0) {
        throw new Exception("Erro Crítico: A tabela 'workstations' não foi encontrada no banco de dados 'foco_total_db'. Por favor, execute o script SQL para criá-la.");
    }

    if ($method == "GET") {
        if (isset($_GET['id'])) {
            // Buscar um workspace específico
            $id_workspace = $_GET['id'];
            $sql = "SELECT layout_data FROM workstations WHERE id = ? AND id_usuario = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $id_workspace, $id_usuario);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            echo json_encode($result);
            exit; // <-- Adicionar exit aqui
        } else {
            // Listar todos os workspaces do usuário
            $sql = "SELECT id, nome FROM workstations WHERE id_usuario = ? ORDER BY ultima_vez_usado DESC";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id_usuario);
            $stmt->execute();
            $result = $stmt->get_result();
            $workspaces = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($workspaces);
            exit; // <-- Mover o exit para dentro do else
        }

    } elseif ($method == "POST") {
        // Criar um novo workspace
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validação dos dados recebidos
        if (!isset($data['nome']) || !isset($data['layout_data'])) {
            throw new Exception("Dados incompletos para criar workspace.");
        }

        $nome = trim($data['nome']);
        $layout_data = $data['layout_data']; // Já é uma string JSON vinda do JS

        if (empty($nome)) {
            throw new Exception("O nome do workspace não pode ser vazio.");
        }

        // Se uma ação de renomear for enviada
        if (isset($data['action']) && $data['action'] == 'rename' && isset($data['id'])) {
            $id_workspace = $data['id'];
            $sql = "UPDATE workstations SET nome = ? WHERE id = ? AND id_usuario = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sii", $nome, $id_workspace, $id_usuario);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Workspace renomeado."]);
            } else {
                throw new Exception("Erro ao renomear workspace: " . $stmt->error);
            }
            $stmt->close();
            exit;
        }

        $sql = "INSERT INTO workstations (id_usuario, nome, layout_data) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        // O tipo para a coluna JSON deve ser 's' (string).
        $stmt->bind_param("iss", $id_usuario, $nome, $layout_data);
        
        if ($stmt->execute()) {
            $new_id = $conn->insert_id;
            echo json_encode(["success" => true, "id" => $new_id, "nome" => $nome]);
            exit;
        } else {
            // Se a execução falhar, lança um erro com a descrição do problema
            throw new Exception("Erro no banco de dados ao criar workspace: " . $stmt->error);
        }
        $stmt->close();

    } elseif ($method == "PUT") {
        // Atualizar um workspace existente (autosave)
        $data = json_decode(file_get_contents('php://input'), true);
        $id_workspace = $data['id'] ?? null;
        $layout_data = $data['layout_data'] ?? null;

        if (!$id_workspace || !$layout_data) {
            throw new Exception("Dados insuficientes para atualizar.");
        }

        $sql = "UPDATE workstations SET layout_data = ?, ultima_vez_usado = NOW() WHERE id = ? AND id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sii", $layout_data, $id_workspace, $id_usuario);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
            exit;
        } else {
            throw new Exception("Erro ao salvar workspace: " . $stmt->error);
        }
        $stmt->close();

    } elseif ($method == "PATCH") {
        // Carregar um workspace (traz o layout e atualiza a data)
        $data = json_decode(file_get_contents('php://input'), true);
        $id_workspace = $data['id'] ?? null;

        if (!$id_workspace) throw new Exception("ID do workspace não fornecido.");

        // CORREÇÃO: Usar prepared statement para segurança e robustez.
        $sql_update = "UPDATE workstations SET ultima_vez_usado = NOW() WHERE id = ? AND id_usuario = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("ii", $id_workspace, $id_usuario);
        $stmt_update->execute();
        $stmt_update->close();
        
        // CORREÇÃO: O PATCH deve apenas atualizar e retornar sucesso, sem enviar dados de layout.
        // A página será recarregada e fará um GET para buscar os dados.
        echo json_encode(["success" => true, "message" => "Workspace ativado."]);
        exit;
    } elseif ($method == "DELETE") {
        // Excluir um workspace
        $data = json_decode(file_get_contents('php://input'), true);
        $id_workspace = $data['id'] ?? null;

        if (!$id_workspace) {
            throw new Exception("ID do workspace não fornecido para exclusão.");
        }

        $sql = "DELETE FROM workstations WHERE id = ? AND id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $id_workspace, $id_usuario);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Workspace excluído."]);
        } else {
            throw new Exception("Erro ao excluir workspace: " . $stmt->error);
        }
        $stmt->close();
        exit;
    }

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
```

### Resumo das Melhorias

1.  **Validação de Entrada:** Adicionei verificações para garantir que `nome` e `layout_data` realmente existem antes de tentar usá-los. Se não existirem, uma exceção é lançada com uma mensagem clara.
2.  **Tratamento de Erros Explícito:** No bloco `POST`, se `$stmt->execute()` falhar, ele agora lança uma exceção que inclui a mensagem de erro específica do banco de dados (`$stmt->error`). Isso nos dirá exatamente o que o MySQL não gostou (ex: "Coluna 'xyz' não encontrada").
3.  **`try...catch` Global:** Todo o código está dentro de um bloco `try...catch`. Qualquer exceção lançada (seja por dados faltando ou por erro no banco) será capturada e formatada como uma resposta JSON de erro, em vez de gerar uma página HTML. Isso garante que o JavaScript sempre receba um JSON.

### O que fazer agora

1.  **Substitua o conteúdo** do seu arquivo `c:/xampp/htdocs/foco-total/api_workspace.php` pelo código acima.
2.  **Abra o console do navegador** (pressione F12 e vá para a aba "Console").
3.  **Tente salvar um novo workspace.**

Agora, em vez do erro "Unexpected token", você verá no `alert` uma mensagem de erro muito mais específica vinda diretamente do PHP, como "Dados incompletos" ou "Erro no banco de dados: ...". Isso nos dará a pista final para resolver o problema de uma vez por todas.
