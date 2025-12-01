<?php
// Inicializa a sessão
session_start();
 
// Desfaz todas as variáveis de sessão
$_SESSION = array();
session_destroy();
 
header("location: login.php");
exit;
?>