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

    <style>
        /* --- Paleta de Cores (Variáveis CSS) --- */
        :root {
            --primary-color: #8B5CF6;
            --secondary-color: #A78BFA;
            --bg-page: #F9FAFB; /* Um branco levemente acinzentado para suavidade */
            --bg-card: #FFFFFF;
            --bg-dark: #111827;
            --text-dark: #1F2937;
            --text-light: #6B7280;
            --border-color: #E5E7EB;
            --shadow-color: rgba(100, 116, 139, 0.1);
            --font-family: 'Inter', sans-serif;
            --radius-md: 16px;
            --radius-lg: 24px;
        }

        /* --- Reset e Base --- */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
            background-color: var(--bg-page);
            color: var(--text-dark);
            font-family: var(--font-family);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }

        /* --- Componentes Reutilizáveis --- */
        .btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary { background-color: var(--primary-color); color: white; }
        .btn-secondary { background-color: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px var(--shadow-color); }

        /* --- Navbar --- */
        .navbar {
            position: sticky;
            top: 20px;
            margin: 20px auto;
            width: calc(100% - 40px);
            max-width: 1100px;
            padding: 12px 20px;
            border-radius: var(--radius-lg);
            background-color: rgba(255, 255, 255, 0.7);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 100;
        }
        .nav-logo { font-size: 1.5rem; font-weight: 700; color: var(--primary-color); text-decoration: none; }
        .nav-links { display: flex; gap: 30px; }
        .nav-links a { color: var(--text-light); text-decoration: none; font-weight: 500; transition: color 0.2s ease; }
        .nav-links a:hover { color: var(--primary-color); }
        .nav-menu-btn { display: none; } /* Para mobile */

        /* --- Seções --- */
        section { padding: 80px 0; }

        /* --- Hero Section --- */
        .hero { text-align: center; padding-top: 60px; }
        .hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; max-width: 800px; margin: 0 auto 20px; line-height: 1.2; }
        .hero p { font-size: 1.2rem; color: var(--text-light); max-width: 600px; margin: 0 auto 30px; }
        .hero .btn { padding: 16px 32px; font-size: 1.1rem; }
        .hero-social-proof { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 20px; color: var(--text-light); }
        .avatar-group { display: flex; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--bg-page); margin-left: -10px; }
        .avatar:first-child { margin-left: 0; }
        .dashboard-image-container {
            margin-top: 60px;
            padding: 20px;
            border-radius: var(--radius-lg);
            background-color: var(--bg-card);
            box-shadow: 0 20px 50px -10px var(--shadow-color);
            border: 1px solid var(--border-color);
        }
        .dashboard-placeholder {
            width: 100%;
            height: 0;
            padding-bottom: 56.25%; /* Proporção 16:9 */
            border-radius: var(--radius-md);
            /* --- AQUI ESTÁ A MÁGICA --- */
            background-image: url('images/dashboard-preview.png'); /* Caminho para sua imagem */
            background-size: cover; /* Garante que a imagem cubra todo o espaço */
            background-position: center; /* Centraliza a imagem */
        }

        /* --- Animações Sutis --- */
        .fade-in-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }


        /* --- Social Proof (Logos) --- */
        .social-proof-logos { text-align: center; padding: 40px 0; }
        .social-proof-logos p { margin-bottom: 30px; color: var(--text-light); font-weight: 500; }
        .logos-container { display: flex; justify-content: center; align-items: center; gap: 60px; flex-wrap: wrap; }
        .logos-container span { font-size: 1.5rem; font-weight: 600; color: var(--border-color); }

        /* --- Features Section --- */
        .features { text-align: center; }
        .features h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 20px; }
        .features > p { font-size: 1.1rem; color: var(--text-light); max-width: 600px; margin: 0 auto 60px; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .feature-card {
            background-color: var(--bg-card);
            padding: 30px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            text-align: left;
            box-shadow: 0 4px 20px var(--shadow-color);
        }
        .feature-card .icon { font-size: 1.5rem; color: var(--primary-color); margin-bottom: 15px; }
        .feature-card h3 { font-size: 1.2rem; margin-bottom: 10px; }
        .feature-card p { color: var(--text-light); }

        /* --- Testimonials Section --- */
        .testimonials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .testimonials-content h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 20px; }
        .testimonials-content p { font-size: 1.1rem; color: var(--text-light); margin-bottom: 30px; }
        .testimonial-cards { display: flex; flex-direction: column; gap: 20px; }
        .testimonial-card {
            background-color: var(--bg-card);
            padding: 25px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 20px var(--shadow-color);
        }
        .testimonial-card p { font-style: italic; margin-bottom: 15px; }
        .testimonial-author { display: flex; align-items: center; gap: 10px; }
        .testimonial-author .author-name { font-weight: 600; }
        .testimonial-author .author-role { color: var(--text-light); font-size: 0.9rem; }

        /* --- Footer --- */
        .footer {
            background-color: var(--bg-dark);
            color: #9CA3AF;
            padding: 60px 0;
        }
        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 2fr;
            gap: 40px;
        }
        .footer-about .logo { color: white; margin-bottom: 15px; display: block; }
        .footer-col h4 { font-size: 1rem; font-weight: 600; color: white; margin-bottom: 15px; }
        .footer-col ul { list-style: none; }
        .footer-col ul li { margin-bottom: 10px; }
        .footer-col ul a { color: #9CA3AF; text-decoration: none; transition: color 0.2s ease; }
        .footer-col ul a:hover { color: white; }
        .newsletter-form { display: flex; }
        .newsletter-form input {
            flex-grow: 1;
            padding: 10px 15px;
            border: 1px solid #4B5563;
            background-color: #374151;
            border-radius: var(--radius-md) 0 0 var(--radius-md);
            color: white;
            outline: none;
        }
        .newsletter-form button {
            padding: 10px 15px;
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
            border: none;
            background-color: var(--primary-color);
            color: white;
            cursor: pointer;
        }
        .footer-bottom {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #374151;
            text-align: center;
            font-size: 0.9rem;
        }

        /* --- Responsividade (Mobile) --- */
        @media (max-width: 768px) {
            .nav-links, .nav-cta { display: none; }
            .nav-menu-btn { display: block; }

            section { padding: 60px 0; }
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1rem; }

            .features-grid { grid-template-columns: 1fr; }
            .testimonials-grid { grid-template-columns: 1fr; }
            .footer-grid { grid-template-columns: 1fr 1fr; }
            .footer-about, .footer-newsletter { grid-column: 1 / -1; }
        }

    </style>
