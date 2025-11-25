<?php
session_start();
header('Content-Type: application/json');

// 1. VERIFICAÇÃO DE SEGURANÇA: Garante que o usuário está logado.
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true || !isset($_SESSION["id"])) {
    http_response_code(403); // Forbidden
    echo json_encode(["error" => "Acesso não autorizado. Faça login para enviar imagens."]);
    exit;
}

// 2. VERIFICAÇÃO DO UPLOAD: Checa se um arquivo foi enviado e se não houve erros.
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Nenhum arquivo enviado ou erro no upload."]);
    exit;
}

$file = $_FILES['photo'];
$uploadDir = 'uploads/';

// 3. VALIDAÇÃO DO ARQUIVO: Checa tipo, tamanho, etc.
$allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$fileMimeType = mime_content_type($file['tmp_name']);

if (!in_array($fileMimeType, $allowedMimeTypes)) {
    http_response_code(415); // Unsupported Media Type
    echo json_encode(["error" => "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WEBP."]);
    exit;
}

$maxFileSize = 5 * 1024 * 1024; // 5 MB
if ($file['size'] > $maxFileSize) {
    http_response_code(413); // Payload Too Large
    echo json_encode(["error" => "O arquivo é muito grande. O tamanho máximo é 5MB."]);
    exit;
}

// 4. GERAR NOME ÚNICO E SEGURO PARA O ARQUIVO
// Isso evita conflitos de nome e problemas de segurança.
$fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
$uniqueName = uniqid('user' . $_SESSION['id'] . '_', true) . '.' . strtolower($fileExtension);
$uploadFilePath = $uploadDir . $uniqueName;

// 5. MOVER O ARQUIVO PARA A PASTA DE UPLOADS
if (move_uploaded_file($file['tmp_name'], $uploadFilePath)) {
    // Sucesso!

    // Constrói a URL completa para ser usada no frontend.
    // Em um ambiente real, você usaria variáveis de ambiente para o domínio.
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . '://' . $host . '/foco-total/';
    $fileUrl = $baseUrl . $uploadFilePath;

    http_response_code(200); // OK
    echo json_encode([
        "success" => true,
        "url" => $fileUrl // Retorna a URL completa da imagem
    ]);
} else {
    // Falha ao mover o arquivo (pode ser problema de permissão na pasta 'uploads')
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Não foi possível salvar o arquivo no servidor."]);
}
?>