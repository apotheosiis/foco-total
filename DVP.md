# Documento de Visão: Foco Total

**Versão 1.0**

## 1. Introdução

### 1.1. Propósito
Este documento tem como objetivo definir a visão geral do projeto "Foco Total". Ele servirá como um guia para a equipe de desenvolvimento e stakeholders, garantindo que todos tenham uma compreensão clara dos objetivos, do público-alvo e das funcionalidades da aplicação, alinhando as expectativas e direcionando o processo de desenvolvimento.

### 1.2. Escopo
O "Foco Total" é uma aplicação web de página única (Single Page Application) projetada para ser um ambiente de produtividade personalizável. O escopo deste projeto inclui o desenvolvimento de um dashboard modular com widgets de Pomodoro, Lista de Tarefas, Imagem Motivacional e Player de Música, além de funcionalidades de customização de interface (tema claro/escuro) e persistência do layout do usuário. O projeto não contempla, inicialmente, um sistema de contas de usuário com login/senha, focando-se no armazenamento de dados localmente no navegador.
O escopo do projeto abrange uma solução full-stack, incluindo um sistema completo de autenticação de usuários (cadastro e login), um backend em PHP que serve uma API RESTful para gerenciamento de workspaces, e um banco de dados MySQL para persistir todos os dados do usuário, como seus layouts de widgets e tarefas.

### 1.3. Visão Geral
Este documento está organizado nas seguintes seções: Posicionamento (problema e solução), Descrição dos Stakeholders e Usuários (público-alvo), Visão Geral do Produto, e Funcionalidades do Produto.

---

## 2. Posicionamento

### 2.1. Oportunidade de Negócio
No cenário digital atual, profissionais e estudantes são constantemente bombardeados por notificações, abas de navegador e múltiplas aplicações que competem por sua atenção. Essa fragmentação do ambiente de trabalho digital resulta em perda de foco, queda de produtividade и aumento do estresse. Há uma clara necessidade de uma solução que centralize as ferramentas essenciais de produtividade em um único local, criando um "santuário digital" livre de distrações.

### 2.2. Declaração do Problema

| O Problema de: | A dificuldade de manter o foco em uma única tarefa por longos períodos. |
| :--- | :--- |
| **Afeta:** | Estudantes, profissionais (especialmente remotos e freelancers), escritores, desenvolvedores e qualquer pessoa que busque se organizar ou que tenha problemas de concentração. |
| **O Impacto é:** | Queda na qualidade e eficiência do trabalho/estudo, procrastinação, e uma sensação de sobrecarga de informação e ansiedade. |
| **Uma Solução de Sucesso:** | Seria um ambiente digital unificado, calmo e personalizável que oferece as ferramentas necessárias para uma sessão de trabalho focado, eliminando a necessidade de alternar entre múltiplos aplicativos e sites. |

### 2.3. Declaração de Posição do Produto

| Para: | Estudantes, profissionais e criativos que se sentem sobrecarregados pela desordem digital. |
| :--- | :--- |
| **Que:** | Necessitam de um ambiente de trabalho focado e livre de distrações. |
| **O:** | **Foco Total** |
| **É uma:** | Aplicação web de produtividade. |
| **Que:** | Oferece um dashboard personalizável que centraliza ferramentas como o método Pomodoro, listas de tarefas, música ambiente e imagens motivacionais em uma única página. |
| **Diferente de:** | Aplicativos separados de timer, blocos de notas e players de música. |
| **Nosso produto:** | Cria um santuário digital modular e minimalista, onde o usuário constrói ativamente seu próprio ambiente de foco ideal, promovendo um estado de "fluxo" e imersão na tarefa. |

---

## 3. Descrição dos Stakeholders e Usuários

### 3.1. Stakeholders

| Nome | Descrição | Responsabilidades |
| :--- | :--- | :--- |
| **Professor Rennan(Programação Web)** | Cliente e Avaliador | Avalia a qualidade técnica e funcional do produto final. |
| **Marllus Monteiro** | Desenvolvedor Principal | Responsável por todas as fases do projeto: design, desenvolvimento, testes e implantação. |

### 3.2. Perfil dos Usuários (Personas)

* **Mariana, a Universitária:** Mariana precisa estudar para provas e escrever trabalhos, mas se distrai facilmente com redes sociais e notificações. Ela precisa de uma ferramenta que a ajude a dividir seu tempo de estudo (usando Pomodoro) e a listar as tarefas de cada sessão para não se perder.

* **Carlos, o Desenvolvedor Freelancer:** Carlos trabalha de casa e precisa gerenciar múltiplos projetos. Ele busca uma forma de cronometrar seu tempo de trabalho em uma tarefa específica e manter anotações rápidas, tudo isso enquanto ouve uma música calma para ajudar na concentração, sem precisar abrir o YouTube em outra aba.

