const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
        siteNav.classList.toggle('is-open', !isExpanded);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
            siteNav.classList.remove('is-open');
        });
    });
}

const contactForm = document.querySelector('.contact-form');
const formNote = document.querySelector('.form-note');

if (contactForm && formNote) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) {
            return;
        }

        formNote.textContent = 'Thanks for your message. This demo form is not connected to an inbox yet.';
        formNote.classList.add('is-active');
    });
}
