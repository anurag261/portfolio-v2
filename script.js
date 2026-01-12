document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3. Tech Stack Filtering
    const techCards = document.querySelectorAll('.card');
    const timelineItems = document.querySelectorAll('.timeline-item');

    techCards.forEach(card => {
        card.addEventListener('click', () => {
            // Reset if already active (toggle off)
            if (card.classList.contains('active-filter')) {
                card.classList.remove('active-filter');
                timelineItems.forEach(item => {
                    item.classList.remove('highlight', 'dimmed');
                });
                return;
            }

            // Clear previous active states
            techCards.forEach(c => c.classList.remove('active-filter'));
            card.classList.add('active-filter');

            // Get tech context from card title 
            // (Simple mapping logic: "Backend" -> check for python/django/fastapi etc)
            const techTitle = card.querySelector('.card-title').textContent.toLowerCase();

            timelineItems.forEach(item => {
                const itemTech = item.getAttribute('data-tech');
                if (!itemTech) return;

                let match = false;
                // Mapping logic
                if (techTitle.includes('backend') && (itemTech.includes('django') || itemTech.includes('fastapi') || itemTech.includes('python'))) match = true;
                if (techTitle.includes('data') && (itemTech.includes('airflow') || itemTech.includes('temporal') || itemTech.includes('snowflake') || itemTech.includes('etl') || itemTech.includes('kafka') || itemTech.includes('elasticsearch'))) match = true;
                if (techTitle.includes('reliability') && (itemTech.includes('temporal') || itemTech.includes('celery') || itemTech.includes('kafka'))) match = true;
                if (techTitle.includes('performance') && (itemTech.includes('redis') || itemTech.includes('optimization'))) match = true;

                if (match) {
                    item.classList.add('highlight');
                    item.classList.remove('dimmed');
                } else {
                    item.classList.add('dimmed');
                    item.classList.remove('highlight');
                }
            });
        });
    });

    // Reset filter when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cards-grid') && !e.target.closest('.timeline')) {
            timelineItems.forEach(item => {
                item.classList.remove('highlight', 'dimmed');
            });
            techCards.forEach(c => c.classList.remove('active-filter'));
        }
    });


    // 4. Terminal Interactive Mode
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalToggle = document.getElementById('terminal-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.querySelector('.terminal-output');

    function toggleTerminal() {
        terminalOverlay.classList.toggle('hidden');
        if (!terminalOverlay.classList.contains('hidden')) {
            terminalInput.focus();
        }
    }

    terminalToggle.addEventListener('click', toggleTerminal);
    closeBtn.addEventListener('click', toggleTerminal);

    // Key shortcut (~)
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            toggleTerminal();
            e.preventDefault();
        }
        if (e.key === 'Escape' && !terminalOverlay.classList.contains('hidden')) {
            toggleTerminal();
        }
    });

    // Command Logic
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            processCommand(command);
            terminalInput.value = '';
        }
    });

    function processCommand(cmd) {
        addToOutput(`<span class="prompt">user@anurag:~$</span> ${cmd}`);

        let response = '';
        switch (cmd) {
            case 'help':
                response = 'Available commands: help, whoami, skills, contact, clear, exit';
                break;
            case 'whoami':
                response = 'Anurag Goswami. Backend Engineer @ Cars24. Lover of distributed systems.';
                break;
            case 'skills':
                response = 'Languages: Python, SQL<br>Frameworks: Django, FastAPI<br>Infra: Docker, Kubernetes, AWS<br>Data: Kafka, Redis, Snowflake, Elasticsearch';
                break;
            case 'contact':
                response = 'Email: anurag7017255@gmail.com<br>LinkedIn: linkedin.com/in/anurag-goswami/';
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                return;
            case 'exit':
                toggleTerminal();
                return;
            default:
                response = `Command not found: ${cmd}. Type 'help' for valid commands.`;
        }
        addToOutput(response);
    }

    function addToOutput(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        terminalOutput.appendChild(div);
        // Scroll to bottom
        const body = document.getElementById('terminal-body');
        body.scrollTop = body.scrollHeight;
    }


    // 5. Cursor Parallax Background
    const gridBg = document.querySelector('.grid-background');
    if (gridBg) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // Move background opposite to mouse
            const moveX = -(x * 20);
            const moveY = -(y * 20);

            gridBg.style.backgroundPosition = `${moveX}px ${moveY}px`;
        });
    }

    // 6. Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});
