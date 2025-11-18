--
-- -------------------------------------------------------------
-- Script de Criação do Banco de Dados para o Projeto Foco Total
-- -------------------------------------------------------------
-- Este script pode ser copiado e colado diretamente na aba SQL
-- do seu phpMyAdmin para criar toda a estrutura necessária.
-- -------------------------------------------------------------
--

-- --------------------------------------------------------

--
-- 1. Criação do Banco de Dados
--
-- Cria o banco de dados `foco_total_db` apenas se ele ainda não existir.
-- Utiliza o charset `utf8mb4` para suportar uma ampla gama de caracteres, incluindo emojis.
--
CREATE DATABASE IF NOT EXISTS `foco_total_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `foco_total_db`;

-- --------------------------------------------------------

--
-- 2. Estrutura da tabela `usuarios`
--
-- Armazena as informações de login dos usuários.
--
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Armazena a senha criptografada (hash)',
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 3. Estrutura da tabela `workstations`
--
-- Armazena os workspaces personalizados de cada usuário, incluindo o layout dos widgets.
--
CREATE TABLE `workstations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `layout_data` json DEFAULT NULL COMMENT 'Armazena a configuração do layout dos widgets em formato JSON',
  `ultima_vez_usado` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 4. Adicionando Chaves Estrangeiras (Constraints)
--
-- Garante a integridade dos dados, ligando os workspaces aos usuários.
--
ALTER TABLE `workstations`
  ADD CONSTRAINT `workstations_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;