* **Ana, a Escritora:** Ana precisa de longos períodos de imersão para escrever. Para ela, o ambiente visual é crucial. Ela quer um espaço de trabalho digital limpo, com uma imagem que a inspire e uma lista simples de metas para o dia, sem a complexidade de softwares de gerenciamento de projetos.

---

## 4. Visão Geral do Produto

### 4.1. Perspectiva do Produto
O "Foco Total" é uma aplicação web cliente-servidor. O frontend, construído com HTML, CSS e JavaScript, é executado no navegador do usuário e se comunica com um backend robusto desenvolvido em PHP. O backend gerencia a lógica de negócios, a autenticação de usuários e a persistência de dados em um banco de dados MySQL.

### 4.2. Resumo das Capacidades
A aplicação permitirá ao usuário:
1.  **Construir um Painel:** Adicionar, remover e mover blocos (widgets) em um quadro.
2.  **Gerenciar o Tempo:** Utilizar um widget de Pomodoro com ciclos configuráveis.
3.  **Organizar Tarefas:** Criar e gerenciar uma lista de afazeres.
4.  **Personalizar o Ambiente:** Adicionar widgets de imagem e música para criar a atmosfera de trabalho desejada.
5.  **Customizar a Interface:** Alternar entre temas claro e escuro.
6.  **Gerenciar Conta:** Criar uma conta, fazer login e ter seus workspaces salvos de forma segura.

---

## 5. Funcionalidades do Produto

* `FUNC-001`: **Dashboard Modular:** O sistema deve fornecer um quadro (grid) onde o usuário pode arrastar e soltar widgets livremente.
* `FUNC-002`: **Widget de Pomodoro:**
    * `FUNC-002.1`: Deve exibir um timer regressivo.
    * `FUNC-002.2`: Deve permitir alternar entre os modos "Foco", "Pausa Curta" e "Pausa Longa".
    * `FUNC-002.3`: Deve permitir configurar a duração de cada modo através de um modal de configurações.
    * `FUNC-002.4`: Deve emitir uma notificação sonora suave ao final de cada ciclo.
* `FUNC-003`: **Widget de Lista de Tarefas (Task List):**
    * `FUNC-003.1`: Deve permitir ao usuário adicionar novas tarefas.
    * `FUNC-003.2`: Deve permitir marcar tarefas como concluídas.
    * `FUNC-003.3`: Deve permitir excluir tarefas individualmente.
    * `FUNC-003.4`: A altura do widget deve se ajustar dinamicamente à quantidade de tarefas.
* `FUNC-004`: **Widget de Imagem:**
    * `FUNC-004.1`: Ao ser adicionado, deve oferecer opções de imagens padrão.
    * `FUNC-004.2`: Deve permitir o upload de uma imagem do computador do usuário.
    * `FUNC-004.3`: A imagem escolhida deve preencher todo o espaço do widget.
* `FUNC-005`: **Widget de Música:**
    * `FUNC-005.1`: Ao ser adicionado, deve oferecer opções de vídeos/playlists padrão.
    * `FUNC-005.2`: Deve permitir que o usuário cole uma URL do YouTube.
    * `FUNC-005.3`: Deve incorporar um player do YouTube que preencha o espaço do widget.
* `FUNC-006`: **Sistema de Widgets:**
    * `FUNC-006.1`: Deve haver um botão central para "Adicionar Bloco".
    * `FUNC-006.2`: Cada bloco deve ter uma opção para ser excluído do dashboard.
* `FUNC-007`: **Persistência de Dados (Backend):** O layout do dashboard e todo o conteúdo dos widgets (tarefas, URLs, etc.) devem ser salvos no banco de dados MySQL, associados à conta do usuário logado. Os dados são restaurados automaticamente ao fazer login.
* `FUNC-008`: **Tema Visual:** O usuário deve poder alternar entre um tema claro e um tema escuro.
* `FUNC-009`: **Gerenciamento de Usuário:**
    * `FUNC-009.1`: O sistema deve fornecer uma página de cadastro para novos usuários.
    * `FUNC-009.2`: O sistema deve fornecer uma página de login para usuários existentes.
    * `FUNC-009.3`: O acesso ao dashboard principal deve ser restrito apenas a usuários autenticados.
    * `FUNC-009.4`: O sistema deve fornecer uma funcionalidade de logout segura.

---

## 6. Fatores de Qualidade (Atributos não funcionais)

* **Usabilidade:** A interface deve ser extremamente intuitiva, minimalista e autoexplicativa.
* **Desempenho:** A aplicação deve ser leve e rápida, sem atrasos ou travamentos, para não se tornar ela mesma uma distração.
* **Estética:** O design deve ser suave, moderno e agradável aos olhos, com animações sutis que melhorem a experiência do usuário.
* **Confiabilidade:** A aplicação deve salvar o estado do usuário de forma confiável, garantindo que seu ambiente de trabalho personalizado não seja perdido.