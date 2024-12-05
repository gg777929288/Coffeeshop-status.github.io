document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.getElementById('overlay');

    // Toggle navigation on hamburger click
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');

        // Update ARIA attribute
        const expanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', expanded);
    });

    // Close navigation when overlay is clicked
    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        this.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });

    // Handle iframe content loading with fade effect
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            let frame = document.querySelector('.content-frame');
            frame.style.opacity = '0';
            setTimeout(() => {
                frame.style.opacity = '1';
            }, 500);
        });
    });

    // Hide nav-menu on screen resize if necessary
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});