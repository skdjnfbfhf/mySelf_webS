(function () {
    'use strict';

    // DOM Elements
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.scene');

    // Smooth scroll & prevent default anchor jump
    tocLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Wheel scroll: 한 번 스크롤 시 다음/이전 섹션으로 부드럽게 이동
    let scrollTimeout = null;
    const scrollDelay = 600;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function getCurrentSectionIndex() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const offset = windowHeight * 0.3;

        let currentIndex = 0;
        sections.forEach(function (section, index) {
            if (scrollY >= section.offsetTop - offset) {
                currentIndex = index;
            }
        });
        return currentIndex;
    }

    document.addEventListener('wheel', function (e) {
        if (scrollTimeout) return;

        const currentIndex = getCurrentSectionIndex();
        let nextIndex = currentIndex;

        if (e.deltaY > 30) {
            nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else if (e.deltaY < -30) {
            nextIndex = Math.max(currentIndex - 1, 0);
        }

        if (nextIndex !== currentIndex) {
            e.preventDefault();
            scrollToSection(nextIndex);
            scrollTimeout = setTimeout(function () {
                scrollTimeout = null;
            }, scrollDelay);
        }
    }, { passive: false });

    // Update active TOC link based on scroll position
    function updateActiveLink() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const offset = windowHeight * 0.3;

        let currentSection = sections[0];

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - offset) {
                currentSection = section;
            }
        });

        tocLinks.forEach(function (link) {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href') === '#' + currentSection.id) {
                link.classList.add('active');
            }
        });
    }

    // Throttle scroll handler for performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Initial active state
    updateActiveLink();
})();
