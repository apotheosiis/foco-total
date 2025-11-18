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