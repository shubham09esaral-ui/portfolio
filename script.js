/**
 * Shubham Bhatt Portfolio Script
 */
(function() {
  const root = document.documentElement;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle with localStorage persistence
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      root.setAttribute('data-theme', savedTheme);
    }
  } catch (e) {
    // Local storage inaccessible (e.g., privacy mode)
  }

  const themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      const isDark = root.getAttribute('data-theme') === 'dark' || 
        (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const nextTheme = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {}
    });
  }

  // Mobile menu navigation
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menu');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll spy for active navigation state
  const navLinks = Array.from(document.querySelectorAll('#nav a'));
  const spyObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(link) {
          link.classList.toggle('on', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  navLinks.forEach(function(link) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      spyObserver.observe(target);
    }
  });

  // Reveal elements and animate numeric counters
  function animateCounter(el) {
    const targetNum = +el.dataset.n;
    const suffix = el.dataset.suf || '';
    let startTime = null;

    if (isReducedMotion) {
      el.textContent = targetNum + suffix;
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1100, 1);
      // Ease out cubic
      const currentVal = Math.round(targetNum * (1 - Math.pow(1 - progress, 3)));
      el.textContent = currentVal + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        const counter = entry.target.querySelector('[data-n]');
        if (counter) {
          animateCounter(counter);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.rv').forEach(function(el) {
    revealObserver.observe(el);
  });

  // Rotating roles in hero section
  const roles = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Angular', 'Next.js'];
  let roleIndex = 0;
  const roleElement = document.getElementById('rot');

  if (roleElement && !isReducedMotion) {
    setInterval(function() {
      roleElement.style.opacity = '0';
      setTimeout(function() {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.textContent = roles[roleIndex];
        roleElement.style.opacity = '1';
      }, 300);
    }, 2200);
  }

  // Interactive spotlight hover effect on cards
  document.querySelectorAll('.card').forEach(function(card) {
    card.addEventListener('pointermove', function(e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  // Current year in footer
  const yearElement = document.getElementById('yr');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();
