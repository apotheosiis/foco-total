# 🚀 Foco Total - Dashboard de Produtividade

> Um dashboard de produtividade personalizável construído com PHP, MySQL e JavaScript puro (Vanilla JS), permitindo que o usuário organize suas ferramentas de foco da maneira que preferir.


---

## ✨ Funcionalidades Principais

* **Dashboard Dinâmico:** Organize os blocos de ferramentas arrastando e soltando onde quiser na tela.
* **Sistema de Widgets:** Adicione ou remova blocos (Pomodoro, Lista de Tarefas, etc.) de acordo com sua necessidade.
* **⏰ Pomodoro Timer:** Um timer completo com modos de Foco, Pausa Curta e Pausa Longa, totalmente configurável.
* **📝 Lista de Tarefas (Task List):** Adicione, marque como concluído e delete tarefas.
* **🖼️ Bloco de Imagem:** Personalize seu espaço com imagens a sua escolha.
* **🎵 Bloco de Música:** Ouça playlists calmas do YouTube com opções padrão ou colando sua própria URL de um vídeo.
* **🌙 Tema Claro e Escuro:** Alterne entre os modos visualmente para melhor conforto.
* **🔊 Notificação Sonora:** Um som suave avisa quando um ciclo do Pomodoro termina.
* **Deleção Inteligente:** Remova blocos clicando no 'X' ou selecionando o bloco e apertando a tecla `Delete`.
* **Persistência:** O layout dos blocos e o conteúdo das tarefas são salvos no navegador (`localStorage`), mantendo sua organização ao recarregar a página.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **Frontend:**
    * `HTML5`
    * `CSS3`
    * `JavaScript (ES6+)` (Vanilla JS, sem frameworks)
* **Backend:**
    * `PHP 8`
* **Banco de Dados:**
    * `MySQL`
* **Bibliotecas:**
    * **GridStack.js:** Para a criação do dashboard dinâmico de arrastar e soltar.
    * **Font Awesome:** Para os ícones da interface.
* **Ambiente de Desenvolvimento:**
    * `XAMPP` (ou similar, como WAMP/MAMP)
    * `phpMyAdmin`

---

## 🏁 Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone 
    ```

2.  **Ambiente Local:**
    * Certifique-se de ter um ambiente de servidor local como o **XAMPP** ou **WAMP** instalado e rodando (com Apache e MySQL ativos).
    * Mova a pasta do projeto clonado para dentro da pasta `htdocs` (no XAMPP) ou `www` (no WAMP).

3.  **Banco de Dados:**
    * Abra o **phpMyAdmin** (geralmente em `http://localhost/phpmyadmin`).
    * Crie um novo banco de dados chamado `foco_total_db`.
    * Selecione o banco `foco_total_db`, vá para a aba **"SQL"** e cole o conteúdo do arquivo `database.sql` para criar as tabelas.

4.  **Configuração:**
    * No arquivo `config/database.php`, verifique se as credenciais (`DB_USER`, `DB_PASS`) correspondem à configuração do seu MySQL local.

5.  **Acesse o Projeto:**
    * Abra seu navegador e acesse `http://localhost/[NOME_DA_PASTA_DO_PROJETO]/`.

---

## 🚧 Status do Projeto

**Versão 1.0 - Concluído.**

O projeto está funcional com todas as funcionalidades listadas acima implementadas.

---

## 🔮 Próximos Passos (Possíveis Melhorias)

* [ ] Implementar a persistência do layout e conteúdo no banco de dados com PHP/MySQL.
* [ ] Criar um sistema de contas de usuário (Login/Cadastro).
* [ ] Adicionar mais tipos de widgets (ex: Cotações, Clima, Calendário).
* [ ] Salvar as configurações de tempo do Pomodoro por usuário.

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Feito com por **Marllus Monteiro**.
