<?php
session_start();

// Se o usuário já estiver logado, redireciona para o dashboard.
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("location: dashboard.php");
    exit;
}

// Se não estiver logado, mostra a landing page.
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foco Total - Aumente sua Produtividade nos Estudos</title>
    <meta name="description" content="Organize seus estudos, gerencie seu tempo com o método Pomodoro e alcance seus objetivos com a ferramenta definitiva para estudantes de TI.">

    <!-- Fonts and Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <!-- Link para o arquivo de estilo da landing page -->
    <link rel="stylesheet" href="css/landing.css">
</head>
<body>

    <header class="header">
        <nav class="navbar">
            <a href="#" class="nav-logo">Foco Total</a>
            <div class="nav-links">
                <a href="#features">Funcionalidades</a>
                <a href="#testimonials">Depoimentos</a>
            </div>
            <div class="nav-cta">
                <a href="/foco-total/login.php" class="btn btn-primary">Abrir App</a>
            </div>
            <button class="nav-menu-btn" aria-label="Abrir menu">
                <i class="fas fa-bars"></i>
            </button>
        </nav>
    </header>

    <main>

        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <h1>Foco total nos seus estudos e projetos.</h1>
                <p>A ferramenta que centraliza tudo o que você precisa para se concentrar e ser mais produtivo, seja nos estudos, no trabalho ou em projetos pessoais.</p>
                <a href="/foco-total/register.php" class="btn btn-primary">Comece a usar de graça</a>
                <div class="hero-social-proof">
                    <div class="avatar-group">
                        <!-- Placeholders para avatares -->
                        <img class="avatar" src="https://i.pravatar.cc/32?img=1" alt="Usuário 1">
                        <img class="avatar" src="https://i.pravatar.cc/32?img=2" alt="Usuário 2">
                        <img class="avatar" src="https://i.pravatar.cc/32?img=3" alt="Usuário 3">
                    </div>
                    <span>Junte-se a +<span id="student-counter" data-target="1000">0</span> pessoas focadas</span>
                </div>
                <div class="dashboard-image-container fade-in-section">
                    <div class="dashboard-placeholder"></div>
                </div>
            </div>
        </section>

        <!-- Social Proof Logos -->
        <section class="social-proof-logos">
            <div class="container fade-in-section">
                <p>CONFIADO POR ESTUDANTES E PROFISSIONAIS DAS MELHORES INSTITUIÇÕES</p>
                <div class="logos-container">
                    <!-- Placeholders para logos -->
                    <span>UFMG</span>
                    <span>USP</span>
                    <span>UNICAMP</span>
                    <span>ITA</span>
                    <span>PUC</span>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features fade-in-section">
            <div class="container">
                <h2>Tudo que você precisa para se concentrar</h2>
                <p>Ferramentas integradas em um dashboard personalizável para criar seu ambiente de foco perfeito.</p>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="icon"><i class="fas fa-clock"></i></div>
                        <h3>Timer Pomodoro Inteligente</h3>
                        <p>Alterne entre ciclos de foco e descanso para maximizar sua produtividade e evitar o esgotamento.</p>
                    </div>
                    <div class="feature-card">
                        <div class="icon"><i class="fas fa-tasks"></i></div>
                        <h3>Lista de Tarefas Integrada</h3>
                        <p>Organize suas atividades, priorize o que é importante e acompanhe seu progresso, tudo no mesmo lugar.</p>
                    </div>
                    <div class="feature-card">
                        <div class="icon"><i class="fas fa-th-large"></i></div>
                        <h3>Dashboard Personalizável</h3>
                        <p>Arraste e redimensione os blocos para criar o layout que melhor se adapta ao seu fluxo de trabalho.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section id="testimonials" class="testimonials fade-in-section">
            <div class="container testimonials-grid">
                <div class="testimonials-content">
                    <h2>Feito para quem busca concentração.</h2>
                    <p>Nós entendemos a dificuldade de se manter focado. Por isso, criamos uma ferramenta que realmente ajuda a entrar e permanecer no estado de 'flow'.</p>
                    <a href="/foco-total/register.php" class="btn btn-primary">Experimente agora</a>
                </div>
                <div class="testimonial-cards">
                    <div class="testimonial-card">
                        <p>"O Foco Total mudou meu jeito de estudar. A combinação do Pomodoro com a lista de tarefas no mesmo dashboard é genial."</p>
                        <div class="testimonial-author">
                            <img class="avatar" src="https://i.pravatar.cc/40?img=4" alt="Autor do depoimento">
                            <div>
                                <div class="author-name">Juliana S.</div>
                                <div class="author-role">Estudante de Ciência da Computação</div>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <p>"Finalmente uma ferramenta que não é cheia de distrações. É limpa, rápida e me ajuda a fazer o que preciso."</p>
                        <div class="testimonial-author">
                            <img class="avatar" src="https://i.pravatar.cc/40?img=5" alt="Autor do depoimento">
                            <div>
                                <div class="author-name">Ricardo L.</div>
                                <div class="author-role">Desenvolvedor & Criativo</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <footer class="footer">
        <div class="container footer-grid">
            <div class="footer-about">
                <a href="#" class="logo">Foco Total</a>
                <p>A ferramenta definitiva para produtividade e concentração.</p>
            </div>
            <div class="footer-col">
                <h4>Produto</h4>
                <ul>
                    <li><a href="#">Funcionalidades</a></li>
                    <li><a href="#">Changelog</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Empresa</h4>
                <ul>
                    <li><a href="#">Sobre nós</a></li>
                    <li><a href="#">Contato</a></li>
                    <li><a href="#">Termos de Serviço</a></li>
                </ul>
            </div>
            <div class="footer-newsletter">
                <h4>Fique por dentro</h4>
                <p>Receba dicas de produtividade e novidades do produto.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="seu@email.com">
                    <button type="submit"><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
        <div class="container footer-bottom">
            <p>&copy; 2024 Foco Total. Feito com ❤️ por Marllus Monteiro.</p>
        </div>
    </footer>

    <!-- Link para o arquivo de script da landing page -->
    <script src="js/landing.js"></script>
</body>
</html>