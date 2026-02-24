/* ===================================================
   DailyTechGuide – main.js
   Handles: sticky nav, mobile menu, cookie bar,
            lazy images, back-to-top, reading progress
   =================================================== */

(function () {
  'use strict';

  /* ---- DOM Ready Helper ---- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* =============================================
       STICKY NAVBAR – add shadow on scroll
       ============================================= */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    /* =============================================
       MOBILE MENU
       ============================================= */
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileClose = document.querySelector('.mobile-nav-close');

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });

      if (mobileClose) {
        mobileClose.addEventListener('click', function () {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      }

      // Close on backdrop click
      mobileNav.addEventListener('click', function (e) {
        if (e.target === mobileNav) {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });

      // Close on link click
      mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    /* =============================================
       COOKIE NOTICE
       ============================================= */
    const cookieBar = document.getElementById('cookieBar');
    if (cookieBar) {
      const accepted = localStorage.getItem('dtg_cookie_accepted');
      if (!accepted) {
        cookieBar.classList.remove('hidden');
      }

      const acceptBtn = document.getElementById('cookieAccept');
      const dismissBtn = document.getElementById('cookieDismiss');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
          localStorage.setItem('dtg_cookie_accepted', '1');
          cookieBar.classList.add('hidden');
          setTimeout(function () { cookieBar.remove(); }, 500);
        });
      }
      if (dismissBtn) {
        dismissBtn.addEventListener('click', function () {
          cookieBar.classList.add('hidden');
          setTimeout(function () { cookieBar.remove(); }, 500);
        });
      }
    }

    /* =============================================
       BACK TO TOP
       ============================================= */
    const btt = document.getElementById('backToTop');
    if (btt) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
          btt.classList.add('visible');
        } else {
          btt.classList.remove('visible');
        }
      }, { passive: true });

      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* =============================================
       READING PROGRESS BAR (article pages)
       ============================================= */
    const progressBar = document.getElementById('readingProgress');
    if (progressBar) {
      window.addEventListener('scroll', function () {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
      }, { passive: true });
    }

    /* =============================================
       LAZY LOADING IMAGES (native + intersection observer fallback)
       ============================================= */
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    } else if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            lazyObserver.unobserve(img);
          }
        });
      }, { rootMargin: '0px 0px 200px 0px' });

      document.querySelectorAll('img[data-src]').forEach(function (img) {
        lazyObserver.observe(img);
      });
    }

    /* =============================================
       ACTIVE NAV LINK (highlight current page)
       ============================================= */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav-panel a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || href.endsWith('/' + currentPage))) {
        link.classList.add('active');
      }
    });

    /* =============================================
       NEWSLETTER FORM – simple feedback
       ============================================= */
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        const btn = newsletterForm.querySelector('button');
        if (input && input.value) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = '#0d3d22';
          input.value = '';
          input.placeholder = 'Thank you for subscribing!';
          input.disabled = true;
          btn.disabled = true;
        }
      });
    }

    /* =============================================
       CONTACT FORM
       ============================================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#0d5c32';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 4000);
      });
    }

    /* =============================================
       SMOOTH SCROLL for anchor links
       ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* =============================================
       SET CURRENT YEAR in footer
       ============================================= */
    const yearEls = document.querySelectorAll('.current-year');
    yearEls.forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

  });

})();
