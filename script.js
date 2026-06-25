(function() {
    'use strict';

    // ----- 1. DYNAMIC SIZING (keep viewport locked) -----
    function fitScreen() {
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--vw', vw + 'px');

        document.documentElement.style.height = vh + 'px';
        document.body.style.height = vh + 'px';

        const s1 = document.getElementById('screen1');
        if (s1) {
            s1.style.width = vw + 'px';
            s1.style.height = vh + 'px';
        }

        const s2 = document.getElementById('screen2');
        if (s2) {
            s2.style.width = vw + 'px';
            s2.style.height = vh + 'px';
        }
    }

    // ----- 2. TRIGGER BURST ANIMATION (re‑runnable) -----
    function triggerBurst() {
        const text = document.querySelector('.welcome-text');
        if (!text) return;

        // restart text animation
        text.style.animation = 'none';
        void text.offsetWidth;
        text.style.animation = 'burstIn 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards';

        // restart particles
        const particles = document.querySelectorAll('.burst-particle');
        particles.forEach((p, i) => {
            p.style.animation = 'none';
            void p.offsetWidth;
            const delay = 0.05 + (i * 0.015);
            p.style.animation = `particleFly 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`;
        });

        // restart rings
        const rings = document.querySelectorAll('.burst-ring');
        rings.forEach((r, i) => {
            r.style.animation = 'none';
            void r.offsetWidth;
            const delay = i === 0 ? '0s' : '0.15s';
            r.style.animation = `ringExpand 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay} forwards`;
        });
    }

    // ----- 3. HANDLE RESIZE / ORIENTATION -----
    let resizeTimer;

    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            fitScreen();
        }, 150);
    }

    // ----- 4. AUTO SHOW SCREEN 2 AFTER 2 SECONDS -----
    function showScreen2() {
        const screen2 = document.getElementById('screen2');
        if (screen2) {
            // Ensure it's ready for the transition
            screen2.classList.add('active');
            console.log('✅ Screen 2 now visible');
        }
    }

    // ----- 5. INIT -----
    function init() {
        fitScreen();

        // Trigger burst animation on screen 1
        requestAnimationFrame(() => {
            triggerBurst();
        });

        // Show screen 2 after 2 seconds
        setTimeout(showScreen2, 2000);

        // Resize / orientation events
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                fitScreen();
                // Re‑trigger burst on screen 1 if it's still visible (optional)
                // Only if screen1 is still shown; if screen2 is overlaid, we might skip
                // but it doesn't hurt to keep it.
                setTimeout(triggerBurst, 300);
            }, 400);
        });

        // Re‑trigger burst when the tab becomes visible again
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(triggerBurst, 200);
            }
        });

        console.log('✅ Screen 1 ready — burst active, Screen 2 will appear in 2s');
    }

    // ----- START -----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();