</head>
<body>

    <header class="header">
        <nav class="navbar">
            <a href="#" class="nav-logo">Foco Total</a>
            <div class="nav-links">
                <a href="#features">Funcionalidades</a>
                <a href="#testimonials">Depoimentos</a>
                <a href="#">Preços</a>
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
                <p>Organize suas tarefas, gerencie seu tempo com o método Pomodoro e mantenha a concentração com a ferramenta definitiva para estudantes de TI.</p>
                <a href="/foco-total/register.php" class="btn btn-primary">Comece a usar de graça</a>
                <div class="hero-social-proof">
                    <div class="avatar-group">
                        <!-- Placeholders para avatares -->
                        <img class="avatar" src="https://i.pravatar.cc/32?img=1" alt="Usuário 1">
                        <img class="avatar" src="https://i.pravatar.cc/32?img=2" alt="Usuário 2">
                        <img class="avatar" src="https://i.pravatar.cc/32?img=3" alt="Usuário 3">
                    </div>
                    <span>Junte-se a +<span id="student-counter" data-target="1000">0</span> estudantes focados</span>
                </div>
                <div class="dashboard-image-container fade-in-section">
                    <div class="dashboard-placeholder"></div>
                </div>
            </div>
        </section>

        <!-- Social Proof Logos -->
        <section class="social-proof-logos">
            <div class="container fade-in-section">
                <p>CONFIADO POR ESTUDANTES DAS MELHORES INSTITUIÇÕES</p>
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
                    <h2>Feito por estudantes, para estudantes.</h2>
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
                                <div class="author-role">Desenvolvedor Jr. & Estudante</div>
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
                    <li><a href="#">Preços</a></li>
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

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const sectionsToAnimate = document.querySelectorAll('.fade-in-section');

            if (!sectionsToAnimate) return;

            const observerOptions = {
                root: null, // Observa em relação ao viewport
                rootMargin: '0px',
                threshold: 0.1 // Aciona quando 10% do elemento está visível
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Para a observação após a animação
                    }
                });
            }, observerOptions);

            sectionsToAnimate.forEach(section => {
                observer.observe(section);
            });

            // --- Lógica para Animação do Contador ---
            const counterElement = document.getElementById('student-counter');

            const animateCounter = (element) => {
                const target = +element.dataset.target;
                const duration = 2000; // 2 segundos
                const start = 0;
                let startTime = null;

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const currentValue = Math.floor(progress * (target - start) + start);
                    
                    // Formata o número com ponto para milhares
                    element.innerText = currentValue.toLocaleString('pt-BR');

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            };

            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            if (counterElement) {
                counterObserver.observe(counterElement);
            }
        });
    </script>
</body>
</html>