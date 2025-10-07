--
-- Estrutura do banco de dados para o projeto `Foco Total`
-- Versão: 1.0
--

-- --------------------------------------------------------

--
-- Criação do banco de dados (se ele não existir)
--
CREATE DATABASE IF NOT EXISTS `foco_total_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `foco_total_db`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `sessoes_pomodoro`
--
-- Esta tabela irá armazenar um registro para cada sessão de foco (pomodoro) completada.
--

CREATE TABLE `sessoes_pomodoro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `duracao_minutos` int(11) NOT NULL COMMENT 'Duração da sessão de foco em minutos.',
  `status` enum('completo','interrompido') NOT NULL DEFAULT 'completo' COMMENT 'Status final da sessão.',
  `concluida_em` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Data e hora em que a sessão foi registrada.',
  `id_usuario` int(11) DEFAULT NULL COMMENT 'Chave estrangeira para a tabela de usuários (funcionalidade futura).',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas
--
ALTER TABLE `sessoes_pomodoro` ADD KEY `id_usuario` (`id_usuario`);

--
-- Nota: No futuro, poderíamos adicionar uma tabela `usuarios` e uma tabela `tarefas`
-- para salvar as tarefas de cada usuário no banco de dados também.
--