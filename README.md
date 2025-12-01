# 🚀 Foco Total - Dashboard de Produtividade

Uma aplicação web full-stack de produtividade construída com **PHP, MySQL e JavaScript puro**. O "Foco Total" oferece um santuário digital onde os usuários podem criar e personalizar múltiplos "workspaces" com as ferramentas que precisam para se concentrar e evitar distrações.


---

## ✨ Funcionalidades Principais

* **🔐 Sistema de Contas de Usuário:** Cadastro e Login seguros para que cada usuário tenha seu próprio ambiente privado.
* **🗂️ Gerenciamento de Workspaces:** Crie, renomeie, carregue e delete múltiplos workspaces (ex: "Trabalho", "Estudos") para diferentes contextos.
* **💾 Persistência no Banco de Dados:** Todo o layout dos widgets, conteúdo das tarefas e configurações são salvos no **MySQL**, garantindo que seu ambiente esteja sempre como você deixou, em qualquer dispositivo.
* **🧩 Dashboard Modular (GridStack.js):** Organize os blocos de ferramentas arrastando, soltando e redimensionando-os livremente na tela.
* **Sistema de Widgets:**
    * **⏰ Pomodoro Timer:** Um timer completo com modos de Foco, Pausa Curta e Pausa Longa, totalmente configurável.
    * **📝 Lista de Tarefas (Task List):** Adicione, marque como concluído, delete tarefas e defina uma tarefa para focar durante um ciclo Pomodoro.
    * **✍️ Bloco de Texto (Quill.js):** Um editor de texto rico para anotações rápidas, com formatação de negrito, itálico, listas e mais.
    * **🖼️ Bloco de Imagem:** Personalize seu espaço com imagens padrão ou fazendo **upload** de seus próprios arquivos.
    * **🎵 Bloco de Música:** Ouça playlists do YouTube com opções padrão ou colando sua própria URL de um vídeo.
* **⏰ Pomodoro Timer:** Um timer completo com modos de Foco, Pausa Curta e Pausa Longa, totalmente configurável.
* **📝 Lista de Tarefas (Task List):** Adicione, marque como concluído e delete tarefas.
* ** Tema Claro e Escuro:** Alterne entre os modos visualmente para melhor conforto.
* **🔊 Notificação Sonora:** Um som suave avisa quando um ciclo do Pomodoro termina.

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
    * **Quill.js:** Para o widget de editor de texto rico.
* **Ambiente de Desenvolvimento:**
    * `XAMPP` (ou similar, como WAMP/MAMP)
    * `phpMyAdmin`

---

## 🏁 Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/apotheosiis/foco-total.git
    ```

2.  **Ambiente Local:**
    * Certifique-se de ter um ambiente de servidor local como o **XAMPP** ou **WAMP** instalado e rodando (com Apache e MySQL ativos).
    * Mova a pasta do projeto clonado para dentro da pasta `htdocs` (no XAMPP) ou `www` (no WAMP).

3.  **Banco de Dados:**
    * Abra o **phpMyAdmin** (geralmente em `http://localhost/phpmyadmin`).
    * Crie um novo banco de dados chamado `foco_total_db`.
    * Selecione o banco `foco_total_db`, vá para a aba **"SQL"** e cole o conteúdo do arquivo `database.sql` para criar as tabelas.

4.  **Configuração:**
    * No arquivo `db_connect.php` (ou `config/database.php`), verifique se as credenciais (`DB_USERNAME`, `DB_PASSWORD`) correspondem à configuração do seu MySQL local.

5.  **Acesse o Projeto:**
    * Abra seu navegador e acesse `http://localhost/foco-total/`. Você será direcionado para a landing page ou para a página de login.

---

## 🚧 Status do Projeto

**Versão 1.0 - Concluído.**

O projeto está funcional com todas as funcionalidades listadas acima implementadas.

---

## 🔮 Próximos Passos (Possíveis Melhorias)

* [ ] Salvar as configurações de tempo do Pomodoro (durações, volume) no banco de dados por usuário.
* [ ] Adicionar funcionalidade de "Esqueci minha senha".
* [ ] Adicionar mais tipos de widgets (ex: Cotações, Clima, Calendário).
* [ ] Melhorar a experiência do dashboard em dispositivos móveis.

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Feito com por **Marllus Monteiro**.
