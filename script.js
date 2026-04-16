// No dynamic background changes - keeping static yellow theme

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul.nav-links li a');
const navToggle = document.getElementById('nav-toggle');
const nav = document.querySelector('nav');

const animatedSections = new Set();

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });

            if (!animatedSections.has(id)) {
                animatedSections.add(id);
                autoTypewriterSection(entry.target);
            }
        }
    });
}, { threshold: 0.6 });

sections.forEach(section => sectionObserver.observe(section));

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('open');
    nav.classList.toggle('nav-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

const typewriterDelay = 18;

async function typewriterEffect(element) {
    const originalText = element.textContent;
    element.textContent = '';

    for (let i = 0; i < originalText.length; i++) {
        element.textContent += originalText.charAt(i);
        await new Promise((r) => setTimeout(r, typewriterDelay));
    }
}

async function typeAllTextInCard(card) {
    const textElements = card.querySelectorAll('h3, p, .subtitle, .level-detail, .program-info');

    for (const el of textElements) {
        if (!el.textContent.trim() || el.dataset.typed) continue;
        el.dataset.typed = 'true';
        await typewriterEffect(el);
    }
}

async function autoTypewriterSection(section) {
    if (section.id === 'contact' || section.id === 'projects' || section.id === 'references') return;

    const cardSelectors = '.info-card, .seminar-card, .achievement-card, .timeline-card';
    const cards = Array.from(section.querySelectorAll(cardSelectors));

    if (section.id === 'academic') {
        cards.forEach(card => card.classList.add('card-visible'));
        for (const card of cards) {
            await typeAllTextInCard(card);
        }
        return;
    }

    for (const card of cards) {
        card.classList.remove('card-visible');
    }

    for (const card of cards) {
        card.classList.add('card-visible');
        await typeAllTextInCard(card);
        await new Promise((r) => setTimeout(r, 120));
    }
}

