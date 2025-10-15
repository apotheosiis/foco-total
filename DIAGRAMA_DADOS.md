erDiagram
    USUARIOS {
        int id PK "ID único do usuário"
        varchar nome "Nome do usuário"
        varchar email UK "Email de login (único)"
        varchar senha "Senha criptografada"
        timestamp data_criacao "Data de cadastro"
    }

    WORKSTATIONS {
        int id PK "ID único da workstation"
        int id_usuario FK "Link para o usuário dono"
        varchar nome "Nome da workstation (ex: Estudos, Trabalho)"
        timestamp data_modificacao "Última vez que foi alterada"
    }

    WIDGETS {
        int id PK "ID único do widget"
        int id_workstation FK "Link para a workstation à qual pertence"
        enum tipo "pomodoro, taskList, music, photo"
        int pos_x "Posição X no grid"
        int pos_y "Posição Y no grid"
        int largura "Largura (w) no grid"
        int altura "Altura (h) no grid"
        text conteudo "Conteúdo (URL da imagem, ID do vídeo, etc.)"
    }

    TAREFAS {
        int id PK "ID único da tarefa"
        int id_widget FK "Link para o widget de taskList"
        varchar texto "Descrição da tarefa"
        bool concluida "Status (concluída ou não)"
        int ordem "Ordem de exibição na lista"
    }

    SESSOES_POMODORO {
        int id PK "ID único da sessão"
        int id_usuario FK "Link para o usuário que completou"
        int duracao_minutos "Duração do ciclo de foco"
        timestamp concluida_em "Quando o ciclo terminou"
    }

    USUARIOS ||--o{ WORKSTATIONS : "possui"
    WORKSTATIONS ||--o{ WIDGETS : "contém"
    WIDGETS ||--o{ TAREFAS : "pode ter"
    USUARIOS ||--o{ SESSOES_POMODORO : "registra"