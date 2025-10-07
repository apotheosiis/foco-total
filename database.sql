-- Use este script no seu phpMyAdmin para criar a tabela necessária.

CREATE TABLE `sessoes_pomodoro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `duracao_minutos` int(11) NOT NULL,
  `status` enum('completo','interrompido') NOT NULL,
  `concluida_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;