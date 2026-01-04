document.addEventListener('DOMContentLoaded', () => {

    // --- Accordion Logic ---
    // --- Accordion Logic (Removed) ---
    // Links are now direct.

    // --- Voice Message Logic ---
    const voiceBtn = document.getElementById('voice-play-btn');
    // Pre-load audio
    const voiceAudio = new Audio('assets/record/voice_message.mp3');

    if (voiceBtn) {
        const voiceIcon = voiceBtn.querySelector('i');
        const voiceText = voiceBtn.querySelector('span');

        voiceBtn.addEventListener('click', () => {
            if (voiceAudio.paused) {
                voiceAudio.play();
                voiceBtn.classList.add('playing');
                if (voiceIcon) voiceIcon.className = 'ph ph-pause-circle';
                if (voiceText) voiceText.textContent = 'Pause Voice Message';
            } else {
                voiceAudio.pause();
                voiceBtn.classList.remove('playing');
                if (voiceIcon) voiceIcon.className = 'ph ph-play-circle';
                if (voiceText) voiceText.textContent = 'Play Voice Message';
            }
        });

        voiceAudio.addEventListener('ended', () => {
            voiceBtn.classList.remove('playing');
            if (voiceIcon) voiceIcon.className = 'ph ph-play-circle';
            if (voiceText) voiceText.textContent = 'Play Voice Message';
        });
    }

    const filterLinks = document.querySelectorAll('.submenu-item');
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // In a real app, this would filter the grid
            // const filterValue = link.getAttribute('data-filter');
            // filterGrid(filterValue);
        });
    });

    // --- Smooth Scrolling for Sidebar Links ---
    const links = document.querySelectorAll('a[href^="#"]:not(.has-submenu)');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active state
                document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
                // Use closest to handle icons/spans inside anchors
                link.closest('a').classList.add('active');
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with data-animate
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // Special case for filtering works card delay
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.setAttribute('data-animate', 'fade-up');
        observer.observe(card);
    });

    // --- Active Link on Scroll ---
    const mainContent = document.querySelector('.main-content'); // Assuming main content scrolls
    const sections = document.querySelectorAll('.content-section');

    // Main content scroll listener required because body overflow might be hidden
    // or window depends on layout
    const scrollContainer = document.querySelector('.main-content') || window;

    scrollContainer.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust offset
            if ((scrollContainer === window ? window.scrollY : scrollContainer.scrollTop) >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            document.querySelectorAll('.nav-item').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');

                    // Also expand parent group if needed
                    const parentGroup = link.closest('.nav-group');
                    if (parentGroup) parentGroup.classList.add('open');
                }
            });
        }
    });



    // --- Works Modal Logic ---
    const modal = document.getElementById('works-modal');
    const modalClose = document.querySelector('.modal-close');
    const worksList = document.querySelectorAll('.work-card');

    // Modal Elements
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    const mTags = document.getElementById('modal-tags');
    const mImage = document.getElementById('modal-image');

    if (worksList && modal) {
        worksList.forEach(card => {
            // Click Event
            card.addEventListener('click', () => {
                // Extract Info
                const title = card.querySelector('h3').innerText;
                const desc = card.querySelector('p').innerText;
                const tags = card.querySelector('.tags').innerHTML;
                const imageContent = card.querySelector('.work-image').innerHTML;

                // Populate
                mTitle.innerText = title;
                mDesc.innerText = desc + "\n\n(Detailed description would go here... This is a demo description populating from the card summary.)";
                mTags.innerHTML = tags;

                // For image, inject directly into the scrolling container
                const imgContainer = document.querySelector('.modal-image-container');
                imgContainer.innerHTML = imageContent;

                // Show
                modal.classList.add('open');
            });
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    if (modal) {
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    }

    // --- Mobile Sidebar Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-item');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking a link (mobile UX)
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1100) { // Updated to match new breakdown
                closeSidebar();
            }
        });
    });

    // --- View More Works Logic ---
    const loadMoreContainer = document.getElementById('works-load-more');
    const loadMoreBtn = loadMoreContainer ? loadMoreContainer.querySelector('button') : null;

    // Initial State: Show only first 4
    const workItems = document.querySelectorAll('.work-card');
    const VISIBLE_COUNT = 4;

    if (workItems.length > VISIBLE_COUNT) {
        // Hide items beyond limit
        workItems.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                item.classList.add('hidden');
            }
        });

        // Show button
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'flex';
        }

        // Click Handler
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Show all hidden items
                workItems.forEach(item => {
                    item.classList.remove('hidden');
                    // Add animation class if desired
                    item.setAttribute('data-animate', 'fade-up');
                    observer.observe(item); // Trigger animation observe
                });

                // Hide button
                loadMoreContainer.style.display = 'none';
            });
        }
    }

});
