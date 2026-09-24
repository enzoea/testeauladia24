(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  /* ---------- Header: transparente sobre o hero, sólido após rolar ---------- */
  var header = document.getElementById('siteHeader');
  var heroEl = document.querySelector('.hero');
  if (header) {
    var getThreshold = function () {
      if (!heroEl) return 8;
      return Math.max(heroEl.offsetHeight - header.offsetHeight - 40, 8);
    };
    var threshold = getThreshold();
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { threshold = getThreshold(); }, { passive: true });
    onScroll();
  }

  /* ---------- Modelo: troca de cor e vista frontal/lateral ---------- */
  var modelsSection = document.querySelector('.models');
  if (modelsSection) {
    var modelImg = modelsSection.querySelector('.models-media img');
    var toggleBtn = modelsSection.querySelector('[data-view-toggle]');
    var swatches = modelsSection.querySelectorAll('.swatch');
    var colorName = modelsSection.querySelector('.color-name');
    var showingSide = false;

    if (toggleBtn && modelImg) {
      toggleBtn.addEventListener('click', function () {
        showingSide = !showingSide;
        var nextSrc = showingSide ? modelImg.getAttribute('data-side') : modelImg.getAttribute('data-front');
        modelImg.style.opacity = '0';
        window.setTimeout(function () {
          modelImg.src = nextSrc;
          modelImg.style.opacity = '1';
        }, 150);
        toggleBtn.textContent = showingSide ? 'Ver frente' : 'Ver lateral';
        toggleBtn.setAttribute('aria-label', showingSide ? 'Ver vista frontal da Vitta Vision' : 'Ver vista lateral da Vitta Vision');
      });
    }

    swatches.forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        if (swatch.classList.contains('is-active')) return;

        swatches.forEach(function (s) {
          s.classList.remove('is-active');
          s.setAttribute('aria-pressed', 'false');
        });
        swatch.classList.add('is-active');
        swatch.setAttribute('aria-pressed', 'true');

        if (colorName) {
          var nextName = swatch.getAttribute('aria-label') || '';
          if (prefersReducedMotion) {
            colorName.textContent = nextName;
          } else {
            colorName.classList.add('is-fading');
            window.setTimeout(function () {
              colorName.textContent = nextName;
              colorName.classList.remove('is-fading');
            }, 200);
          }
        }
      });
    });
  }

  /* ---------- Detalhes: imagem fixa, label ativa conforme o scroll ---------- */
  var detailLabels = document.querySelectorAll('.detail-label');
  if ('IntersectionObserver' in window && detailLabels.length) {
    var detailObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    );
    detailLabels.forEach(function (label) { detailObserver.observe(label); });
  } else {
    detailLabels.forEach(function (label) { label.classList.add('is-active'); });
  }

  /* ---------- Revelar elementos ao entrar na viewport ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
