// Scroll-triggered card animation with scroll pause
document.addEventListener('DOMContentLoaded', function () {
    const card1 = document.querySelector('.card-1');
    const card2 = document.querySelector('.card-2');
    const card3 = document.querySelector('.card-3');
    const section = card1?.closest('section');

    if (!card1 || !card2 || !card3 || !section) return;

    // Disable animation on mobile/tablet (< 1024px)
    if (window.innerWidth < 1024) return;

    let isAnimating = false;
    let card2Shown = false;
    let card3Shown = false;
    let scrollPosition = 0;
    let lastScrollTop = 0;
    let scrollDirection = 'down';

    // Set initial styles
    function resetCards() {
        card1.style.opacity = '1';
        card1.style.transform = 'translateX(0)';
        card2.style.opacity = '0';
        card2.style.transform = 'translateX(100%)';
        card3.style.opacity = '0';
        card3.style.transform = 'translateX(100%)';
    }

    resetCards();

    // Add transition styles with slow motion
    [card1, card2, card3].forEach(card => {
        card.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
    });

    // Function to disable scrolling
    function disableScroll() {
        scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
    }

    // Function to enable scrolling
    function enableScroll() {
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('width');
        window.scrollTo(0, scrollPosition);
    }

    // Function to animate card appearing (from right)
    function animateCardIn(card, callback) {
        isAnimating = true;
        disableScroll();

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 100);

        // Re-enable scroll after animation completes
        setTimeout(() => {
            isAnimating = false;
            enableScroll();
            if (callback) callback();
        }, 1500);
    }

    // Function to animate card disappearing (to right)
    function animateCardOut(card, callback) {
        isAnimating = true;
        disableScroll();

        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(100%)';
        }, 100);

        // Re-enable scroll after animation completes
        setTimeout(() => {
            isAnimating = false;
            enableScroll();
            if (callback) callback();
        }, 1500);
    }

    // Detect scroll direction
    function updateScrollDirection() {
        const currentScrollTop = window.pageYOffset;
        scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = currentScrollTop;
    }

    // Scroll animation handler
    function handleScroll() {
        if (isAnimating) return;

        updateScrollDirection();

        const card2Rect = card2.getBoundingClientRect();
        const card3Rect = card3.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.7;

        // SCROLLING DOWN - Show cards
        if (scrollDirection === 'down') {
            // Show card-2 when it reaches the trigger point
            if (card2Rect.top <= triggerPoint && !card2Shown && !isAnimating) {
                card2Shown = true;
                animateCardIn(card2);
            }

            // Show card-3 when it reaches the trigger point
            if (card3Rect.top <= triggerPoint && !card3Shown && card2Shown && !isAnimating) {
                card3Shown = true;
                animateCardIn(card3);
            }
        }

        // SCROLLING UP - Hide cards
        if (scrollDirection === 'up') {
            // Hide card-3 when scrolling up past it
            if (card3Rect.top > triggerPoint && card3Shown && !isAnimating) {
                card3Shown = false;
                animateCardOut(card3);
            }

            // Hide card-2 when scrolling up past it
            if (card2Rect.top > triggerPoint && card2Shown && !card3Shown && !isAnimating) {
                card2Shown = false;
                animateCardOut(card2);
            }
        }
    }

    // Listen to scroll events with throttling
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();
});

// Counter animation functionality
document.addEventListener('DOMContentLoaded', function () {
    const parentOfTheCounter = document.querySelector('.parentOfTheCounter');
    const parentOfTheCounterTow = document.querySelector('.parentOfTheCounterTow');
    const parentOfTheCounterThree = document.querySelector('.parentOfTheCounterThree');

    const counter1 = document.querySelector('.counter-1');
    const counter2 = document.querySelector('.counter-2');
    const counter3 = document.querySelector('.counter-3');

    if (!parentOfTheCounter || !parentOfTheCounterTow || !parentOfTheCounterThree) return;
    if (!counter1 || !counter2 || !counter3) return;

    // Counter targets
    const targets = {
        counter1: 120,
        counter2: 98,
        counter3: 74
    };

    // Track if counters have been animated
    let counter1Animated = false;
    let counter2Animated = false;
    let counter3Animated = false;

    // Function to animate counter
    function animateCounter(element, start, end, duration, showPlus = true) {
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = showPlus ? currentValue + '+' : currentValue;

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                element.textContent = showPlus ? end + '+' : end;
            }
        }

        requestAnimationFrame(animation);
    }

    // Function to reset counter
    function resetCounter(element, showPlus = true) {
        element.textContent = showPlus ? '0+' : '0';
    }

    // Initialize counters
    resetCounter(counter1);
    resetCounter(counter2);
    resetCounter(counter3, false); // counter3 without plus sign

    // Scroll handler for counters
    function handleCounterScroll() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.8;

        const parent1Rect = parentOfTheCounter.getBoundingClientRect();
        const parent2Rect = parentOfTheCounterTow.getBoundingClientRect();
        const parent3Rect = parentOfTheCounterThree.getBoundingClientRect();

        // Counter 1
        if (parent1Rect.top <= triggerPoint && parent1Rect.bottom >= 0) {
            if (!counter1Animated) {
                counter1Animated = true;
                animateCounter(counter1, 0, targets.counter1, 2000);
            }
        } else if (parent1Rect.top > triggerPoint || parent1Rect.bottom < 0) {
            if (counter1Animated) {
                counter1Animated = false;
                resetCounter(counter1);
            }
        }

        // Counter 2
        if (parent2Rect.top <= triggerPoint && parent2Rect.bottom >= 0) {
            if (!counter2Animated) {
                counter2Animated = true;
                animateCounter(counter2, 0, targets.counter2, 2000);
            }
        } else if (parent2Rect.top > triggerPoint || parent2Rect.bottom < 0) {
            if (counter2Animated) {
                counter2Animated = false;
                resetCounter(counter2);
            }
        }

        // Counter 3 (without plus sign)
        if (parent3Rect.top <= triggerPoint && parent3Rect.bottom >= 0) {
            if (!counter3Animated) {
                counter3Animated = true;
                animateCounter(counter3, 0, targets.counter3, 2000, false);
            }
        } else if (parent3Rect.top > triggerPoint || parent3Rect.bottom < 0) {
            if (counter3Animated) {
                counter3Animated = false;
                resetCounter(counter3, false);
            }
        }
    }

    // Listen to scroll events
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleCounterScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleCounterScroll();
});

// Accordion functionality
document.addEventListener('DOMContentLoaded', function () {
    const btns = document.querySelectorAll('.accordion-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isOpen = this.classList.contains('open');

            // Close all
            btns.forEach(b => {
                b.classList.remove('open');
                b.nextElementSibling.classList.remove('open');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                this.classList.add('open');
                content.classList.add('open');
            }
        });
    });
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.getElementById('menu-open');
    const closeBtn = document.getElementById('menu-close');
    const nav = document.getElementById('mobile-nav');
    if (openBtn && closeBtn && nav) {
        openBtn.addEventListener('click', () => nav.classList.add('open'));
        closeBtn.addEventListener('click', () => nav.classList.remove('open'));
    }
});
